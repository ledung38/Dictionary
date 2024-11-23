"use client";
import Loader from "@/components/UI/Loader";
import Auth from "@/model/Auth";
import { register } from "@/store/slices/registerSlice";
import {
  validateEmail,
  validatePassword,
  validateRequireInput,
} from "@/utils/validation/validtor";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, Select, message } from "antd";
import { useForm } from "antd/es/form/Form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch } from "react-redux";

const Register: React.FC = () => {
  //* Hooks
  const router = useRouter();
  const dispatch = useDispatch();
  const [form] = useForm();

  //* API
  const registerMutation = useMutation({
    mutationFn: Auth.register,
    onSuccess: async (res) => {
      if (res.data.code === 404) {
        message.error("Email đã được sử dụng");
      } else {
        const email = form.getFieldValue("email");
        message.success(`Mã OTP đã được gửi về email ${email} `);

        router.push(`/verify-otp`);
      }
    },
    onError: (error: any) => {
      message.error(error.data?.message);
    },
  });

  const onFinish = (values: any) => {
    dispatch(register(values));
    registerMutation.mutate(values);
  };

  return (
    <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
      <h2 className="mb-9 text-2xl font-bold text-black text-purple-600 dark:text-white sm:text-title-xl2">
        Đăng ký
      </h2>

      <Form
        form={form}
        name="register"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        className="mx-auto max-w-md"
      >
        <Form.Item
          name="name"
          required
          rules={[validateRequireInput("Tên không được bỏ trống")]}
        >
          <Input
            size="large"
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Họ và tên"
            style={{
              height: "50px",
              display: "flex",
              alignItems: "center",
              borderRadius: "8px",
            }}
          />
        </Form.Item>

        <Form.Item
          name="email"
          required
          rules={[
            validateRequireInput("Email không được bỏ trống"),
            validateEmail("Sai định dạng email"),
          ]}
        >
          <Input
            size="large"
            prefix={<MailOutlined className="site-form-item-icon" />}
            type="email"
            placeholder="Email"
            style={{
              height: "50px",
              display: "flex",
              alignItems: "center",
              borderRadius: "8px",
            }}
          />
        </Form.Item>

        <Form.Item
          name="password"
          required
          rules={[
            validateRequireInput("Mật khẩu không được bỏ trống"),
            validatePassword(
              "Mật khẩu phải có từ 8-16 ký tự, bao gồm ít nhất 1 chữ viết hoa, 1 chữ viết thường, 1 chữ số và 1 ký tự đặc biệt trong !@#$%^&+=",
            ),
          ]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="Mật khẩu"
            style={{
              height: "50px",
              display: "flex",
              alignItems: "center",
              borderRadius: "8px",
            }}
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item
          name="confirm"
          dependencies={["password"]}
          hasFeedback
          required
          rules={[
            validateRequireInput("Nhập lại mật khẩu không được bỏ trống"),
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("Nhập lại mật khẩu không khớp");
              },
            }),
          ]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="Nhập lại mật khẩu"
            style={{
              height: "50px",
              display: "flex",
              alignItems: "center",
              borderRadius: "8px",
            }}
          />
        </Form.Item>
        <Form.Item
          name="role"
          required
          rules={[validateRequireInput("Quyền không được bỏ trống")]}
        >
          <Select
            size="large"
            placeholder="Chọn vai trò"
            style={{
              height: "50px",
              display: "flex",
              alignItems: "center",
              borderRadius: "8px",
            }}
            options={[
              {
                label: "Teacher",
                value: "TEACHER",
              },
              {
                label: "Student",
                value: "STUDENT",
              },
              {
                label: "Volunteer",
                value: "VOLUNTEER",
              },
            ]}
          />
        </Form.Item>

        <Form.Item className="mobile:mb-2">
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            Đăng ký
          </Button>
        </Form.Item>

        <Form.Item className=" text-center">
          <p>
            Quay lại{" "}
            <Link
              href="/login"
              className="text-purple-600 hover:text-purple-700"
            >
              Đăng nhập
            </Link>
          </p>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
