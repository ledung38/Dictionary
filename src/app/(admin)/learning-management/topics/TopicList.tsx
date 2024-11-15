"use client";
import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button, Form, Input, Select, Table, message, Upload, Image } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { CloseIcon } from "@/assets/icons";
import BasicDrawer from "@/components/UI/draw/BasicDraw";
import InputPrimary from "@/components/UI/Input/InputPrimary";
import Learning from "@/model/Learning";
import UploadModel from "@/model/UploadModel";
import { validateRequireInput } from "@/utils/validation/validtor";

interface Topic {
  topicName?: string;
  content: string;
  imageLocation: string;
  videoLocation?: string;
  classRoomContent: string;
}

const TopicList: React.FC<{ isPrivate: boolean }> = ({ isPrivate }) => {
  const [form] = Form.useForm();
  const [lstTopics, setLstTopics] = useState<Topic[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [modalCreate, setModalCreate] = useState({
    open: false,
    file: "",
    typeModal: "create",
    type: "topic",
  });
  const [filterParams, setFilterParams] = useState({ classRoomContent: "" });
  const pageSize = 10;

  const handleTableChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const { data: allClass, isFetching: isFetchingClass } = useQuery({
    queryKey: ["getListClass"],
    queryFn: async () => {
      const res = await Learning.getListClass();
      return res.data.map((item: { content: string }) => ({
        label: item.content,
        value: item.content,
      }));
    },
  });

  const { isFetching, refetch } = useQuery({
    queryKey: ["getAllTopics", filterParams],
    queryFn: async () => {
      const res = await Learning.getAllTopics({
        ...filterParams,
        isPrivate: `${isPrivate}`,
      });
      setLstTopics(res.data);
      return res.data as Topic[];
    },
  });

  useEffect(() => {
    refetch();
  }, [filterParams]);

  const mutationCreateUpdate = useMutation({
    mutationFn: modalCreate.typeModal === "create" ? Learning.addTopics : Learning.editTopics,
    onSuccess: () => {
      message.success(
        `${modalCreate.typeModal === "create" ? "Thêm mới thành công" : "Cập nhật thành công"}`
      );
      refetch();
      setModalCreate({ ...modalCreate, open: false, file: "" });
    },
    onError: () => {
      message.error("Đã có lỗi sảy ra. Vui lòng thử lại sau");
    },
  });

  const mutationDel = useMutation({
    mutationFn: Learning.deleteTopics,
    onSuccess: () => {
      message.success("Xoá chủ đề thành công");
      refetch();
    },
  });

  const uploadFileMutation = useMutation({
    mutationFn: UploadModel.uploadFile,
    onSuccess: (res: any) => {
      form.setFieldValue("file", res);
      setModalCreate({ ...modalCreate, file: res });
    },
    onError: () => {
      message.error("File đã được lưu trước đó");
    },
  });

  const columns = [
    {
      title: "STT",
      key: "index",
      render: (_: any, __: any, index: number) => (currentPage - 1) * pageSize + index + 1,
      width: 50,
    },
    {
      title: "Tên chủ đề",
      dataIndex: "content",
      key: "content",
      render: (value: string) => <div className="text-lg">{value}</div>,
    },
    {
      title: "Minh họa",
      dataIndex: "imageLocation",
      key: "image",
      render: (text: string) => (
        <>
          {text ? <Image src={text} alt="" /> : <div className="">Không có ảnh minh hoạ</div>}
        </>
      ),
      width: 200,
    },
    {
      title: "Thuộc lớp",
      dataIndex: "classRoomContent",
      key: "classRoomContent",
      render: (value: string) => <div className="text-lg">{value}</div>,
    },
    {
      title: "Hành động",
      key: "topicName",
      dataIndex: "topicName",
      render: (value: any, record: any) => (
        <div className="flex space-x-2">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              form.setFieldsValue({
                ...record,
                file: record.imageLocation,
                classRoomContent: record.classRoomContent,
              });
              setModalCreate({
                ...modalCreate,
                open: true,
                file: record.imageLocation,
                typeModal: "edit",
                type: "class",
              });
            }}
          />
          <Button icon={<DeleteOutlined />} danger onClick={() => mutationDel.mutate(value)} />
        </div>
      ),
    },
  ];

  const uploadProps: UploadProps = {
    name: "file",
    onChange(info) {
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    customRequest: ({ file }: { file: any }) => {
      const formData = new FormData();
      formData.append("file", file);
      uploadFileMutation.mutate(formData);
    },
    progress: {
      strokeColor: {
        "0%": "#108ee9",
        "100%": "#87d068",
      },
      strokeWidth: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
  };

  const isLoading = isFetching || mutationCreateUpdate.isPending;

  return (
    <div className="w-full p-4">
      <h1 className="mb-4 text-2xl font-bold">Danh sách chủ đề</h1>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <InputPrimary
            allowClear
            onClear={() => {
              refetch();
              setCurrentPage(1);
            }}
            style={{ width: 300 }}
            placeholder="Tìm kiếm chủ đề"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              if (e.target.value) {
                mutation.mutate({
                  page: 1,
                  size: pageSize,
                  search: e.target.value,
                });
              }
            }}
          />
          <Select
            style={{ width: 200 }}
            placeholder="Lọc theo lớp"
            options={allClass}
            onChange={(value) => {
              setFilterParams({ classRoomContent: value });
            }}
          />
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setModalCreate({ ...modalCreate, open: true, typeModal: "create" });
            form.resetFields();
          }}
        >
          Thêm mới
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={lstTopics}
        loading={isLoading}
        pagination={{
          pageSize: pageSize,
          current: currentPage,
          onChange: handleTableChange,
          showSizeChanger: false,
          position: ["bottomCenter"],
        }}
      />

      {/* Thêm chủ đề */}
      <BasicDrawer
        width={460}
        title={
          modalCreate.typeModal === "create"
            ? "Thêm mới chủ đề"
            : "Chỉnh sửa chủ đề"
        }
        onClose={() => {
          setModalCreate({ ...modalCreate, open: false, file: "" });
          form.resetFields();
        }}
        open={modalCreate.open}
        destroyOnClose
        onOk={() => {
          form.submit();
        }}
        maskClosable={false}
        extra={
          <div className="flex items-center gap-x-4">
            <Button
              className="hover:opacity-60 "
              onClick={() => {
                setModalCreate({ ...modalCreate, open: false, file: "" });
                form.resetFields();
              }}
              type="link"
              style={{ padding: 0 }}
            >
              <CloseIcon size={20} />
            </Button>
          </div>
        }
      >
        <div className="">
          <Form
            form={form}
            layout="vertical"
            onFinish={(value) => {
              mutationCreateUpdate.mutate({
                topicName: value.topicName,
                content: value.content,
                imageLocation: value.file,
                videoLocation: value.video,
                classRoomContent: value.classRoomContent,
              });
            }}
          >
            <Form.Item
              name="topicName"
              hidden
            />
            <Form.Item
              name="content"
              label="Tên chủ đề"
              className="mb-2"
              required
              rules={[validateRequireInput("Tên chủ đề không được bỏ trống")]}
            >
              <Input placeholder="Nhập tên chủ đề muốn thêm" />
            </Form.Item>
            <Form.Item
              name="classRoomContent"
              label="Thuộc lớp"
              className="mb-2"
              required
              rules={[{ required: true, message: "Lớp không được bỏ trống" }]}
            >
              <Select options={allClass} placeholder="Lựa chọn lớp" />
            </Form.Item>
            <Form.Item name="file" label="Ảnh">
              <Upload {...uploadProps} showUploadList={false}>
                <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
              </Upload>
            </Form.Item>
            <div className="flex w-full items-center justify-center">
              {modalCreate.file ? (
                <Image
                  className=""
                  src={modalCreate.file}
                  alt="Ảnh chủ đề"
                  style={{ width: 300 }}
                />
              ) : null}
            </div>
            <Form.Item name="video" label="Video">
              <Upload {...uploadProps} showUploadList={false}>
                <Button icon={<UploadOutlined />}>Tải video lên</Button>
              </Upload>
            </Form.Item>
            <div className="flex w-full items-center justify-center">
              {modalCreate.video ? (
                <video
                  key={modalCreate.video}
                  controls
                  style={{ width: 300 }}
                >
                  <source src={modalCreate.video} type="video/mp4" />
                </video>
              ) : null}
            </div>
          </Form>
        </div>
      </BasicDrawer>
    </div>
  );
};

export default TopicList;