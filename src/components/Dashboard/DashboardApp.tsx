"use client";
import { AlphabetIcon, ClassIcon, ExamIcon, TopicIcon } from "@/assets/icons";
import React, { useState } from "react";
import CardDataStats from "../CardDataStats";
import { useQuery } from "@tanstack/react-query";
import Learning from "@/model/Learning";
import { Select, Spin } from "antd";
import { useRouter } from "next/navigation";
import { usePage } from "@/hooks/usePage";
import Exam from "@/model/Exam";

export const filterOption = (input: string, option: any) =>
  (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

const DashboardApp: React.FC = () => {
  const router = useRouter();
  const [stateDashboard, setStateDashboard] = useState<{
    topicsId: number;
    topicName: string;
    totalTopic: number;
    totalVocabulary: number;
    totalVocabularyTopic?: number;
  }>({
    topicsId: 0,
    topicName: "",
    totalTopic: 0,
    totalVocabulary: 0,
    totalVocabularyTopic: 0,
  });


  const {
    topicsId,
    totalTopic,
    totalVocabulary,
    totalVocabularyTopic,
    topicName,
  } = stateDashboard;

  // Danh sách lớp
  const { data: totalClasses, isFetching } = useQuery({
    queryKey: ["getListClassName"],
    queryFn: async () => {
      const res = await Learning.getListClass();
      return res.data?.length;
    },
  });

  // API lấy danh sách  bài kiểm tra
  const { total, refetch } = usePage(["getLstExam"], Exam.getLstExam, {
    classRoomId: 0,
    nameSearch: "",
  });

  // Danh sách topic
  const { data: allTopics, isFetching: isFetchingTopic } = useQuery({
    queryKey: ["getAllTopics"],
    queryFn: async () => {
      const res = await Learning.getAllTopics();

      const responsive = await Learning.getAllVocabulary();
      setStateDashboard({
        ...stateDashboard,
        totalTopic: res?.data?.length,
        totalVocabulary: responsive?.data.length,
      });
      return res?.data?.map((item: { topicId: any; content: any }) => ({
        id: item.topicId,
        value: item.topicId,
        label: item.content,
        text: item.content,
      }));
    },
  });

  // API lấy danh sách từ theo topics
  const { data: allVocabularyTopic } = useQuery({
    queryKey: ["getVocabularyTopic", topicsId],
    queryFn: async () => {
      const res = await Learning.getVocabularyTopic(topicsId);
      setStateDashboard({
        ...stateDashboard,
        totalVocabularyTopic: res?.data?.length,
      });
      return res?.data;
    },
    enabled: !!topicsId,
  });

  return (
    <Spin spinning={isFetching || isFetchingTopic}>
      <div className="mb-3 flex justify-between text-xl font-semibold uppercase">
        <div className="font-bold ">
          Lớp học & Chủ đề & Từ vựng & Bài kiểm tra{" "}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <CardDataStats title="Lớp học" total={`${totalClasses}`}>
          <ClassIcon size={24} color="#3C50E0" />
        </CardDataStats>
        <CardDataStats title="Chủ đề" total={`${totalTopic}`}>
          <TopicIcon size={24} color="#3C50E0" />
        </CardDataStats>
        <CardDataStats title="Từ vựng" total={`${totalVocabulary}`}>
          <AlphabetIcon size={24} color="#3C50E0" />
        </CardDataStats>
        <CardDataStats title="Bài kiểm tra" total={`${total}`}>
          <ExamIcon size={24} color="#3C50E0" />
        </CardDataStats>
      </div>
      <div className="my-3 flex flex-col justify-between text-xl font-semibold ">
        <div className="font-bold uppercase ">Thống kê theo chủ đề </div>
        <div className="mt-2">
          <Select
            showSearch
            allowClear
            placeholder="Chọn chủ đề"
            suffixIcon={null}
            style={{ width: "60%" }}
            options={allTopics}
            onChange={(e, option: any) => {
              setStateDashboard({
                ...stateDashboard,
                topicsId: e,
                topicName: option?.label,
              });
            }}
            filterOption={filterOption}
          />
        </div>
        {totalVocabularyTopic && topicsId ? (
          <div className="flex items-center justify-center gap-4 pb-10">
            <div
              className="mt-6 h-32 w-64 rounded-xl bg-white p-3 hover:cursor-pointer"
              style={{
                border: "3px solid #f6f6f6",
              }}
            >
              <div className="text-gray-500  mb-5 flex text-sm">
                <div className="font-bold">Chủ đề</div>
              </div>
              <div
                className="flex items-center justify-between "
                onClick={() => router.push(`/study/topics?topicId=${topicsId}`)}
              >
                <div
                  className="flex cursor-pointer items-center text-[14px] font-bold"
                  aria-hidden="true"
                >
                  {topicName}
                </div>
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{
                    backgroundColor: "#EAECF4",
                    height: "30px",
                    width: "30px",
                  }}
                ></div>
              </div>
            </div>

            <div
              className="mt-6 h-32 w-64 rounded-xl bg-white p-3 hover:cursor-pointer"
              style={{
                border: "3px solid #f6f6f6",
              }}
            >
              <div className="text-gray-500 mb-5 flex justify-between text-sm">
                <div>Tổng</div>
                <div className="font-bold">Từ vựng</div>
              </div>
              <div
                className="flex items-center justify-between "
                onClick={() => router.push(`/study/topics?topicId=${topicsId}`)}
              >
                <div
                  className="flex cursor-pointer items-center text-[34px] font-bold"
                  aria-hidden="true"
                >
                  {totalVocabularyTopic}
                </div>
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{
                    backgroundColor: "#EAECF4",
                    height: "30px",
                    width: "30px",
                  }}
                ></div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Spin>
  );
};

export default DashboardApp;
