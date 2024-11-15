// components/Auth/Login.tsx
"use client";
import Loader from "@/components/UI/Loader";
import Auth from "@/model/Auth";
import User from "@/model/User";
import { login } from "@/store/slices/adminSlice";
import {
  validateEmail,
  validateRequireInput,
} from "@/utils/validation/validtor";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, message } from "antd";
import { useForm } from "antd/es/form/Form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch } from "react-redux";

const Login: React.FC = () => {
  const [form] = useForm();
  const dispatch = useDispatch();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: Auth.login,
    onSuccess: async (res) => {
      localStorage.setItem("access_token", res.access_token);
      localStorage.setItem("refresh_token", res.refresh_token);
      const response: any = await User.getProfile();
      dispatch(login(response.data));
      localStorage.setItem("user", response.data);
      message.success("Đăng nhập thành công");
      router.push("/");
    },
    onError: (error: Error) => {
      message.error("Sai tài khoản hoặc mật khẩu");
    },
  });

  const handleSubmit = (values: any) => {
    loginMutation.mutate(values);
  };

  if (loginMutation.isPending) {
    return <Loader />;
  }

  return (
    <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
      <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2 text-purple-600">
        Đăng nhập
      </h2>

      <Form
        form={form}
        onFinish={handleSubmit}
        initialValues={{ remember: true }}
      >
        <Form.Item
          name="email"
          required
          rules={[
            validateRequireInput("Không bỏ trống trường này"),
            validateEmail("Sai định dạng email"),
          ]}
        >
          <Input
            size="large"
            prefix={<MailOutlined className="site-form-item-icon" />}
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
          rules={[validateRequireInput("Không bỏ trống trường này")]}
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
          />
        </Form.Item>
        <Form.Item>
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>

      <div className="mt-6 text-center">
        <p>
          Bạn chưa có tài khoản?{" "}
          <Link href="/register" className="text-purple-600 hover:text-purple-700">
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
