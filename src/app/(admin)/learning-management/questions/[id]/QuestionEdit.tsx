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
  Radio,
  Select,
  message,
} from "antd";
import { useForm, useWatch } from "antd/es/form/Form";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import QuestionModal from "../../check-list/create-edit/ModalSelectFile";

interface Answer {
  content: string;
  imageLocation: string;
  videoLocation: string;
  correct: boolean;
}

const initAnswerValue = {
  content: "",
  imageLocation: "",
  videoLocation: "",
  correct: false,
};

const convertDataToFormValues = (data: any) => {
  const questions = {
    typeFile: "existing",
    questionType:
      data.answerResList?.filter((item: any) => item.correct)?.length > 1
        ? "MULTIPLE_ANSWERS"
        : "ONE_ANSWER",
    file: data?.imageLocation || data?.videoLocation,
    ...data,
  };
  return questions;
};

const QuestionEdit: React.FC = () => {
  const router = useRouter();
  const [form] = useForm();
  const { id } = useParams();
  const [openChooseVideo, setOpenChooseVideo] = useState<boolean>(false);
  const [defaultAnswer, setDefaultAnswer] = useState<number | undefined>(
    undefined,
  );

  // Form
  const imageLocation = useWatch("imageLocation", form);
  const videoLocation = useWatch("videoLocation", form);
  const typeFile = useWatch("fileType", form);
  const typeAnswer = useWatch("questionType", form);
  const lstAnswer = useWatch("answerResList", form);

  useQuery({
    queryKey: ["getDetailQuestion", id],
    queryFn: async () => {
      if (id) {
        const res = await Questions.getDetailQuestion(Number(id));
        const formValues = convertDataToFormValues(res?.data);
        form.setFieldsValue(formValues);
        if (formValues.questionType === "ONE_ANSWER") {
          const correctIndex = formValues.answerResList?.findIndex(
            (item: any) => item.correct,
          );
          setDefaultAnswer(correctIndex);
        }
        return res?.data;
      }
    },
    enabled: !!id,
  });

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

  const mutationEdit = useMutation({
    mutationFn: Questions.editQuestion,
    onSuccess: () => {
      message.success("Sửa câu hỏi thành công");
      router.push("/learning-management/questions");
    },
  });

  const mutationDeleteAnswer = useMutation({
    mutationFn: Questions.deleteAnswer,
    onSuccess: () => {
      message.success("Xoá đáp án thành công");
    },
  });

  return (
    <>
      <div className="container mx-auto bg-white p-4">
        <h1 className="mb-4 text-2xl font-bold">Chỉnh sửa câu hỏi</h1>
        <Form
          form={form}
          onFinish={(value) => {
            const req = {
              ...value,
              imageLocation: value.file
                ? isImage(value.file)
                  ? value.file
                  : ""
                : value.imageLocation,
              videoLocation: value.file
                ? !isImage(value.file)
                  ? value.file
                  : ""
                : value.videoLocation,
            };
            delete req.file;
            mutationEdit.mutate({
              ...req,
              updateAnswerReqs: req?.answerResList,
            });
          }}
          layout="vertical"
        >
          <Form.Item name="questionId" hidden />
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
            name="content"
            label="Tên câu hỏi"
            required
            rules={[validateRequireInput("Tên câu hỏi không được bỏ trống")]}
          >
            <Input placeholder="Nhập câu hỏi" />
          </Form.Item>

          <Form.Item
            name="questionType"
            label="Kiểu câu hỏi:"
            required
            rules={[validateRequireInput("Vui lòng chọn loại đáp án")]}
            initialValue={"ONE_ANSWER"}
          >
            <Select
              placeholder="Chọn loại đáp án"
              options={[
                { label: "Một đáp án", value: "ONE_ANSWER" },
                { label: "Nhiều đáp án", value: "MULTIPLE_ANSWERS" },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="fileType"
            label="Lựa chọn file (hình ảnh, video):"
            className="mb-4"
            initialValue="NOT_EXISTED"
          >
            <Select
              style={{ width: "100%" }}
              placeholder="Chọn hoặc tải lên file"
              onChange={() => {
                form.setFieldsValue({
                  imageLocation: "",
                  videoLocation: "",
                  file: "",
                });
              }}
            >
              <Select.Option value="NOT_EXISTED">
                Tải lên file mới
              </Select.Option>
              <Select.Option value="EXISTED">
                Chọn từ dữ liệu có sẵn
              </Select.Option>
            </Select>
          </Form.Item>
          <div className="mt-4">
            {typeFile === "EXISTED" && (
              <QuestionModal
                openChooseVideo={openChooseVideo}
                setOpenChooseVideo={setOpenChooseVideo}
                file={imageLocation || videoLocation}
                onChange={(value: any) => {
                  form.setFieldValue("file", "");
                  if (isImage(value)) {
                    form.setFieldsValue({
                      imageLocation: value,
                      videoLocation: "",
                    });
                  } else {
                    form.setFieldsValue({
                      videoLocation: value,
                      imageLocation: "",
                    });
                  }
                }}
              >
                <div
                  onClick={() => {
                    setOpenChooseVideo(true);
                  }}
                >
                  <Button>Chọn file</Button>
                </div>
              </QuestionModal>
            )}
          </div>
          <Form.Item
            name="file"
            className="mb-0 mt-3"
            hidden={!(typeFile === "NOT_EXISTED")}
          >
            {typeFile === "NOT_EXISTED" && <MediaUpload />}
          </Form.Item>
          <Form.Item
            name="imageLocation"
            hidden={!imageLocation}
            className="mb-0"
          >
            {imageLocation && typeFile === "EXISTED" && (
              <Image
                key={imageLocation}
                preview={false}
                alt="example"
                style={{
                  width: 200,
                  height: 200,
                  objectFit: "contain",
                }}
                src={imageLocation}
              />
            )}
          </Form.Item>
          <Form.Item
            name="videoLocation"
            hidden={!videoLocation}
            className="mb-0"
          >
            {videoLocation && typeFile === "EXISTED" && (
              <video
                key={videoLocation}
                controls
                style={{ width: 200, height: 200 }}
              >
                <source src={videoLocation} type="video/mp4" />
              </video>
            )}
          </Form.Item>

          <Form.List name="answerResList">
            {(fields, { add, remove }) => (
              <div className="mt-4">
                {typeAnswer === "ONE_ANSWER" ? (
                  <div className="w-full">
                    <Radio.Group
                      value={defaultAnswer}
                      onChange={(e) => {
                        fields?.map((field, index) => {
                          form.setFieldValue(
                            ["answerResList", index, "correct"],
                            index === e.target.value,
                          );
                          setDefaultAnswer(e.target.value);
                        });
                      }}
                    >
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
                            >
                              <Radio value={answerIndex} />
                            </Form.Item>

                            <Form.Item
                              name={[field.name, "content"]}
                              className="mb-0 ml-2 w-full"
                              required
                              rules={[
                                validateRequireInput("Vui lòng nhập đáp án"),
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
                            disabled={fields?.length === 1}
                            className="dynamic-delete-button"
                            onClick={() => {
                              remove(field.name);
                              mutationDeleteAnswer.mutate(
                                lstAnswer[field.name].answerId,
                              );
                            }}
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
                  </div>
                ) : (
                  <div>
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
                          >
                            <Checkbox />
                          </Form.Item>
                          <Form.Item
                            name={[field.name, "content"]}
                            className="mb-0 ml-2 w-full"
                            required
                            rules={[
                              validateRequireInput("Vui lòng nhập đáp án"),
                            ]}
                          >
                            <Input style={{ width: 700 }} />
                          </Form.Item>
                        </div>

                        <MinusCircleOutlined
                          style={{ fontSize: 20 }}
                          className="dynamic-delete-button"
                          onClick={() => {
                            remove(field.name);
                            mutationDeleteAnswer.mutate(
                              lstAnswer[field.name].answerId,
                            );
                          }}
                        />
                      </div>
                    ))}
                    <Button
                      type="dashed"
                      onClick={() =>
                        add({
                          ...initAnswerValue,
                          correct: false,
                        })
                      }
                      icon={<PlusOutlined />}
                    >
                      Thêm đáp án
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Form.List>

          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={() => router.push("/learning-management/questions")}
            >
              Huỷ
            </Button>
            <Button type="primary" htmlType="submit">
              Xác nhận
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default QuestionEdit;
