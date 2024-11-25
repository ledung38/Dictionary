"use client";
import { usePage } from "@/hooks/usePage";
import Learning from "@/model/Learning";
import User from "@/model/User";
import { UserOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Avatar, Button, Spin, Table, message } from "antd";
import React from "react";

const RequestPage: React.FC = () => {
  // API lấy danh sách yêu cầu
  const { page, pageSize, content, isFetching, pagination, refetch } = usePage(
    ["getAllClassPending"],
    Learning.getListClass,
    {
      status: "PENDING",
    },
  );

  // Chấp nhận
  const mutationApprove = useMutation({
    mutationFn: Learning.editClass,
    onSuccess: () => {
      message.success("Xác nhận thành công");
      refetch();
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
      title: "Tên lớp học",
      dataIndex: "name",
      key: "name",
      width: "30%",
      render: (value: any, record: User) => (
        <div className="flex items-center gap-2">
          <Avatar icon={<UserOutlined />} src={record.avatarLocation} />
          <div className="text-base">{value}</div>
        </div>
      ),
    },
    {
      title: "Tên lớp",
      dataIndex: "classLevel",
      key: "classLevel",
      width: "20%",
    },
    {
      title: "Tên giáo viên",
      dataIndex: "teacher",
      key: "teacher",
      render: (value: any) => <div className="text-base">{value?.name}</div>,
      width: "20%",
    },
    {
      title: "Phê duyệt",
      dataIndex: "id",
      key: "id",
      width: "20%",
      render: (value: number) => (
        <>
          <Button
            key={value}
            onClick={() =>
              mutationApprove.mutate({
                id: value,
                status: "APPROVED",
              })
            }
          >
            Xác nhận
          </Button>
        </>
      ),
    },
  ];

  return (
    <Spin spinning={isFetching}>
      <div className="flex flex-col items-center">
        <div className="mt-6 w-full max-w-full">
          <Table
            columns={columns as any}
            dataSource={content}
            pagination={{ ...pagination, showSizeChanger: false }}
          />
        </div>
      </div>
    </Spin>
  );
};

export default RequestPage;
