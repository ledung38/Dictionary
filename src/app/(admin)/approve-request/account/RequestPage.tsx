"use client";
import { usePage } from "@/hooks/usePage";
import User from "@/model/User";
import { UserOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import { Avatar, Button, Spin, Table, message } from "antd";
import React from "react";

const RequestPage: React.FC = () => {
  // API lấy danh sách yêu cầu
  // API lấy danh sách  bài kiểm tra
  const { page, pageSize, content, isFetching, pagination, refetch } = usePage(
    ["getAllAccount"],
    User.getAllAccount,
    {},
  );

  // Chấp nhận
  const mutationApprove = useMutation({
    mutationFn: User.approveAccount,
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
      title: "Tên người dùng",
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
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: "20%",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      width: "20%",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      width: "20%",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      width: "10%",
    },

    {
      title: "Phê duyệt",
      dataIndex: "userId",
      key: "userId",
      width: "20%",
      render: (value: number) => (
        <>
          <Button key={value} onClick={() => mutationApprove.mutate(value)}>
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
