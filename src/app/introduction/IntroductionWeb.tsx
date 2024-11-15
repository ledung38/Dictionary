"use client";
import { colors } from "@/assets/colors";
import { Logo } from "@/assets/icons";
import Learning from "@/model/Learning";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";
import DOMPurify from "dompurify";
import React from "react";

const IntroductionWeb: React.FC = () => {
  // API lấy thông tin lời giới thiệu
  const { data: introductionData, isFetching } = useQuery({
    queryKey: ["getIntroductionWeb"],
    queryFn: async () => {
      const res = await Learning.getIntroduction();

      return {
        title: res?.data.title,
        body: res?.data.body,
        footer: res?.data.footer,
      } as {
        title: string;
        body: string;
        footer: string;
      };
    },
  });

  return (
    <Spin spinning={isFetching}>
      <div className="bg-gray-100 flex max-h-screen flex-col items-center justify-center overflow-hidden px-4">
        <div className="mb-6 flex items-end justify-center">
          <Logo size={80} color={colors.primary400} />
          <div className="mb-1 text-3xl font-bold text-blue-600">eSign</div>
        </div>
        <div className="max-w-2xl rounded-lg bg-white p-6 text-justify shadow-lg hover:start-11 hover:shadow-1">
          <h1 className="text-gray-800 mb-4 text-2xl font-bold">
            {introductionData?.title}
          </h1>
          <div
            className="text-gray-700 mb-4"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(introductionData?.body || ""),
            }}
          />

          <p className="text-gray-700 font-semibold">
            {introductionData?.footer}
          </p>
        </div>
      </div>
    </Spin>
  );
};

export default IntroductionWeb;
