"use client";
import { TextEditor } from "@/components/UI/TextEditor/TextEditor";
import Learning from "@/model/Learning";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, Input, Spin, message } from "antd";
import { useForm } from "antd/es/form/Form";
import React from "react";

const IntroductionPage: React.FC = () => {
  const [form] = useForm();

  // API lấy thông tin lời giới thiệu
  const {
    data: introductionData,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["getIntroduction"],
    queryFn: async () => {
      const res = await Learning.getIntroduction();
      form.setFieldsValue({
        introductionId: res?.data.introductionId,
        title: res?.data.title,
        body: res?.data.body,
        footer: res?.data.footer,
      });
      return res?.data;
    },
  });

  // Thêm mới hoặc chỉnh sửa
  const mutation = useMutation({
    mutationFn: (values: any) => {
      return values.introductionId
        ? Learning.editIntroduction(values)
        : Learning.addIntroduction(values);
    },
    onSuccess: () => {
      message.success("Lưu lời giới thiệu thành công");
      refetch();
    },
    onError: () => {
      message.error("Lưu lời giới thiệu thất bại");
    },
  });

  return (
    <Spin spinning={isFetching}>
      <div className="mx-auto mt-8 w-full max-w-lg bg-white p-4">
        <Form
          form={form}
          onFinish={(values) => {
            mutation.mutate({
              title: values?.title || "",
              body: values?.body,
              footer: values?.footer || "",
            });
          }}
          layout="vertical"
        >
          <Form.Item name="introductionId" hidden />
          <Form.Item
            label="Title"
            className="w-full"
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
          >
            <Input placeholder="Nhập tiêu đề" className="w-full" />
          </Form.Item>
          <Form.Item
            className="w-full"
            name="body"
            label={<div className="caption-12-medium">Nội dung</div>}
            rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
          >
            <TextEditor maxLength={1500} placeholder="Nhập nội dung" />
          </Form.Item>

          <Form.Item label="Footer" className="w-full" name="footer">
            <Input placeholder="Nhập footer" className="w-full" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              {form.getFieldValue("introductionId") ? "Cập nhật" : "Thêm mới"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Spin>
  );
};

export default IntroductionPage;
