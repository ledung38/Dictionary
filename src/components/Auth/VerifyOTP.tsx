"use client";
import Auth from "@/model/Auth";
import { RootState } from "@/store";
import { LeftOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Spin, message } from "antd";
import { InputOTP } from "antd-input-otp";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const VerifyOtp = () => {
  //* Hooks
  const router = useRouter();
  const [form] = Form.useForm();
  //* State
  const [seconds, setSeconds] = useState(120);

  const register = useSelector((state: RootState) => state.register);

  useEffect(() => {
    seconds > 0 && setTimeout(() => setSeconds(seconds - 1), 1000);
  }, [seconds]);

  //* API
  const veryOtpMutation = useMutation({
    mutationFn: Auth.validateOtp,
    onSuccess: async () => {
      message.success("Đăng ký tài khoản thành công !");
      router.push("/login");
    },

    onError: (error: any) => {
      console.log(error);
      message.error(error?.data?.message);
    },
  });

  // gen lại otp
  const registerMutation = useMutation({
    mutationFn: Auth.register,
    onSuccess: async (res) => {
      message.success(`Mã OTP đã được gửi về email ${register.email} `);
    },
    onError: (error: Error) => {
      message.error("Email đã được sử dụng");
    },
  });

  const handleFinish = (values: { otp: any }) => {
    const { otp } = values;
    veryOtpMutation.mutate({
      email: register.email,
      otpNum: parseInt(otp.join("")),
    });
  };

  // xử lý gửi lại otp
  const handleSendOTP = () => {
    registerMutation.mutate(register);
  };

  return (
    <Spin spinning={registerMutation.isPending || registerMutation.isPending}>
      <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
        <section className="card">
          <div
            className="mb-6 text-primary hover:cursor-pointer"
            onClick={() => router.back()}
          >
            <LeftOutlined size={30} /> Quay lại
          </div>
          <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
            Xác thực OTP
          </h2>
          <Form form={form} onFinish={handleFinish}>
            <Form.Item
              name="otp"
              className="center-error-message"
              rules={[{ validator: async () => Promise.resolve() }]}
            >
              <InputOTP autoFocus inputType="numeric" length={6} />
            </Form.Item>

            <Form.Item noStyle>
              <Button block size="large" htmlType="submit" type="primary">
                Xác nhận
              </Button>
            </Form.Item>
          </Form>
          <div className="mt-6 flex h-7  flex-col items-start justify-start gap-4">
            <div className="text-gray-900 text-sm font-normal leading-tight tracking-tight">
              Gửi lại mã xác thực ({seconds}s)
            </div>
            <Button
              block
              size="large"
              disabled={seconds > 0}
              onClick={handleSendOTP}
            >
              Gửi lại
            </Button>
          </div>
        </section>
      </div>
    </Spin>
  );
};

export default VerifyOtp;
