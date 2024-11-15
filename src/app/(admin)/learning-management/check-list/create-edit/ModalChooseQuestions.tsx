import { colors } from "@/assets/colors";
import { CaretRightIcon } from "@/assets/icons";
import { PlusCircleFilled, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Empty,
  Form,
  Image,
  Input,
  Modal,
  Popover,
  Table,
  Tag,
  message,
} from "antd";
import { UploadFile } from "antd/es/upload/interface";
import React, { useEffect, useState } from "react";
import { CustomTable } from "../ExamList";
import { useQuery } from "@tanstack/react-query";
import Questions from "@/model/Questions";

interface Answer {
  id: number;
  content: string;
  correct: boolean;
}

interface Question {
  id: number;
  question: string;
  files: UploadFile[];
  answers: Answer[];
  type: "single" | "multiple";
}

interface ModalChooseQuestionsProps {
  open: boolean;
  onClose: () => void;
  questions: Question[];
  loading?: boolean;
  number?: any;
  setOpenChooseQuestions?: any;
  openChooseQuestions?: any;
}

export const renderAnswerValue = (listValue: any) => {
  const columns = [
    {
      dataIndex: "content",
      align: "left",
    },
  ];

  return (
    <div className="flex w-full flex-col gap-y-3 bg-white ">
      <div className="px-1 text-base font-semibold">Đáp án</div>
      <CustomTable
        showHeader={false}
        pagination={false}
        columns={columns as any}
        dataSource={listValue}
      />
    </div>
  );
};

const ModalChooseQuestions: React.FC<ModalChooseQuestionsProps> = ({
  open,
  onClose,
  questions,
  loading,
  number,
  openChooseQuestions,
  setOpenChooseQuestions,
}) => {
  const form = Form.useFormInstance();
  const [searchValue, setSearchValue] = useState<string>("");
  // list câu hỏi
  const questionIds = Form.useWatch("questionIds");
  const classRoomId = Form.useWatch("classRoomId");

  // Lưu rowKey của những row đang được mở
  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);

  // lưu những row được chọn
  const [selectedRowId, setSelectedRowId] = useState<string[]>([]);
  const [selectRecords, setSelectRecords] = useState<any[]>([]);

  // preview
  const [preview, setPreview] = useState<{
    open: boolean;
    file: string;
    fileVideo: string;
  }>({
    open: false,
    file: "",
    fileVideo: "",
  });

  // Danh sách câu hỏi theo lớp
  const { data: lstQuestion, isFetching } = useQuery({
    queryKey: ["getLstQuestionClass", classRoomId],
    queryFn: async () => {
      const res = await Questions.getLstQuestionClass(classRoomId);
      return res.data;
    },
    enabled: open && !!classRoomId,
  });

  // Cập nhật dánh sách lựa chọn
  useEffect(() => {
    if (questionIds && open) {
      setSelectedRowId(questionIds);
    }
  }, [questionIds, open]);

  // Chọn ngẫu nhiên các câu hỏi khi mở modal hoặc khi number thay đổi
  useEffect(() => {
    if (open && number && lstQuestion?.length && !questionIds.length) {
      const shuffled = [...lstQuestion].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, number);
      setSelectedRowId(selected.map((q) => q.questionId));
      setSelectRecords(selected);
    }
  }, [open, number, lstQuestion, questionIds]);

  const handleViewImage = (record: any) => {
    setPreview({
      open: true,
      file: record?.imageLocation,
      fileVideo: record?.videoLocation,
    });
  };

  const columns = [
    Table.SELECTION_COLUMN,
    Table.EXPAND_COLUMN,
    {
      title: "Tên câu hỏi",
      dataIndex: "content",
      key: "content",
    },
    {
      title: "Hình ảnh/Video",
      dataIndex: "imageLocation",
      key: "imageLocation",
      render: (imageLocation: string, record: any) => (
        <div>
          <Button onClick={() => handleViewImage(record)}>Xem</Button>
        </div>
      ),
      width: 140,
    },
    {
      title: "Đáp án đúng",
      dataIndex: "answerResList",
      key: "answerResList",
      render: (answerResList: Answer[]) => {
        const answersCorrect = answerResList?.filter(
          (answer) => answer.correct,
        );
        return (
          <>
            {answersCorrect?.slice(0, 3)?.map((answer, index) => (
              <Tag key={index} className="bg-green-500">
                <div className="p-1 text-sm font-bold text-white">
                  {answer.content}
                </div>
              </Tag>
            ))}
            <Popover
              content={
                <>
                  {answersCorrect
                    ?.slice(3, answersCorrect?.length)
                    ?.map((answer, index) => (
                      <Tag key={index} className="bg-green-500">
                        <div className="p-1 text-sm font-bold text-white">
                          {answer.content}
                        </div>
                      </Tag>
                    ))}
                </>
              }
            >
              {answersCorrect.length > 3 && (
                <Tag className="bg-green-500">
                  <div className="p-1 text-sm font-bold text-white">...</div>
                </Tag>
              )}
            </Popover>
          </>
        );
      },
      width: 300,
    },
  ];

  // hàm toggle đóng mở 1 hàng
  const toggleExpandRow = (key: number) => {
    if (expandedRowKeys.includes(key)) {
      setExpandedRowKeys(expandedRowKeys.filter((item) => item !== key));
    } else {
      setExpandedRowKeys([...expandedRowKeys, key]);
    }
  };

  const rowSelection = {
    fixed: true,
    columnWidth: 50,
    selectedRowKeys: selectedRowId,
    onChange: (value: any, record: any) => {
      setSelectedRowId(value);
      setSelectRecords(record);
    },
  };

  return (
    <>
      <Modal
        width={1000}
        title="Ngân hàng câu hỏi theo chủ đề"
        open={open}
        onCancel={() => {
          setSelectedRowId([]);
          setSelectRecords([]);
          onClose();
        }}
        cancelText="Huỷ"
        footer={null}
        maskClosable={false}
        centered
        destroyOnClose
      >
        <div className="container mx-auto p-4">
          <Input
            placeholder="Tìm kiếm câu hỏi"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />

          <div className="my-2 flex items-center gap-x-3 rounded-lg bg-neutral-100 px-4 py-1">
            <div
              aria-hidden="true"
              className="headline-16-bold flex cursor-pointer select-none items-center gap-x-2 p-1 text-primary-600"
              onClick={() => {
                form.setFieldsValue({
                  questionIds: selectedRowId,
                  lstQuestions: selectRecords,
                  numQuestions: selectedRowId?.length,
                });

                message.success("Thêm câu hỏi thành công");
                onClose();
                setSelectedRowId([]);
                setSelectRecords([]);
              }}
            >
              <PlusCircleFilled
                className="hover:text-primary-800"
                style={{ fontSize: 24 }}
                color={colors.primary300}
              />
              Thêm
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="my-2">Tổng số câu hỏi: {lstQuestion?.length}</div>
            <div className="text-right">Đang chọn: {selectedRowId.length}</div>
          </div>

          <CustomTable
            className="mt-4"
            rowSelection={rowSelection}
            rowKey={(record: any) => record.questionId}
            columns={columns}
            dataSource={questions || lstQuestion}
            pagination={false}
            loading={loading}
            expandable={{
              rowExpandable: (record: any) => !!record.answerResList,
              expandedRowKeys,
              expandedRowRender: (record: any) =>
                renderAnswerValue(record.answerResList),
              expandIcon: ({ expanded, record }: any) => {
                if (!record.answerResList) return <div className="w-5" />;
                return (
                  <div
                    className={`flex transform items-center justify-center ${
                      expanded ? "rotate-90" : ""
                    } transition-all duration-300`}
                    onClick={() => toggleExpandRow(record.questionId)}
                  >
                    <CaretRightIcon />
                  </div>
                );
              },
            }}
            locale={{ emptyText: <Empty description="Không có dữ liệu" /> }}
            scroll={{ y: 400 }}
          />
        </div>
      </Modal>

      <Modal
        title="Preview"
        open={preview.open}
        onCancel={() => setPreview({ file: "", open: false, fileVideo: "" })}
        footer={
          <>
            <Button
              onClick={() =>
                setPreview({ file: "", open: false, fileVideo: "" })
              }
            >
              Đóng
            </Button>
          </>
        }
        width={1000}
        centered
      >
        <div className="flex w-full items-center justify-between gap-3 p-4">
          {preview.file && (
            <div className="flex w-full justify-center">
              <Image
                preview={false}
                className=""
                src={preview.file}
                alt="Ảnh chủ đề"
                style={{ width: 400, height: 400, objectFit: "contain" }}
              />
            </div>
          )}
          {preview.fileVideo && (
            <div className="flex w-full items-center justify-center">
              <video
                controls
                style={{
                  width: preview.file ? 400 : 600,
                  height: preview.file ? 300 : 400,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <source src={preview.fileVideo} />
              </video>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ModalChooseQuestions;
