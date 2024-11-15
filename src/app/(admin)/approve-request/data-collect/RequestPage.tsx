"use client";
import React, { useState } from "react";
import {
  Avatar,
  Button,
  Empty,
  Form,
  Image,
  Input,
  Modal,
  Popover,
  Select,
  Spin,
  Table,
  Tabs,
  message,
} from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import Learning from "@/model/Learning";
import { DeleteOutlined, EyeOutlined, UserOutlined } from "@ant-design/icons";
import { isImage } from "@/components/common/constants";
import moment from "moment";
import { validateRequire } from "@/utils/validation/validtor";
import { useForm } from "antd/es/form/Form";
import { CustomDiv, CustomDivPopper } from "@/app/collect-data/CollectData";
import { CustomTable } from "@/app/exam/ExamListPage";

interface ContactItem {
  id: number;
  avatar: string;
  volunteerEmail: string;
  vocabularyContent: string;
  dataLocation: string;
  created: string;
}

const RequestPage: React.FC = () => {
  const [form] = useForm();
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [previewFile, setPreviewFile] = useState<{
    open: boolean;
    file: any;
  }>({
    open: false,
    file: "",
  });

  const typeSelect = Form.useWatch("typeSelect", form);
  const [filterParams, setFilterParams] = useState<any>({
    status: 100,
  });

  // API lấy danh sách yêu cầu
  const {
    data: listRequests,
    refetch: refetchPending,
    isFetching: isFetchingPending,
  } = useQuery({
    queryKey: ["getPendingData"],
    queryFn: async () => {
      const res = await Learning.getPendingData();
      return res?.data as ContactItem[];
    },
  });

  // API lấy danh sách đã phê duyệt
  // API lấy danh sách  table
  const { data: allTableData, refetch } = useQuery({
    queryKey: ["getOptionDataAdmin", filterParams.status],
    queryFn: async () => {
      const res = await Learning.getOptionDataAdmin({
        status: 200,
      });
      return res?.data || [];
    },
  });

  // Xoá data
  const mutationDel = useMutation({
    mutationFn: Learning.deleteData,
    onSuccess: () => {
      message.success("Xoá thành công");
      refetch();
    },
  });

  // từ chối
  const mutationReject = useMutation({
    mutationFn: Learning.rejectData,
    onSuccess: () => {
      message.success("Từ chối thành công");
      setShowFeedback(false);
      form.resetFields();
      refetchPending();
    },
  });

  // Chấp nhận
  const mutationApprove = useMutation({
    mutationFn: Learning.approveData,
    onSuccess: () => {
      message.success("Xác nhận thành công");
      setShowFeedback(false);
      form.resetFields();
      refetchPending();
    },
  });

  const columns = [
    {
      title: "Từ vựng",
      dataIndex: "vocabularyContent",
      key: "vocabularyContent",
      sorter: (a: any, b: any) => a.vocab - b.vocab,
      width: "20%",
      render: (a: any) => <span style={{ fontWeight: 500 }}>{a}</span>,
    },
    {
      title: "Người đăng",
      dataIndex: "volunteerEmail",
      key: "volunteerEmail",
      width: "20%",
    },
    {
      title: "Ngày đăng",
      dataIndex: "createdDate",
      width: "20%",
      render: (text: string | number | Date) => (
        <span>
          {new Date(text).getHours()}:{new Date(text).getMinutes()}{" "}
          {new Date(text).getDate()}/{new Date(text).getMonth() + 1}/
          {new Date(text).getFullYear()}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: "15%",
      render: (status: number) =>
        status === 100 ? (
          <div style={{ display: "table" }}>
            <div style={{ display: "table-cell", verticalAlign: "top" }}>
              <div
                className="dot-status"
                style={{ border: `1px solid gray`, backgroundColor: "gray" }}
              ></div>
            </div>
            <div
              style={{ display: "table-cell", verticalAlign: "top" }}
              className="inline-block bg-yellow-200 px-2 text-yellow-900"
              data-tooltip="true"
            >
              Đang chờ xét duyệt
            </div>
          </div>
        ) : status === 300 ? (
          <div style={{ display: "table" }}>
            <div style={{ display: "table-cell", verticalAlign: "top" }}>
              <div
                className="dot-status"
                style={{ border: `1px solid red`, backgroundColor: "red" }}
              ></div>
            </div>
            <div
              style={{ display: "table-cell", verticalAlign: "top" }}
              className="inline-block bg-neutral-200 px-2 text-neutral-900"
              data-tooltip="true"
            >
              Từ chối
            </div>
          </div>
        ) : (
          <div style={{ display: "table" }}>
            <div style={{ display: "table-cell", verticalAlign: "top" }}>
              <div
                className="dot-status"
                style={{ border: `1px solid grean`, backgroundColor: "green" }}
              ></div>
            </div>
            <div
              style={{ display: "table-cell", verticalAlign: "top" }}
              className="inline-block bg-green-200 px-2 text-green-900"
              data-tooltip="true"
            >
              Đã xét duyệt
            </div>
          </div>
        ),
    },
    {
      title: "Đánh giá",
      dataIndex: "feedBack",
      render: (value: string) => (
        <Popover
          placement="topLeft"
          content={
            <CustomDivPopper
              className="col-span-2 "
              style={{ maxWidth: "560px" }}
            >
              {value}
            </CustomDivPopper>
          }
        >
          <CustomDiv style={{ maxWidth: "260px" }}>{value}</CustomDiv>
        </Popover>
      ),
      width: "25%",
    },
    {
      title: "Điểm",
      dataIndex: "score",
      key: "score",
      width: "10%",
    },
    {
      title: "Xem lại",
      dataIndex: "dataLocation",
      key: "dataLocation",
      width: 100,
      render: (text: string) => (
        <>
          <Button
            key={text}
            icon={<EyeOutlined style={{ fontSize: "1.25rem" }} />}
            onClick={() => {
              setPreviewFile({
                open: true,
                file: text,
              });
            }}
          >
            Xem lại
          </Button>
        </>
      ),
    },
    {
      title: "Hành động",
      dataIndex: "dataCollectionId",
      width: "10%",
      render: (value: any, record: any) => (
        <div className="flex space-x-2">
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => mutationDel.mutate(value)}
          />
        </div>
      ),
    },
  ];

  return (
    <Spin spinning={isFetchingPending}>
      <div className="flex flex-col items-center">
        <div className="mt-6 w-full max-w-full">
          <Tabs defaultActiveKey="pending">
            <Tabs.TabPane tab="Danh sách cần phê duyệt" key="pending">
              <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow-md">
                <h2 className="text-lg font-semibold">
                  Danh sách cần phê duyệt
                </h2>
                <div className="text-gray-500">
                  Số lượng yêu cầu: {listRequests?.length}
                </div>
              </div>

              {listRequests?.length ? (
                <div className="mt-4">
                  {listRequests.map((item: any, index: number) => (
                    <div key={index}>
                      <div className="py-1">
                        Thời gian gửi:{" "}
                        {moment(item.created).format("DD/MM/YYYY hh:mm:ss")}
                      </div>
                      <div
                        className="mt-2 flex items-center rounded-lg bg-white p-4 shadow-md hover:cursor-pointer hover:bg-neutral-200"
                        key={index}
                      >
                        <div className="mr-4">
                          <Avatar
                            icon={<UserOutlined />}
                            src={item.avatar}
                            alt=""
                            className="h-10 w-10 rounded-full"
                          />
                        </div>
                        <div>
                          <div className="font-semibold">
                            {item.volunteerEmail}
                          </div>
                          <div className="text-gray-600">
                            {item.vocabularyContent}
                          </div>
                        </div>
                        <div className="ml-auto flex gap-3">
                          <Button
                            type="primary"
                            className="rounded-md bg-blue-500 px-4  text-white"
                            onClick={() => {
                              setShowFeedback(true);
                              form.setFieldsValue({
                                dataCollectionId: item.dataCollectionId,
                                typeSelect: "approve",
                              });
                            }}
                          >
                            Đồng ý
                          </Button>
                          <Button
                            className="rounded-md  bg-gray-2 px-4"
                            onClick={() => {
                              setPreviewFile({
                                open: true,
                                file: item.dataLocation,
                              });
                            }}
                          >
                            Xem lại
                          </Button>
                          <Button
                            className="rounded-md bg-orange-200 px-4"
                            onClick={() => {
                              setShowFeedback(true);
                              form.setFieldsValue({
                                dataCollectionId: item.dataCollectionId,
                                typeSelect: "reject",
                              });
                            }}
                          >
                            Từ chối
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4">
                  <Empty description="Không có yêu cầu phê duyệt nào." />
                </div>
              )}
            </Tabs.TabPane>
            {/* <Tabs.TabPane tab="Danh sách đã phê duyệt" key="approved">
              <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow-md">
                <h2 className="text-lg font-semibold">
                  Danh sách đã phê duyệt
                </h2>
              </div>

              <CustomTable
                columns={columns}
                dataSource={allTableData}
                scroll={{ x: 1200 }}
              />
            </Tabs.TabPane> */}
          </Tabs>
        </div>

        {/* Modal xem lại */}
        <Modal
          open={previewFile.open}
          onCancel={() => setPreviewFile({ open: false, file: "" })}
          footer={null}
          width={800}
        >
          <div className="flex w-full items-center justify-center p-4">
            {previewFile && (
              <>
                {isImage(previewFile.file) ? (
                  <Image className="w-full" alt="" src={previewFile.file} />
                ) : (
                  <div className="w-full">
                    <video
                      key={previewFile.file}
                      controls
                      style={{ width: "100%", height: "auto" }}
                    >
                      <source src={previewFile.file} />
                    </video>
                  </div>
                )}
              </>
            )}
          </div>
        </Modal>

        {/* Modal đánh giá */}
        <Modal
          open={showFeedback}
          onCancel={() => {
            setShowFeedback(false);
            form.resetFields();
          }}
          maskClosable={false}
          onOk={() => {
            const body = form.getFieldsValue();
            if (typeSelect === "reject") {
              mutationReject.mutate(body);
            } else mutationApprove.mutate(body);
          }}
          okText="Xác nhận"
          cancelText="Huỷ"
          destroyOnClose
          width={600}
          closeIcon={null}
        >
          <Form form={form} layout="horizontal">
            <Form.Item name="dataCollectionId" hidden noStyle />
            <Form.Item name="typeSelect" hidden noStyle />

            <Form.Item
              label="Nhận xét"
              name="feedBack"
              required
              rules={[validateRequire("Nhận xét không được bỏ trống")]}
            >
              <Input.TextArea placeholder="Nhận xét" rows={4} />
            </Form.Item>
            <Form.Item
              label="Điểm"
              name="score"
              required
              rules={[validateRequire("Điểm không được bỏ trống")]}
            >
              <Select
                className="w-1/2"
                placeholder="Lựa chọn điểm đánh giá"
                options={[
                  { label: "1", value: 1 },
                  { label: "2", value: 2 },
                  { label: "3", value: 3 },
                  { label: "4", value: 4 },
                  { label: "5", value: 5 },
                  { label: "6", value: 6 },
                  { label: "7", value: 7 },
                  { label: "8", value: 8 },
                  { label: "9", value: 9 },
                  { label: "10", value: 10 },
                ]}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Spin>
  );
};

export default RequestPage;
