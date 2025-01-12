"use client";
import { AlphabetIcon, ClassIcon, ExamIcon, TopicIcon } from "@/assets/icons";
import React, { useState } from "react";
import CardDataStats from "../CardDataStats";
import { useQuery } from "@tanstack/react-query";
import Learning from "@/model/Learning";
import { Select, Spin, Image } from "antd";
import { useRouter } from "next/navigation";
import { usePage } from "@/hooks/usePage";
import Exam from "@/model/Exam";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { GenerateUtils } from "@/utils/generate";

export const filterOption = (input: string, option: any) =>
  (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

const LeaningProcess: React.FC = () => {
  const router = useRouter();
  const user: User = useSelector((state: RootState) => state.admin);

  // Danh sách topic
  const { data: userStatistic, isFetching: isFetchingProcess } = useQuery({
    queryKey: ["getLearningProcess"],
    queryFn: async () => {
      const res = await Learning.leaningProcess(user.id as number);
      return res;
    },
  });

  // API lấy danh sách từ theo topics
  const { data: classJoined, isFetching } = useQuery({
    queryKey: ["userClasslist"],
    queryFn: async () => {
      const res = await Learning.classJoined();
      return res;
    },
  });

  return (
    <Spin spinning={isFetching || isFetchingProcess}>
      <div className="mb-3 flex justify-between text-xl font-semibold uppercase">
        <div className="font-bold ">Tiến độ học tập</div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <CardDataStats
          title="Lớp học tham gia"
          total={`${userStatistic?.totalClassesJoined}`}
        >
          <ClassIcon size={24} color="#3C50E0" />
        </CardDataStats>

        <CardDataStats
          title="Lượt học từ vựng"
          total={`${userStatistic?.vocabularyViews}`}
        >
          <AlphabetIcon size={24} color="#3C50E0" />
        </CardDataStats>
        <CardDataStats
          title="Bài kiểm tra hoàn thành"
          total={`${userStatistic?.testsCompleted}`}
          onClick={() => router.push("/exam")}
        >
          <ExamIcon size={24} color="#3C50E0" />
        </CardDataStats>
        <CardDataStats
          title="Điểm trung bình"
          total={`${userStatistic?.averageScore}`}
        >
          <TopicIcon size={24} color="#3C50E0" />
        </CardDataStats>
      </div>
      <div className="my-3 flex flex-col justify-between text-xl font-semibold ">
        <div className="font-bold uppercase ">Lớp học của tôi</div>
        <div className="mt-3 grid grid-cols-4 gap-4">
          {React.Children.toArray(
            classJoined?.map((item: any) => (
              <div
                key={item.id}
                className="cursor-pointer rounded-lg border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark"
              >
                <div className="items-between flex h-full flex-col justify-between gap-3">
                  <Image
                    src={GenerateUtils.genUrlImage(item?.thumbnailPath)}
                    alt=""
                  />
                  <div
                    className="text-start font-bold text-blue-500"
                    onClick={() => {
                      router.push(`/class/${item.id}`);
                    }}
                  >
                    {`${item.name}`}
                  </div>
                </div>
              </div>
            )),
          )}
        </div>
      </div>
    </Spin>
  );
};

export default LeaningProcess;
