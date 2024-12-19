"use client";
import Exam from "@/model/Exam";
import Learning from "@/model/Learning";
import Questions from "@/model/Questions";
import {
  validateRequire,
  validateRequireInput,
} from "@/utils/validation/validtor";
import { DeleteFilled } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Collapse,
  Form,
  Input,
  Pagination,
  Select,
  Spin,
  message,
} from "antd";
import { useForm } from "antd/es/form/Form";
import type { UploadFile } from "antd/es/upload/interface";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import ModalChooseQuestions from "./ModalChooseQuestions";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface Answer {
  id: number;
  text: string;
  isCorrect: boolean;
}

interface Question {
  id: number;
  question: string;
  files: UploadFile[];
  answers: Answer[];
  type: "single" | "multiple";
}

const { Panel } = Collapse;

const CreateAndEditExamPage: React.FC = () => {
  const router = useRouter();
  const [form] = useForm();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const questionsPerPage = 10;
  const searchParams = useSearchParams();
  const isPrivate = searchParams.get("isPrivate");
  const id = searchParams.get("id");
  const user: User = useSelector((state: RootState) => state.admin);

  // list câu hỏi
  const lstQuestions = Form.useWatch("lstQuestions", form);
  const queryClient = useQueryClient();

  useEffect(() => {
    form.setFieldValue(
      "questionIds",
      lstQuestions?.map((item: any) => item.id),
    );
  }, [form, lstQuestions]);

  // Modal chọn câu hỏi
  const [openChooseQuestions, setOpenChooseQuestions] = useState<{
    open: boolean;
    classRoomId: number;
    size: number;
  }>({ open: false, classRoomId: 0, size: 0 });

  // API lấy danh sách  topics
  const { data: allTopics } = useQuery({
    queryKey: ["getAllTopics", isPrivate],
    queryFn: async () => {
      const res = await Learning.getAllTopics({ isPrivate: isPrivate });
      return res?.content?.map((item: { id: any; name: any }) => ({
        id: item.id,
        value: item.id,
        label: item.name,
        text: item.name,
      }));
    },
    enabled: !!isPrivate,
  });

  // chi tiết bài kiểm tra
  const { data: detailExam, refetch } = useQuery({
    queryKey: ["detailExamsForUser", id],
    queryFn: async () => {
      const res = await Exam.detailExamsForUser(Number(id));
      form.setFieldsValue({
        ...res,
        numQuestions: res.numberOfQuestions,
      });
      setOpenChooseQuestions({
        ...openChooseQuestions,
        classRoomId: res.classRoomId,
      });

      return res;
    },
    enabled: !!id,
  });

  // Dánh sách lớp
  const { data: allClass, isFetching: isFetchingClass } = useQuery({
    queryKey: ["getListClass"],
    queryFn: async () => {
      const res = await Learning.getListClass();
      return res?.content?.map((item: { id: any; name: any }) => ({
        value: item.id,
        label: item.name,
      }));
    },
    enabled: !!isPrivate,
  });

  const params = useMemo(() => {
    return {
      page: 0,
      size: openChooseQuestions.size,
      classRoomId: openChooseQuestions.classRoomId,
    };
  }, [openChooseQuestions]);

  // API lấy danh sách câu hỏi
  // const { data: limitQuestion, isFetching } = useQuery({
  //   queryKey: ["getLimitQuestionCLassRoom", params],
  //   queryFn: async () => {
  //     const res = await Questions.getLimitQuestionCLassRoom(params);
  //     return res?.data;
  //   },
  //   enabled: openChooseQuestions.open,
  // });

  // Lấy câu hỏi theo bài kiểm tra
  const { data: limitQuestion, isFetching: isFetchingQExams } = useQuery({
    queryKey: ["getLstQuestionExamCreate"],
    queryFn: async () => {
      const res = await Questions.getLstQuestionExam(detailExam.id);
      form.setFieldValue("lstQuestions", res);
      return res;
    },
    enabled: detailExam && !!detailExam?.id,
  });

  useEffect(() => {
    if (!detailExam?.id) {
      queryClient.removeQueries({ queryKey: ["getLstQuestionExamCreate"] });
    }
  }, [detailExam, queryClient]);

  // Thêm bài kiểm tra
  const addExam = useMutation({
    mutationFn: Exam.addExam,
    onSuccess: async () => {
      // Thông báo thành công
      message.success("Thêm bài kiểm tra thành công thành công");

      router.push(
        isPrivate === "true"
          ? "/learning-management/check-list/private"
          : "/learning-management/check-list/public",
      );
    },
    onError: (error: any) => {
      message.error(error.data.message);
    },
  });

  const editExamMutation = useMutation({
    mutationFn: Exam.editExams,
    onSuccess: async () => {
      // Thông báo thành công
      message.success("Chỉnh sửa bài kiểm tra thành công");

      router.push(
        isPrivate === "true"
          ? "/learning-management/check-list/private"
          : "/learning-management/check-list/public",
      );
    },
    onError: (error: any) => {
      message.error(error?.data?.message);
    },
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  console.log("limitQuestion?.length", limitQuestion);

  return (
    <Spin
      spinning={
        editExamMutation.isPending || addExam.isPending || isFetchingQExams
      }
    >
      <div className="container mx-auto p-4">
        <h1 className="mb-4 text-2xl font-bold">Thêm bài kiểm tra</h1>
        <Form
          form={form}
          onFinish={(value) => {
            // convert
            const reqAdd = {
              name: value.name,
              questionIds: value.questionIds,
              classRoomId: value.classRoomId,
              private: isPrivate,
              numberOfQuestions: value.numQuestions,
              creatorId: user.id,
            };

            const reqEdit = {
              id: value.id,
              name: value.name,
              questionIds: value.questionIds,
              private: isPrivate,
            };
            if (id) {
              editExamMutation.mutate(reqEdit);
            } else {
              addExam.mutate(reqAdd);
            }
          }}
          layout="vertical"
        >
          <Form.Item
            label="Lớp "
            name="classRoomId"
            className="mb-2"
            required
            rules={[validateRequire("Lớp không được bỏ trống")]}
          >
            <Select
              placeholder="Chọn lớp"
              options={allClass}
              onChange={(e) => {
                setOpenChooseQuestions({
                  ...openChooseQuestions,
                  classRoomId: e,
                });
                form.setFieldValue("lstQuestions", []);
              }}
            />
          </Form.Item>
          <Form.Item name="id" hidden />
          <Form.Item
            label="Tên bài kiểm tra"
            name="name"
            required
            className="mb-2"
            rules={[
              validateRequireInput("Tên bài kiểm tra không được bỏ trống"),
            ]}
          >
            <Input placeholder="Nhập tên bài kiểm tra" />
          </Form.Item>

          <Form.Item
            label="Số câu hỏi"
            name="numQuestions"
            className="mb-2"
            required
            rules={[validateRequire("Số lượng câu hỏi không được bỏ trống")]}
          >
            <Input
              disabled={!openChooseQuestions.classRoomId}
              placeholder="Nhập số lượng câu hỏi"
              type="number"
              maxLength={100}
              onChange={(e) => {
                setOpenChooseQuestions({
                  ...openChooseQuestions,
                  size: Number(e.target.value),
                });
              }}
            />
          </Form.Item>
          <Button
            type="primary"
            disabled={
              limitQuestion?.length > 0 &&
              form.getFieldValue("numQuestions") > limitQuestion?.length
            }
            className=""
            onClick={() =>
              setOpenChooseQuestions({ ...openChooseQuestions, open: true })
            }
          >
            Chọn câu hỏi
          </Button>
          <Form.Item name="questionIds" noStyle>
            {/* Modal danh sách các câu hỏi */}
            <ModalChooseQuestions
              questions={limitQuestion}
              open={openChooseQuestions.open}
              onClose={() =>
                setOpenChooseQuestions({ ...openChooseQuestions, open: false })
              }
              number={openChooseQuestions.size}
              loading={isFetchingQExams}
            />
          </Form.Item>

          <Form.Item name="lstQuestions" hidden noStyle />
          {lstQuestions?.length ? (
            <div className="mt-2 flex flex-col gap-y-2 bg-white p-2">
              <div className="text-xl font-bold">Danh sách câu hỏi </div>

              {lstQuestions?.map((e: any) => (
                <>
                  <div
                    key={e}
                    className="body-14-regular group flex items-center justify-between rounded-lg p-2 pr-4 hover:cursor-default hover:bg-primary-200"
                  >
                    {e.content}
                    <div
                      className="opacity-0 hover:cursor-pointer group-hover:opacity-100"
                      onClick={() => {
                        form.setFieldValue(
                          "lstQuestions",
                          lstQuestions?.filter(
                            (question: { id: any }) => question?.id !== e?.id,
                          ),
                        );
                      }}
                    >
                      <DeleteFilled />
                    </div>
                  </div>
                </>
              ))}
            </div>
          ) : null}

          <div className="mt-3 flex items-center justify-center gap-4">
            <Button
              onClick={() =>
                router.push(
                  isPrivate === "true"
                    ? "/learning-management/check-list/private"
                    : "/learning-management/check-list/public",
                )
              }
            >
              Huỷ
            </Button>
            <Button type="primary" htmlType="submit">
              Tạo
            </Button>
          </div>
        </Form>

        {/* Page */}
        {questions?.length > 0 ? (
          <Pagination
            current={currentPage}
            pageSize={questionsPerPage}
            total={openChooseQuestions.size}
            onChange={handlePageChange}
          />
        ) : null}
      </div>
    </Spin>
  );
};

export default CreateAndEditExamPage;
