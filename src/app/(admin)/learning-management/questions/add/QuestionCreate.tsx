"use client";
import { MediaUpload } from "@/components/UI/Upload/UploadFile";
import { isImage } from "@/components/common/constants";
import Learning from "@/model/Learning";
import Questions from "@/model/Questions";
import {
  validateRequire,
  validateRequireInput,
} from "@/utils/validation/validtor";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Button,
  Checkbox,
  Collapse,
  Form,
  Image,
  Input,
  Pagination,
  Radio,
  Select,
  Spin,
  message,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import QuestionModal from "../../check-list/create-edit/ModalSelectFile";

interface Answer {
  content: string;
  imageLocation: string;
  videoLocation: string;
  correct: boolean;
}

interface Question {
  content: string;
  explanation: string;
  imageLocation: string;
  videoLocation: string;
  topicId: number;
  answerReqs: Answer[];
  type?: string;
  file?: string;
}
const { Panel } = Collapse;

const initAnswerValue = {
  content: "",
  imageLocation: "",
  videoLocation: "",
  correct: false,
};

// Convert form data to API request format
function convertQuestions(input: any) {
  return input.questions.map((question: any) => ({
    content: question.content,
    explanation: "",
    imageLocation: isImage(question.file) ? question.file : "",
    videoLocation: !isImage(question.file) ? question.file : "",
    classRoomId: input.classRoomId,
    questionType: question.type,
    fileType: question.typeFile,
    answerReqs: question.answerReqs.map((answer: any) => ({
      content: answer.content,
      imageLocation: "",
      videoLocation: "",
      correct: answer.correct,
    })),
  }));
}

const QuestionCreate: React.FC = () => {
  const router = useRouter();
  const [form] = useForm();
  const [numQuestions, setNumQuestions] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const questionsPerPage = 10;

  const questions: Question[] = Form.useWatch("questions", form);

  const [openChooseVideo, setOpenChooseVideo] = useState<boolean>(false);

  // Danh sách lớp
  const { data: allClass, isFetching: isFetchingClass } = useQuery({
    queryKey: ["getListClass"],
    queryFn: async () => {
      const res = await Learning.getListClass();
      return res?.data?.map((item: { classRoomId: any; content: any }) => ({
        value: item.classRoomId,
        label: item.content,
      }));
    },
  });

  const mutationAdd = useMutation({
    mutationFn: Questions.addQuestion,
    onSuccess: () => {
      message.success("Thêm mới câu hỏi thành công");
      router.push("/learning-management/questions");
    },
  });

  const handleNumQuestionsChange = (value: number) => {
    const newValue = Math.min(100, Math.max(0, value));
    setNumQuestions(newValue);
    form.setFieldValue(
      "questions",
      Array.from({ length: newValue }, () => ({
        content: "",
        explanation: "",
        imageLocation: "",
        videoLocation: "",
        classRoomId: 0,
        type: "ONE_ANSWER",
        answerReqs: [
          { content: "", imageLocation: "", videoLocation: "", correct: true },
        ],
      })),
    );
  };

  const handleQuestionChange = (
    index: number,
    field: keyof Question,
    value: any,
  ) => {
    const updatedQuestions = questions?.map((q, i) =>
      i === index ? { ...q, [field]: value } : q,
    );
    form.setFieldValue("questions", updatedQuestions);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const currentQuestions = questions?.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage,
  );

  const lstQuestions = form.getFieldsValue();

  return (
    <div className="container mx-auto bg-white p-4">
      <h1 className="mb-4 text-2xl font-bold">Thêm câu hỏi</h1>
      <Form
        form={form}
        onFinish={(value) => {
          const newValue = convertQuestions(value);

          mutationAdd.mutate(newValue);
        }}
        layout="vertical"
      >
        <Form.Item
          label="Lớp học"
          name="classRoomId"
          required
          rules={[validateRequire("Lớp học không được bỏ trống")]}
        >
          <Select
            loading={isFetchingClass}
            placeholder="Chọn lớp"
            options={allClass}
          />
        </Form.Item>
        <Form.Item
          label="Số câu hỏi muốn tạo (không quá 100):"
          name="numQuestions"
          required
          rules={[validateRequire("Số lượng câu hỏi không được bỏ trống")]}
        >
          <Input
            placeholder="Nhập số lượng câu hỏi"
            type="number"
            value={numQuestions}
            onChange={(e) =>
              handleNumQuestionsChange(parseInt(e.target.value, 10))
            }
          />
        </Form.Item>
        <Form.Item name="questions" hidden />
        <Collapse accordion className="mb-4 bg-white">
          {currentQuestions?.map((question, index) => (
            <Panel
              header={`Câu hỏi ${(currentPage - 1) * questionsPerPage + index + 1}`}
              key={index}
            >
              <div key={index} className="mb-6 rounded border bg-white p-4">
                <h2 className="mb-2 text-xl font-bold">
                  Câu hỏi {(currentPage - 1) * questionsPerPage + index + 1}
                </h2>

                <Form.Item
                  label="Tên câu hỏi:"
                  name={["questions", index, "content"]}
                  required
                  rules={[
                    validateRequireInput("Tên câu hỏi không được bỏ trống"),
                  ]}
                >
                  <Input placeholder="Nhập câu hỏi" />
                </Form.Item>

                <Form.Item
                  name={["questions", index, "typeFile"]}
                  label="Lựa chọn file (hình ảnh, video):"
                  className="mb-0"
                  required
                  rules={[validateRequire("Không được bỏ trống trường này")]}
                >
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Chọn hoặc tải lên file"
                  >
                    <Select.Option value="NOT_EXISTED">
                      Tải lên file mới
                    </Select.Option>
                    <Select.Option value="EXISTED">
                      Chọn từ dữ liệu có sẵn
                    </Select.Option>
                  </Select>
                </Form.Item>

                <div className="mt-2">
                  {lstQuestions.questions?.length && (
                    <>
                      <Form.Item
                        name={["questions", index, "file"]}
                        className="mb-2"
                        required
                        rules={[
                          validateRequire("Không được bỏ trống trường này"),
                        ]}
                        hidden={
                          lstQuestions?.questions[index]?.typeFile ===
                          "NOT_EXISTED"
                        }
                      >
                        {lstQuestions?.questions[index]?.typeFile ===
                          "EXISTED" && (
                          <QuestionModal
                            openChooseVideo={openChooseVideo}
                            setOpenChooseVideo={setOpenChooseVideo}
                            file={lstQuestions?.questions[index]?.file}
                          >
                            <div
                              onClick={() => {
                                setOpenChooseVideo(true);
                              }}
                            >
                              <Button>Chọn file</Button>
                              {lstQuestions?.questions[index]?.file && (
                                <div className="">
                                  {isImage(
                                    lstQuestions?.questions[index]?.file,
                                  ) ? (
                                    <Image
                                      preview={false}
                                      alt="example"
                                      style={{
                                        width: 200,
                                        height: 200,
                                        objectFit: "contain",
                                      }}
                                      src={lstQuestions?.questions[index]?.file}
                                    />
                                  ) : (
                                    <video
                                      controls
                                      style={{ width: 200, height: 200 }}
                                    >
                                      <source
                                        src={
                                          lstQuestions?.questions[index]?.file
                                        }
                                        type="video/mp4"
                                      />
                                    </video>
                                  )}
                                </div>
                              )}
                            </div>
                          </QuestionModal>
                        )}
                      </Form.Item>

                      <Form.Item
                        name={["questions", index, "file"]}
                        className="mb-2"
                        required
                        rules={[
                          validateRequire("Không được bỏ trống trường này"),
                        ]}
                        hidden={
                          lstQuestions?.questions[index]?.typeFile === "EXISTED"
                        }
                      >
                        {lstQuestions?.questions[index]?.typeFile ===
                          "NOT_EXISTED" && <MediaUpload />}
                      </Form.Item>
                    </>
                  )}
                </div>

                <Form.Item
                  name={["questions", index, "type"]}
                  label="Kiểu câu hỏi:"
                  required
                  rules={[validateRequireInput("Vui lòng chọn loại đáp án")]}
                  initialValue={"ONE_ANSWER"}
                >
                  <Select
                    value={question.type}
                    onChange={(value) =>
                      handleQuestionChange(index, "type", value)
                    }
                    placeholder="Chọn loại đáp án"
                    options={[
                      { label: "Một đáp án", value: "ONE_ANSWER" },
                      { label: "Nhiều đáp án", value: "MULTIPLE_ANSWERS" },
                    ]}
                  />
                </Form.Item>

                <Form.List name={["questions", index, "answerReqs"]}>
                  {(fields, { add, remove }) => (
                    <>
                      {question.type === "ONE_ANSWER" ? (
                        <Radio.Group className="w-full" defaultValue={0}>
                          {fields.map((field, answerIndex) => (
                            <div
                              key={field.key}
                              className="flex w-full items-center gap-4"
                            >
                              <div className="mb-2 flex items-center">
                                <Form.Item
                                  name={[field.name, "correct"]}
                                  className="mb-0 ml-2 w-full"
                                  valuePropName="checked"
                                  initialValue={answerIndex === 0}
                                >
                                  <Radio value={answerIndex} />
                                </Form.Item>

                                <Form.Item
                                  name={[field.name, "content"]}
                                  className="mb-0 ml-2 w-full"
                                  required
                                  rules={[
                                    validateRequireInput(
                                      "Vui lòng nhập đáp án",
                                    ),
                                  ]}
                                >
                                  <Input
                                    placeholder="Nhập đáp án"
                                    style={{ width: 500 }}
                                  />
                                </Form.Item>
                              </div>

                              <MinusCircleOutlined
                                style={{ fontSize: 20 }}
                                className="dynamic-delete-button"
                                onClick={() => remove(field.name)}
                              />
                            </div>
                          ))}
                          <Button
                            type="dashed"
                            onClick={() =>
                              add({
                                ...initAnswerValue,
                                correct: fields?.length === 0,
                              })
                            }
                            icon={<PlusOutlined />}
                          >
                            Thêm đáp án
                          </Button>
                        </Radio.Group>
                      ) : (
                        <Checkbox.Group className="w-full" defaultValue={[0]}>
                          {fields.map((field, answerIndex) => (
                            <div
                              key={field.key}
                              className="flex w-full items-center gap-4"
                            >
                              <div className="mb-2 flex items-center">
                                <Form.Item
                                  {...field}
                                  name={[field.name, "correct"]}
                                  className="mb-0 ml-2 w-full"
                                  valuePropName="checked"
                                >
                                  <Checkbox value={answerIndex} />
                                </Form.Item>
                                <Form.Item
                                  {...field}
                                  name={[field.name, "content"]}
                                  className="mb-0 ml-2 w-full"
                                  required
                                  rules={[
                                    validateRequireInput(
                                      "Vui lòng nhập đáp án",
                                    ),
                                  ]}
                                >
                                  <Input
                                    placeholder="Nhập đáp án"
                                    style={{ width: 700 }}
                                  />
                                </Form.Item>
                              </div>

                              <MinusCircleOutlined
                                style={{ fontSize: 20 }}
                                className="dynamic-delete-button"
                                onClick={() => remove(field.name)}
                              />
                            </div>
                          ))}
                          <Button
                            type="dashed"
                            onClick={() =>
                              add({
                                ...initAnswerValue,
                                correct: fields?.length === 0,
                              })
                            }
                            icon={<PlusOutlined />}
                          >
                            Thêm đáp án
                          </Button>
                        </Checkbox.Group>
                      )}
                    </>
                  )}
                </Form.List>
              </div>
            </Panel>
          ))}
        </Collapse>

        <div className="flex items-center justify-center gap-4">
          <Button onClick={() => router.push("/learning-management/questions")}>
            Huỷ
          </Button>
          <Button type="primary" htmlType="submit">
            Tạo
          </Button>
        </div>
      </Form>

      {questions?.length > 0 ? (
        <Pagination
          current={currentPage}
          pageSize={questionsPerPage}
          total={numQuestions}
          onChange={handlePageChange}
        />
      ) : null}
    </div>
  );
};

export default QuestionCreate;
