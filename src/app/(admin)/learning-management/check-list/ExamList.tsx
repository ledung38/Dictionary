"use client";
import { colors } from "@/assets/colors";
import { usePage } from "@/hooks/usePage";
import Exam from "@/model/Exam";
import Learning from "@/model/Learning";
import { DeleteOutlined, EditFilled, MoreOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Dropdown, Input, Select, Table, message } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styled from "styled-components";

interface Exam {
  key: string;
  name: string;
  questionCount: number;
  status: number;
}

interface FilterParams {
  page: number;
  size: number;
  topicId: number;
  status: number;
}

const exams: Exam[] = [
  { key: "1", name: "Bài kiểm tra 1", questionCount: 10, status: 1 },
  { key: "2", name: "Bài kiểm tra 2", questionCount: 15, status: 0 },
];

const optionStatus = [
  {
    label: "Đã hoàn thành",
    value: 1,
  },
  {
    label: "Chưa hoàn thành",
    value: 0,
  },
  {
    label: "Tất cả",
    value: -1,
  },
];

const ExamListPage = ({ isPrivate }: any) => {
  const router = useRouter();

  // xử lý khi hover vào row
  const [filterParams, setFilterParams] = useState<{
    classRoomId: number | string;
    nameSearch: string;
    isPrivate: string;
  }>({
    classRoomId: 0,
    nameSearch: "",
    isPrivate: `${isPrivate}`,
  });

  // API lấy danh sách  bài kiểm tra
  const { page, pageSize, content, isFetching, pagination, refetch } = usePage(
    ["getLstExam", filterParams],
    Exam.getLstExam,
    {
      ...filterParams,
    },
  );

  // API lấy danh sách  topics
  const { data: allTopics } = useQuery({
    queryKey: ["getAllTopics", isPrivate],
    queryFn: async () => {
      const res = await Learning.getAllTopics({ isPrivate: isPrivate });
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

  // Xoá bài kiểm tra
  const mutationDeleteUser = useMutation({
    mutationFn: Exam.deleteExam,
    onSuccess: () => {
      message.success("Xoá bài kiểm tra thành công");
      refetch();
    },
    onError: () => {
      message.error("Xoá bài kiểm tra thất bại");
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
      fixed: "right",
      dataIndex: "examId",
      width: "40px",
      align: "center",
      render: (value: number, record: any) => {
        const items = [
          {
            key: "1",
            label: (
              <div
                className="flex items-center gap-x-3 py-[3px]"
                onClick={() =>
                  router.push(
                    `/learning-management/check-list/create-edit/?id=${value}`,
                  )
                }
              >
                <EditFilled />
                Chỉnh sửa
              </div>
            ),
          },
          {
            key: "2",
            label: (
              <div
                className="text-red600 flex items-center gap-x-3 py-[3px] text-red"
                onClick={() => mutationDeleteUser.mutate(value)}
              >
                <DeleteOutlined style={{ color: colors.red700 }} />
                Xóa
              </div>
            ),
          },
        ];
        return (
          <Dropdown menu={{ items }}>
            <div className="flex w-5 items-center justify-center">
              <div className="hidden-table-action" key={record.attributeId}>
                <MoreOutlined />
              </div>
            </div>
          </Dropdown>
        );
      },
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
          placeholder="Lớp học"
          options={allClass}
          onChange={(value, option: any) => {
            if (value) {
              setFilterParams({ ...filterParams, classRoomId: value });
            } else {
              setFilterParams({ ...filterParams, classRoomId: 0 });
            }
          }}
        />
      </div>
      <div className="mb-3 flex justify-end gap-3">
        {/* <Button type="primary">Thêm user vào bài kiểm tra</Button> */}
        <Button
          type="primary"
          onClick={() =>
            router.push(
              `/learning-management/check-list/create-edit/?isPrivate=${isPrivate}`,
            )
          }
        >
          Thêm mới
        </Button>
      </div>
      <CustomTable
        dataSource={content}
        columns={columns as any}
        scroll={{ x: 1100, y: 440 }}
        loading={isFetching}
        pagination={{ ...pagination, showSizeChanger: false }}
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
