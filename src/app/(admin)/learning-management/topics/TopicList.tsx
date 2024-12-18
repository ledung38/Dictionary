"use client";
import { CloseIcon } from "@/assets/icons";
import BasicDrawer from "@/components/UI/draw/BasicDraw";
import InputPrimary from "@/components/UI/Input/InputPrimary";
import Learning from "@/model/Learning";
import UploadModel from "@/model/UploadModel";
import { RootState } from "@/store";
import { GenerateUtils } from "@/utils/generate";
import { validateRequireInput } from "@/utils/validation/validtor";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Button,
  Form,
  Image,
  Input,
  message,
  Select,
  Table,
  Upload,
  UploadProps,
} from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface Topic {
  id: number;
  topicName?: string;
  name: string;
  imageLocation: string;
  videoLocation?: string;
  classroom: any;
}

const TopicList: React.FC<{ isPrivate: boolean }> = ({ isPrivate }) => {
  const user: User = useSelector((state: RootState) => state.admin);

  const [form] = Form.useForm();
  const [lstTopics, setLstTopics] = useState<Topic[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [modalCreate, setModalCreate] = useState({
    open: false,
    file: "",
    typeModal: "create",
    type: "topic",
    video: "",
  });
  const [filterParams, setFilterParams] = useState<any>({});
  const pageSize = 10;

  const handleTableChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const { data: allClass, isFetching: isFetchingClass } = useQuery({
    queryKey: ["getListClass"],
    queryFn: async () => {
      const res = await Learning.getListClass();
      return res.content.map((item: any) => ({
        label: item?.name,
        value: item?.id,
      }));
    },
  });

  const { isFetching, refetch } = useQuery({
    queryKey: ["getAllTopics", filterParams],
    queryFn: async () => {
      const res = await Learning.getAllTopics({
        ...filterParams,
        isCommon: `${!isPrivate}`,
      });
      setLstTopics(res.content);
      return res.content as Topic[];
    },
  });

  useEffect(() => {
    refetch();
  }, [filterParams]);

  const mutationCreateUpdate = useMutation({
    mutationFn:
      modalCreate.typeModal === "create"
        ? Learning.addTopics
        : Learning.editTopics,
    onSuccess: () => {
      message.success(
        `${modalCreate.typeModal === "create" ? "Thêm mới thành công" : "Cập nhật thành công"}`,
      );
      refetch();
      setModalCreate({ ...modalCreate, open: false, file: "" });
    },
    onError: (error: any) => {
      message.error(error?.data?.message);
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
    onError: (error: any) => {
      message.error(error?.data?.message);
    },
  });

  const columns = [
    {
      title: "STT",
      key: "index",
      render: (_: any, __: any, index: number) =>
        (currentPage - 1) * pageSize + index + 1,
      width: 50,
    },
    {
      title: "Tên chủ đề",
      dataIndex: "name",
      key: "name",
      render: (value: string) => <div className="text-lg">{value}</div>,
    },
    {
      title: "Minh họa",
      dataIndex: "imageLocation",
      key: "image",
      render: (text: string) => (
        <>
          {text ? (
            <Image src={GenerateUtils.genUrlImage(text)} alt="" />
          ) : (
            <div className="">Không có ảnh minh hoạ</div>
          )}
        </>
      ),
      width: 200,
    },
    {
      title: "Thuộc lớp",
      dataIndex: "classroom",
      key: "classroom",
      render: (value: any) => <div className="text-lg">{value?.name}</div>,
    },
    {
      title: "Hành động",
      key: "id",
      dataIndex: "id",
      render: (value: any, record: any) => (
        <div className="flex space-x-2">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              form.setFieldsValue({
                ...record,
                file: record.imageLocation,
                classroomId: record.classroomId,
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
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => mutationDel.mutate(value)}
          />
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

  console.log("form", form.getFieldsValue());
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
              setFilterParams({ name: e.target.value });
            }}
          />
          <Select
            style={{ width: 200 }}
            placeholder="Lọc theo lớp"
            options={allClass}
            onChange={(value) => {
              setFilterParams({ classroomId: value });
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
                name: value.name,
                imageLocation: value.file,
                videoLocation: value.video,
                classroomId: value.classroomId,
                creatorId: user.id,
                isCommon: `${!isPrivate}`,
                id: form.getFieldValue("id"),
              });
            }}
          >
            <Form.Item name="topicName" hidden />
            <Form.Item
              name="name"
              label="Tên chủ đề"
              className="mb-2"
              required
              rules={[validateRequireInput("Tên chủ đề không được bỏ trống")]}
            >
              <Input placeholder="Nhập tên chủ đề muốn thêm" />
            </Form.Item>
            <Form.Item
              name="classroomId"
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
                  src={GenerateUtils.genUrlImage(modalCreate.file)}
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
                <video key={modalCreate.video} controls style={{ width: 300 }}>
                  <source
                    src={GenerateUtils.genUrlImage(modalCreate.video)}
                    type="video/mp4"
                  />
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
