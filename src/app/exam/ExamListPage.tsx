"use client";
import { colors } from "@/assets/colors";
import { usePage } from "@/hooks/usePage";
import Exam from "@/model/Exam";
import Learning from "@/model/Learning";
import { RootState } from "@/store";
import {
  DeleteFilled,
  DeleteOutlined,
  EditFilled,
  MenuFoldOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Dropdown, Input, Select, Table, message } from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

interface Exam {
  examId: number;
  name: string;
  questionCount: number;
  status: number;
}

const ExamListPage: React.FC = () => {
  const router = useRouter();
  const user: User = useSelector((state: RootState) => state.admin);
  // xử lý khi hover vào row
  const [filterParams, setFilterParams] = useState<{
    classRoomId: number;
    nameSearch: string;
    isPrivate?: string;
  }>({
    classRoomId: 0,
    nameSearch: "",
    isPrivate: "false",
  });

  // API lấy danh sách  bài kiểm tra
  const { page, pageSize, content, isFetching, pagination } = usePage(
    ["getLstExam", filterParams],
    Exam.getLstExam,
    {
      ...filterParams,
    },
  );

  // API lấy danh sách  bài kiểm tra của user
  const { data: allExamUser, refetch } = useQuery({
    queryKey: ["getLstExamUser"],
    queryFn: async () => {
      const res = await Exam.getLstExamUser();
      return res?.data?.content;
    },
  });

  // Thêm bài kiểm tra cho user
  const mutationAddUser = useMutation({
    mutationFn: Exam.addExamForUser,
    onSuccess: () => {
      message.success("Thêm bài kiểm tra thành công");
      refetch();
    },
    onError: () => {
      message.error("Thêm bài kiểm tra thất bại");
    },
  });

  // Xoá bài kiểm tra user
  const mutationDeleteUser = useMutation({
    mutationFn: Exam.deleteExamUser,
    onSuccess: () => {
      message.success("Xoá bài kiểm tra thành công");
      refetch();
    },
    onError: () => {
      message.error("Xoá bài kiểm tra thất bại");
    },
  });

  // API lấy danh sách  topics
  const { data: allTopics } = useQuery({
    queryKey: ["getAllTopics"],
    queryFn: async () => {
      const res = await Learning.getAllTopics();
      return res?.data?.map((item: { topicId: any; content: any }) => ({
        id: item.topicId,
        value: item.topicId,
        label: item.content,
        text: item.content,
      }));
    },
  });

  // Dánh sách lớp
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

  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      render: (value: any, record: any, index: number) =>
        (page - 1) * pageSize + index + 1,
      width: 80,
    },
    {
      title: "Tên bài kiểm tra",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Số câu hỏi",
      dataIndex: "numberOfQuestions",
      key: "numberOfQuestions",
    },
    {
      dataIndex: "examId",
      width: 120,
      align: "center",
      render: (value: number, record: any) => {
        return (
          <>
            {allExamUser?.filter(
              (item: { examId: number }) => item.examId === value,
            )?.length ? null : (
              <Button
                onClick={() => {
                  mutationAddUser.mutate({
                    examIds: [value],
                    userId: user.userId,
                  });
                }}
              >
                Làm bài
              </Button>
            )}
          </>
        );
      },
    },
  ];

  const columnsExamUser = [
    {
      title: "Tên bài kiểm tra",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <div
          className="hover:cursor-pointer"
          onClick={() => router.push(`/exam/${record?.examId}`)}
        >
          <div className="text-blue-500">{text}</div>
        </div>
      ),
      width: 150,
    },
    {
      title: "Số câu hỏi",
      dataIndex: "numberOfQuestions",
      key: "numberOfQuestions",
      width: 100,
    },
    {
      title: "Điểm số (Thang điểm 10 )",
      dataIndex: "score",
      key: "score",
      width: 100,
      render: (value: number) => <div className="font-bold">{value}</div>,
    },
    {
      title: "Trạng thái",
      dataIndex: "finish",
      key: "finish",
      render: (status: boolean) =>
        status ? (
          <div className="caption-12-medium flex w-[120px] items-center justify-center rounded bg-green-100 px-4 py-2 text-green-700">
            Đã hoàn thành
          </div>
        ) : (
          <div className="caption-12-medium flex w-[128px] items-center justify-center rounded bg-neutral-200 px-4 py-2 text-neutral-700">
            Chưa hoàn thành
          </div>
        ),
      width: 100,
    },
    {
      dataIndex: "examId",
      width: 40,
      align: "center",
      render: (value: number, record: any) => (
        <div className="flex items-center gap-4">
          {record?.finish ? (
            <Button
              onClick={() => router.push(`/exam/${record?.examId}/?redo=true`)}
            >
              Làm lại
            </Button>
          ) : null}
        </div>
      ),
    },
    {
      fixed: "right",
      dataIndex: "examId",
      width: 40,
      align: "center",
      render: (value: number, record: any) => (
        <div
          className="flex  w-5 items-center justify-center hover:cursor-pointer"
          onClick={() => {
            mutationDeleteUser.mutate(value);
          }}
        >
          <div>
            <DeleteOutlined style={{ color: colors.red700, fontSize: 24 }} />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-4">
      <h1 className="mb-4 text-2xl font-bold">Danh sách bài kiểm tra</h1>
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Input className="w-full" placeholder="Tên bài kiểm tra" />
        <Select
          className="w-full"
          allowClear
          placeholder="Lớp"
          options={allClass}
          onChange={(value, option: any) =>
            setFilterParams({ ...filterParams, classRoomId: value })
          }
        />
        {(user?.role === "ADMIN" || user?.role === "TEACHER") && (
          <Select
            className="w-full"
            allowClear
            placeholder="Loại bài kiểm tra"
            defaultValue={"false"}
            options={[
              {
                label: "Chung",
                value: "false",
              },
              {
                label: "Riêng",
                value: "true",
              },
            ]}
            onChange={(value, option: any) =>
              setFilterParams({ ...filterParams, isPrivate: value })
            }
          />
        )}
      </div>

      <CustomTable
        dataSource={content}
        columns={columns as any}
        scroll={{ x: 1100, y: 440 }}
        loading={isFetching}
        pagination={{ ...pagination, showSizeChanger: false }}
        rowKey="examId"
      />

      <h1 className="mb-4 text-2xl font-bold">Bài kiểm tra của tôi</h1>

      <CustomTable
        dataSource={allExamUser}
        columns={columnsExamUser as any}
        scroll={{ x: 1100, y: 440 }}
        rowKey="examId"
      />
    </div>
  );
};

export default ExamListPage;

export const CustomTable = styled(Table)`
  .ant-table-tbody {
    padding: 10px 16px 10px 16px;
  }
  .ant-table-tbody > tr > td {
    padding: 10px 16px 10px 16px;
    background-color: white;
  }
  .ant-table-cell.ant-table-cell-with-append {
    display: flex;
    padding-left: 0;
  }

  .ant-table-tbody > tr:hover {
    background-color: #f6f7f9;
  }

  .ant-table-thead .ant-table-cell {
    background-color: ${colors.neutral200};
    color: ${colors.neutral800};
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 16px;
    letter-spacing: 0.09px;
  }
  .ant-table-row {
    color: ${colors.neutral1100};
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0.07px;
  }

  /* Hover */
  .ant-table-wrapper .ant-table-tbody > tr.ant-table-row:hover > th,
  .ant-table-wrapper .ant-table-tbody > tr.ant-table-row:hover > td,
  .ant-table-wrapper .ant-table-tbody > tr > th.ant-table-cell-row-hover,
  .ant-table-wrapper .ant-table-tbody > tr > td.ant-table-cell-row-hover {
    background: ${colors.neutral100};
  }

  /* panigation */
  .ant-pagination.ant-table-pagination.ant-table-pagination-right {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .ant-pagination-item {
    width: 32px;
    height: 32px;
    border-color: white;
    border-radius: 50%;
    color: ${colors.neutral1100} !important;
  }
  .ant-pagination-item.ant-pagination-item-active {
    background-color: ${colors.neutral200} !important;
  }
  .ant-pagination .ant-pagination-item-active:hover {
    border-color: ${colors.neutral200} !important;
  }
  .ant-pagination .ant-pagination-item-active a {
    color: ${colors.neutral1100} !important;
    text-align: center;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    letter-spacing: 0.07px;
  }

  .ant-table-body {
    scrollbar-width: auto;
    scrollbar-color: auto;
  }

  // custom scrollbar
  .ant-table-body::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }

  .ant-table-body::-webkit-scrollbar-track {
    background-color: transparent;
  }

  .ant-table-body::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background-color: #babac0;
  }
`;
