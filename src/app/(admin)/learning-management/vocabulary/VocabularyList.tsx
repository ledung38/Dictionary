"use client";
import { colors } from "@/assets/colors";
import { CloseIcon } from "@/assets/icons";
import { ConfirmModal } from "@/components/UI/Modal/ConfirmModal";
import BasicDrawer from "@/components/UI/draw/BasicDraw";
import Learning from "@/model/Learning";
import UploadModel from "@/model/UploadModel";
import { validateRequireInput } from "@/utils/validation/validtor";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FileAddFilled,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Button,
  Form,
  Image,
  Input,
  Modal,
  Select,
  Upload,
  UploadProps,
  message,
} from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { CustomTable } from "../check-list/ExamList";
import ModalListMedia from "./create-edit/ModalListMedia";
import { isImageLocation } from "./create-edit/VocabularyCreateUpdate";
import { filterOption } from "@/components/Dashboard/DashboardApp";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface FilterParams {
  topicId: number;
  contentSearch: string;
  vocabularyType?: string;
}

export const TYPE_VOCABULARY: { [key: string]: string } = {
  WORD: "Từ",
  SENTENCE: "Câu",
  PARAGRAPH: "Đoạn văn",
};

const VocabularyList = ({ isPrivate }: any) => {
  //Hooks
  const router = useRouter();
  const [form] = useForm();
  const user: User = useSelector((state: RootState) => state.admin);

  // danh sách topics
  const [filterParams, setFilterParams] = useState<FilterParams>({
    topicId: 0,
    contentSearch: "",
    vocabularyType: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [modalPreview, setModalPreview] = useState<{
    open: boolean;
    file: string;
  }>({
    open: false,
    file: "",
  });

  const [openEdit, setOpenEdit] = useState<boolean>(false);

  const vocabularyTypeEdit = Form.useWatch("vocabularyType", form);

  // modal xác nhận xoá
  const [modalConfirm, setModalConfirm] = useState<{
    open: boolean;
    rowId: string | string[];
    typeVocabulary?: string;
  }>({
    open: false,
    rowId: "",
    typeVocabulary: "",
  });

  // Modal thêm mới
  const [preview, setPreview] = useState<{
    fileImage: string;
    fileVideo: string;
  }>({
    fileImage: "",
    fileVideo: "",
  });

  // Chi tiết từ
  const [detailVocabulary, setDetailVocabulary] = useState<{
    open: boolean;
    record: any;
  }>({
    open: false,
    record: "",
  });

  // Thêm từ vào chủ đề
  const [modalAddVocabularyTopic, setModalAddVocabularyTopic] = useState<{
    open: boolean;
    topicId: number;
  }>({ open: false, topicId: 0 });

  // lưu những row được chọn
  const [selectedRowId, setSelectedRowId] = useState<string[]>([]);

  const handleTableChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // API lấy danh sách  topics
  const { data: allTopics } = useQuery({
    queryKey: ["getAllTopics"],
    queryFn: async () => {
      const res = await Learning.getAllTopics();
      return res?.data?.map((item: { topicId: any; content: any }) => ({
        id: item.topicId,
        value: item.topicId,
        label: item.content,
        text: item.content,
      }));
    },
  });

  // API lấy danh sách từ vựng
  const {
    data: allVocabulary,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["getAllVocalizations", filterParams, isPrivate],
    queryFn: async () => {
      const res = await Learning.getAllVocabulary({
        ...filterParams,
        isPrivate: !(user.role === "ADMIN" && !isPrivate) && `${isPrivate}`,
      });
      // Sắp xếp priamry lên đầu
      res?.data?.forEach(
        (item: {
          vocabularyImageResList: any[];
          vocabularyVideoResList: any[];
        }) => {
          item.vocabularyImageResList?.sort(
            (a: { primary: any }, b: { primary: any }) => {
              // Sắp xếp sao cho phần tử có primary = true được đặt lên đầu
              return a.primary === b.primary ? 0 : a.primary ? -1 : 1;
            },
          );
          item.vocabularyVideoResList?.sort(
            (a: { primary: any }, b: { primary: any }) => {
              // Sắp xếp sao cho phần tử có primary = true được đặt lên đầu
              return a.primary === b.primary ? 0 : a.primary ? -1 : 1;
            },
          );
        },
      );
      return res.data;
    },
  });

  // Xoá chủ đề
  const mutationDel = useMutation({
    mutationFn: Learning.deleteVocabulary,
    onSuccess: () => {
      message.success("Xoá từ vựng thành công");
      setSelectedRowId(
        selectedRowId?.filter((item) => !modalConfirm.rowId?.includes(item)),
      );
      refetch();
    },
  });

  // Thêm mới / chỉnh sửa  topics
  const mutationCreate = useMutation({
    mutationFn: Learning.editVocabulary,
    onSuccess: () => {
      message.success("Cập nhật từ thành công");
      setOpenEdit(false);
      refetch();
    },
    onError: () => {
      message.error("Cập nhật từ vựng thất bại");
    },
  });

  // Upload file
  const uploadFileMutation = useMutation({
    mutationFn: UploadModel.uploadFile,
    onSuccess: async (res: any) => {
      if (isImageLocation(res)) {
        setPreview({
          ...preview,
          fileImage: res,
        });
        form.setFieldValue("vocabularyImageReqs", [
          {
            imageLocation: res,
            primary: true,
          },
        ]);
      } else {
        setPreview({
          ...preview,
          fileVideo: res,
        });
        form.setFieldValue("vocabularyVideoReqs", [
          {
            videoLocation: res,
            primary: true,
          },
        ]);
      }
    },
    onError: (error: Error) => {
      console.error(error);
      message.error("File đã được lưu trước đó");
    },
  });

  // Column
  const columns = [
    {
      title: "Từ vựng",
      dataIndex: "content",
      key: "content",
      render: (content: any, record: any) => (
        <span
          className="w-[200px] cursor-pointer truncate "
          style={{
            fontWeight: 500,
            color: colors.primary600,
            maxWidth: "200px",
          }}
          onClick={() => setDetailVocabulary({ open: true, record: record })}
        >
          {content}
        </span>
      ),
      ellipsis: true,
      width: 200,
    },
    {
      title: "Chủ đề",
      dataIndex: "topicContent",
      key: "topicContent",
      render: (content: string) => (
        <span style={{ fontWeight: 500 }}>{content}</span>
      ),
      ellipsis: true,
      width: 100,
    },
    {
      title: "Loại từ vựng",
      dataIndex: "vocabularyType",
      key: "vocabularyType",
      render: (content: string) => (
        <span style={{ fontWeight: 500 }}>{TYPE_VOCABULARY[content]}</span>
      ),
      ellipsis: true,
      width: 100,
    },
    {
      title: "Ảnh minh hoạ",
      dataIndex: "imageLocation",
      key: "imageLocation",
      render: (
        imageLocation: any,
        record: {
          vocabularyImageResList: string | any[];
          content: string | undefined;
        },
      ) => {
        if (
          record.vocabularyImageResList?.length &&
          record.vocabularyImageResList[0].imageLocation
        ) {
          return (
            <Image
              width={100}
              src={record.vocabularyImageResList[0].imageLocation}
              alt={record.content}
            />
          );
        } else {
          return <span>Không có minh họa</span>;
        }
      },
      width: 120,
    },
    {
      title: "Video minh hoạ",
      dataIndex: "videoLocation",
      key: "videoLocation",
      align: "center",
      render: (
        videoLocation: any,
        record: { vocabularyVideoResList: string | any[] },
      ) => {
        if (
          record.vocabularyVideoResList?.length &&
          record.vocabularyVideoResList[0].videoLocation
        ) {
          return (
            <EyeOutlined
              style={{ fontSize: "1.5rem" }}
              onClick={() =>
                setModalPreview({
                  open: true,
                  file: record.vocabularyVideoResList[0].videoLocation,
                })
              }
            />
          );
        } else {
          return <span>Không video có minh họa</span>;
        }
      },
      width: 200,
    },
    {
      title: "Hành động",
      dataIndex: "vocabularyId",
      key: "vocabularyId",
      align: "center",
      render: (value: any, record: any) => (
        <div className="flex space-x-2">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setOpenEdit(true);
              setPreview({
                fileImage: record?.vocabularyImageResList[0]?.imageLocation,
                fileVideo: record?.vocabularyVideoResList[0]?.videoLocation,
              });
              form.setFieldsValue(record);
            }}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() =>
              setModalConfirm({
                open: true,
                rowId: [value],
                typeVocabulary: record.vocabularyType,
              })
            }
          />
        </div>
      ),
      width: 100,
    },
  ];

  // upload
  const props: UploadProps = {
    name: "file",
    onChange(info) {
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    customRequest: ({ file }: { file: any }) => {
      const formData = new FormData();
      formData.append("file", file);
      uploadFileMutation.mutate(formData);
    },
    progress: {
      strokeColor: {
        "0%": "#108ee9",
        "100%": "#87d068",
      },
      strokeWidth: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
  };

  const rowSelection = {
    fixed: true,
    columnWidth: 50,
    selectedRowKeys: selectedRowId,
    onChange: (value: any) => setSelectedRowId(value),
  };
  const isLoading = isFetching;

  return (
    <div className="w-full p-4">
      <h1 className="mb-4 text-2xl font-bold">Danh sách từ điển</h1>
      <div className="mb-4 flex  items-center justify-between">
        {/* Filter */}
        <div className="flex w-2/3 gap-4">
          <Select
            size="large"
            className="w-full"
            allowClear
            showSearch
            placeholder="Chọn chủ đề"
            options={allTopics}
            onChange={(value, option: any) =>
              setFilterParams({ ...filterParams, topicId: value })
            }
            filterOption={filterOption}
          />
          <Select
            allowClear
            style={{ width: 400, height: 40, borderRadius: 20 }}
            placeholder="Loại từ vựng"
            size="large"
            options={[
              {
                label: "Từ",
                value: "WORD",
              },
              {
                label: "Câu",
                value: "SENTENCE",
              },
              {
                label: "Đoạn",
                value: "PARAGRAPH",
              },
            ]}
            onChange={(value) =>
              setFilterParams({ ...filterParams, vocabularyType: value })
            }
          />
          <Input
            onChange={(e) => {
              setFilterParams({
                ...filterParams,
                contentSearch: e.target.value,
              });
            }}
            size="large"
            allowClear
            placeholder="Nhập từ vựng"
          />
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            router.push(
              `/learning-management/vocabulary/create-edit/?isPrivate=${isPrivate}`,
            );
          }}
        >
          Thêm mới
        </Button>
      </div>
      {/* Xóa nhiều */}
      {selectedRowId?.length > 0 && (
        <div className="mb-1 flex items-center gap-x-3 rounded-lg bg-neutral-200 px-4 py-1">
          <div
            onClick={() =>
              setModalConfirm({ open: true, rowId: selectedRowId })
            }
            aria-hidden="true"
            className="body-14-medium flex cursor-pointer select-none items-center gap-x-2 p-1 text-primary-600"
          >
            <DeleteOutlined color={colors.primary600} />
            Xoá từ khỏi chủ đề hiện tại
          </div>
          <div
            onClick={() =>
              setModalAddVocabularyTopic({ open: true, topicId: 0 })
            }
            aria-hidden="true"
            className="body-14-medium flex cursor-pointer select-none items-center gap-x-2 p-1 text-primary-600"
          >
            <FileAddFilled color={colors.primary600} />
            Thêm từ vào chủ đề
          </div>
        </div>
      )}
      <CustomTable
        rowSelection={rowSelection}
        columns={columns as any}
        dataSource={allVocabulary}
        loading={isLoading}
        rowKey={(record) => record.vocabularyId}
        // scroll={{ x: 600 }}
        pagination={{
          pageSize: pageSize,
          current: currentPage,
          onChange: handleTableChange,
          showSizeChanger: false,
          position: ["bottomCenter"],
        }}
      />

      {/* Edit */}
      <BasicDrawer
        width={680}
        title={`Chỉnh sửa ${vocabularyTypeEdit && TYPE_VOCABULARY[vocabularyTypeEdit].toLowerCase()}`}
        onClose={() => setOpenEdit(false)}
        open={openEdit}
        destroyOnClose
        onOk={() => {
          form.submit();
        }}
        maskClosable={false}
        extra={
          <div className="flex items-center gap-x-4">
            <Button
              className="hover:opacity-60 "
              onClick={() => {
                setOpenEdit(false);
                form.resetFields();
              }}
              type="link"
              style={{ padding: 0 }}
            >
              <CloseIcon size={20} />
            </Button>
          </div>
        }
      >
        <div className="">
          <Form
            form={form}
            layout="vertical"
            className="px-4 pb-4"
            onFinish={(value) => {
              mutationCreate.mutate({ ...value, private: isPrivate });
            }}
          >
            <Form.Item name="vocabularyId" noStyle hidden />

            <Form.Item
              name="topicId"
              label="Chủ đề liên quan"
              required
              rules={[
                validateRequireInput("Chủ đề liên quan không được bỏ trống"),
              ]}
              className="mb-2"
            >
              <Select
                disabled
                size="large"
                className="w-full"
                allowClear
                placeholder="Chọn chủ đề"
                options={allTopics}
              />
            </Form.Item>
            <Form.Item
              name="vocabularyType"
              label="Loại từ vựng"
              required
              rules={[validateRequireInput("Loại từ vựng không được bỏ trống")]}
              className="mb-2"
            >
              <Select
                size="large"
                className="w-full"
                allowClear
                placeholder="Chọn loại từ vựng"
                options={[
                  {
                    label: "Từ",
                    value: "WORD",
                  },
                  {
                    label: "Câu",
                    value: "SENTENCE",
                  },
                  {
                    label: "Đoạn",
                    value: "PARAGRAPH",
                  },
                ]}
              />
            </Form.Item>
            <Form.Item
              name="content"
              label="Ngôn ngữ văn bản"
              required
              rules={[
                validateRequireInput("Chủ đề liên quan không được bỏ trống"),
              ]}
              className="mb-2"
            >
              <TextArea maxLength={200} showCount placeholder="Nhập mô tả" />
            </Form.Item>
            <Form.Item name="note" label="Mô tả">
              <TextArea maxLength={200} showCount placeholder="Nhập mô tả" />
            </Form.Item>
            <Form.Item name="vocabularyType" hidden />
            <div className="flex flex-col gap-4"></div>
          </Form>
        </div>
      </BasicDrawer>

      {/* Modal preview */}
      <Modal
        open={modalPreview.open}
        onCancel={() => setModalPreview({ file: "", open: false })}
        footer={null}
        width={1000}
        closeIcon={null}
        centered
        zIndex={1000}
      >
        <div className="flex w-full items-center justify-center">
          {modalPreview.file && (
            <div className="w-full">
              <video
                key={modalPreview.file}
                controls
                style={{ width: "100%", height: "auto" }}
              >
                <source src={modalPreview.file} />
              </video>
            </div>
          )}
        </div>
      </Modal>

      {/* Modal chi tiết nội dung từ */}
      <ModalListMedia
        showModalLstMedia={detailVocabulary.open}
        record={detailVocabulary.record}
        refetch={refetch}
        onClose={() => {
          setDetailVocabulary({ open: false, record: "" });
        }}
      />

      {/* Modal thêm từ vào chủ đề */}
      <Modal
        title="Thêm từ vựng vào chủ đề"
        open={modalAddVocabularyTopic.open}
        onCancel={() =>
          setModalAddVocabularyTopic({
            ...modalAddVocabularyTopic,
            open: false,
          })
        }
        onOk={async () => {
          const req = {
            ids: selectedRowId,
            topicId: modalAddVocabularyTopic.topicId,
          };
          const res = await Learning.addVocabularyTopic(req);
          if (res.code === 200) {
            message.success("Thêm từ vào chủ đề thành công");
            setModalAddVocabularyTopic({ open: false, topicId: 0 });
            setSelectedRowId([]);
            refetch();
          } else {
            message.success("Thêm từ vào chủ đề thất bại");
            setModalAddVocabularyTopic({
              ...modalAddVocabularyTopic,
              open: false,
            });
            refetch();
          }
        }}
        cancelText="Huỷ"
        okText="Thêm"
        destroyOnClose
      >
        <Select
          size="large"
          className="w-full"
          allowClear
          placeholder="Chọn chủ đề"
          options={allTopics}
          onChange={(value) =>
            setModalAddVocabularyTopic({
              ...modalAddVocabularyTopic,
              topicId: value,
            })
          }
        />
      </Modal>

      <ConfirmModal
        visible={modalConfirm.open}
        iconType="DELETE"
        title={`Xóa ${modalConfirm.typeVocabulary && TYPE_VOCABULARY[modalConfirm.typeVocabulary].toLowerCase()} khỏi chủ đề`}
        content={`Hành động này sẽ xóa ${modalConfirm.typeVocabulary && TYPE_VOCABULARY[modalConfirm.typeVocabulary].toLowerCase()} vĩnh viễn khỏi chủ đề hiện tại`}
        confirmButtonText="Xác nhận"
        onClick={() => {
          mutationDel.mutate({ vocabularyIds: [...modalConfirm.rowId] });
        }}
        onCloseModal={() => setModalConfirm({ ...modalConfirm, open: false })}
      />
    </div>
  );
};

export default VocabularyList;
