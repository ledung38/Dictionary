"use client";
import Breadcrumb from "@/components/UI/Breadcrumbs/Breadcrumb";
import Exam from "@/model/Exam";
import Questions from "@/model/Questions";
import { FrownOutlined, MehOutlined, SmileOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Button,
  Checkbox,
  Empty,
  Form,
  Image,
  Modal,
  Pagination,
  Radio,
  Spin,
  message,
} from "antd";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const PAGE_SIZE = 20;

const ExamDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const [isResultModalVisible, setIsResultModalVisible] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [score, setScore] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const searchParams = useSearchParams();
  // Làm lại bài kiểm tra
  const isRedo = searchParams.get("redo");
  // Xem đáp án
  const [showResultAnswer, setShowResultAnswer] = useState<{
    open: boolean;
    lstAnswer: any;
  }>({
    open: false,
    lstAnswer: [],
  });

  const [form] = Form.useForm();

  const {
    data: detailExam,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["detailExamsForUser", id],
    queryFn: async () => {
      const res = await Exam.detailExamsForUser(Number(id));
      return res?.data;
    },
    enabled: !!id,
  });

  // Danh sách câu hỏi theo bài kiểm tra
  const { data: lstQuestions, isFetching: isFetchingQuestions } = useQuery({
    queryKey: ["getLstQuestionExam", id],
    queryFn: async () => {
      const responsive = await Questions.getLstQuestionExam(id);
      form.setFieldsValue({
        questionId: responsive?.data?.map(
          (question: any) => question.questionId,
        ),
      });
      return responsive?.data;
    },
    enabled: !!id,
  });

  // api lấy chi tiết đáp án của bải kiểm tra
  const { data: detailExamSave, isFetching: isFetchingDetail } = useQuery({
    queryKey: ["getDetailSaveExam", id],
    queryFn: async () => {
      const responsive = await Exam.getDetailSaveExam(id);

      return responsive?.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (detailExamSave && lstQuestions && !isRedo) {
      const initialValues = lstQuestions.reduce(
        (acc: any, question: any, index: number) => {
          const savedAnswer = detailExamSave.find(
            (item: any) => item.questionId === question.questionId,
          );
          if (savedAnswer) {
            const selectedAnswers = savedAnswer.selectedAnswers;
            acc.answerList = acc.answerList || [];
            acc.answerList[index] = {
              answerId:
                selectedAnswers && question?.questionType === "ONE_ANSWER"
                  ? selectedAnswers[0]
                  : selectedAnswers,
            };
            acc.answer = acc.answer || [];
            acc.answer[index] = question.answerResList?.some(
              (ans: any) =>
                selectedAnswers?.includes(ans.answerId) && ans.correct,
            );
          }
          return acc;
        },
        {},
      );

      form.setFieldsValue(initialValues);
    }
  }, [detailExamSave, lstQuestions]);

  // Chấm điểm
  const markExam = useMutation({
    mutationFn: Exam.markExam,
    onSuccess: () => {},
  });

  // Lưu đáp án
  const saveExam = useMutation({
    mutationFn: Exam.saveExam,
    onSuccess: () => {
      message.success("Chấm điểm thành công");
    },
  });

  const submitExam = (values: any) => {
    // Data truyền cho api
    const req = lstQuestions.map(
      (question: { questionId: any }, index: string | number) => {
        const correctAnswer = values?.answerList[index];
        const selectedAnswers =
          typeof correctAnswer.answerId === "number"
            ? [correctAnswer?.answerId]
            : correctAnswer?.answerId;

        return {
          questionId: question.questionId,
          examId: Number(id),
          selectedAnswers,
        };
      },
    );

    const unansweredQuestions = lstQuestions.filter(
      (q: any, index: number) =>
        !values.answer || values.answer[index] === undefined,
    );

    if (unansweredQuestions.length > 0) {
      setIsConfirmModalVisible(true);
    } else {
      calculateScore(values);
    }
    saveExam.mutate(req);
  };

  const calculateScore = (values: any) => {
    const calculatedScore = values.answer?.filter((item: any) => item)?.length;
    markExam.mutate({
      examId: Number(id),
      score: (calculatedScore / lstQuestions?.length) * 10,
    });
    setScore((calculatedScore / lstQuestions?.length) * 10);
    setIsResultModalVisible(true);
  };

  const handleConfirmSubmit = () => {
    form.validateFields().then((values) => {
      calculateScore(values);
    });
    setIsConfirmModalVisible(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentQuestions = lstQuestions?.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );

  // Hiển thị icon biểu cảm
  const calculateRating = () => {
    if (score >= 7) {
      return <SmileOutlined style={{ fontSize: "140px", color: "#53d100" }} />;
    } else if (score >= 4 && score < 7) {
      return <MehOutlined style={{ fontSize: "140px", color: "orange" }} />;
    } else {
      return <FrownOutlined style={{ fontSize: "140px", color: "red" }} />;
    }
  };

  return (
    <Spin spinning={isFetching || isFetchingQuestions}>
      {lstQuestions ? (
        <div className="container mx-auto py-4">
          <div className="">
            <Breadcrumb
              pageName={`Bài kiểm tra:  ${detailExam?.name}`}
              itemBreadcrumb={[
                { pathName: "/", name: "Trang chủ" },
                { pathName: "/exam", name: "Danh sách bài kiểm tra" },
                { pathName: "#", name: "Bài kiểm tra" },
              ]}
            />
          </div>
          {!isRedo && (
            <Button
              className="mb-2"
              onClick={() =>
                setShowResultAnswer({
                  open: true,
                  lstAnswer: [],
                })
              }
            >
              Xem đáp án
            </Button>
          )}
          <Form form={form} layout="vertical" onFinish={submitExam}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {currentQuestions?.map((q: any, index: number) => (
                <div
                  key={q.key}
                  className="rounded-md border bg-white p-4 shadow-md"
                >
                  <div className="text-base">
                    <span className="text-base font-bold">
                      Câu {`${index + 1}`} :
                    </span>{" "}
                    {q.content}
                  </div>
                  {(q.imageLocation || q.videoLocation) && (
                    <div className="mb-4 flex justify-center">
                      {q.imageLocation && (
                        <Image
                          style={{ height: "256px" }}
                          src={q.imageLocation}
                          alt="question media"
                          className="h-64 w-full object-cover"
                        />
                      )}
                      {q.videoLocation && (
                        <video controls className="h-64 w-full object-cover">
                          <source src={q.videoLocation} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </div>
                  )}
                  <Form.Item name={["answer", index]} hidden />
                  <Form.Item name={["questionId", index]} hidden />

                  <Form.Item name={["answerList", index, "answerId"]}>
                    {q.answerResList?.filter(
                      (item: { correct: boolean }) => item.correct,
                    )?.length > 1 ? (
                      <Checkbox.Group
                        onChange={(value) => {
                          const correct = q.answerResList
                            ?.filter((item: any) =>
                              value.includes(item.answerId),
                            )
                            ?.every(
                              (item: { correct: boolean }) => item.correct,
                            );
                          form.setFieldValue(["answer", index], correct);
                        }}
                      >
                        {q.answerResList.map((answer: any) => (
                          <Checkbox
                            key={answer.answerId}
                            value={answer.answerId}
                          >
                            {answer.content}
                          </Checkbox>
                        ))}
                      </Checkbox.Group>
                    ) : (
                      <Radio.Group>
                        {q.answerResList.map((answer: any) => (
                          <Radio
                            key={answer.answerId}
                            value={answer.answerId}
                            onChange={(e) => {
                              if (e.target.checked) {
                                form.setFieldValue(
                                  ["answer", index],
                                  answer.correct,
                                );
                              }
                            }}
                          >
                            {answer.content}
                          </Radio>
                        ))}
                      </Radio.Group>
                    )}
                  </Form.Item>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <Button htmlType="submit" type="primary">
                Nộp bài
              </Button>
            </div>
          </Form>
          <div className="mt-4 flex justify-center">
            <Pagination
              current={currentPage}
              pageSize={PAGE_SIZE}
              total={lstQuestions?.length}
              onChange={handlePageChange}
            />
          </div>
          <Modal
            title="Kết quả"
            open={isResultModalVisible}
            onOk={() => {
              setIsResultModalVisible(false);
            }}
            maskClosable={false}
            onCancel={() => setIsResultModalVisible(false)}
            footer={
              <>
                <Button
                  type="primary"
                  onClick={() => {
                    setIsResultModalVisible(false);
                    router.back();
                  }}
                >
                  Đóng
                </Button>
              </>
            }
          >
            <div className="flex w-full justify-center py-4">
              {calculateRating()}
            </div>
            <p className="text-xl font-bold">Điểm của bạn là: {score}/10</p>
          </Modal>
          <Modal
            title="Thông báo"
            open={isConfirmModalVisible}
            onOk={handleConfirmSubmit}
            onCancel={() => setIsConfirmModalVisible(false)}
            footer={
              <>
                <Button onClick={() => setIsConfirmModalVisible(false)}>
                  Tiếp tục
                </Button>
                <Button type="primary" onClick={handleConfirmSubmit}>
                  Nộp bài
                </Button>
              </>
            }
          >
            <p>Bạn chưa hoàn thành bài kiểm tra, bạn có muốn tiếp tục?</p>
          </Modal>
        </div>
      ) : (
        <Empty description="Không có câu hỏi nào" />
      )}

      {/* Modal hiển thị đáp án đúng */}
      <Modal
        open={showResultAnswer.open}
        onCancel={() => {
          setShowResultAnswer({
            open: false,
            lstAnswer: [],
          });
        }}
        footer={
          <>
            <Button
              onClick={() =>
                setShowResultAnswer({
                  open: false,
                  lstAnswer: [],
                })
              }
            >
              Đóng
            </Button>
          </>
        }
        maskClosable={false}
        destroyOnClose
        width={800}
      >
        <div className="w-full p-4">
          {currentQuestions?.map((q: any, index: number) => (
            <div
              key={q.key}
              className="rounded-md border bg-white p-4 shadow-md"
            >
              <div className="text-base">
                <span className="text-base font-bold">
                  Câu {`${index + 1}`} :
                </span>{" "}
                {q.content}
              </div>

              {(q.imageLocation || q.videoLocation) && (
                <div className="mb-4 flex justify-center">
                  {q.imageLocation && (
                    <Image
                      style={{ height: "256px" }}
                      src={q.imageLocation}
                      alt="question media"
                      className="h-64 w-full object-cover"
                    />
                  )}
                  {q.videoLocation && (
                    <video controls className="h-64 w-full object-cover">
                      <source src={q.videoLocation} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              )}

              {q.answerResList?.filter(
                (item: { correct: boolean }) => item.correct,
              )?.length > 1 ? (
                <Checkbox.Group
                  disabled
                  value={q.answerResList
                    ?.filter((item: { correct: boolean }) => item.correct)
                    ?.map((item: { answerId: any }) => item.answerId)}
                  options={q.answerResList?.map(
                    (e: { content: any; answerId: any }) => ({
                      label: e.content,
                      value: e.answerId,
                    }),
                  )}
                />
              ) : (
                <Radio.Group
                  disabled
                  value={
                    q.answerResList?.find(
                      (item: { correct: boolean }) => item.correct,
                    )?.answerId
                  }
                >
                  {q.answerResList.map((answer: any) => (
                    <Radio value={answer.answerId} key={answer.answerId}>
                      {answer.content}
                    </Radio>
                  ))}
                </Radio.Group>
              )}
            </div>
          ))}
        </div>
      </Modal>
    </Spin>
  );
};

export default ExamDetailPage;
