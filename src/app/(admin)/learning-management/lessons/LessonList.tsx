"use client"
import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Select, Button, Form, Image, Input, Upload, UploadProps, message } from "antd";
import { useForm } from "antd/es/form/Form";
import { debounce } from "lodash";
import { RootState } from "@/store";
import { CloseIcon } from "@/assets/icons";
import InputPrimary from "@/components/UI/Input/InputPrimary";
import BasicDrawer from "@/components/UI/draw/BasicDraw";
import Learning from "@/model/Learning";
import UploadModel from "@/model/UploadModel";
import { validateRequireInput } from "@/utils/validation/validtor";
import { DeleteOutlined, EditOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { CustomTable } from "../check-list/ExamList";

interface Lesson {
  lessonName: string;
  topicName: string;
  imageLocation?: string;
  videoLocation?: string;
}

const LessonList: React.FC = () => {
  const user = useSelector((state: RootState) => state.admin);

  const [form] = useForm();
  const [lstLessons, setLstLessons] = useState<Lesson[]>([]);
  const [filteredLstLessons, setFilteredLstLessons] = useState<Lesson[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const pageSize = 10;
  const [modalCreate, setModalCreate] = useState({
    open: false,
    file: "",
    video: "",
    typeModal: "create",
  });

  const handleTableChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const { data: allTopics, isFetching: isFetchingTopics } = useQuery({
    queryKey: ["getAllTopics"],
    queryFn: async () => {
      const res = await Learning.getAllTopics({});
      return res.data.map((item: { content: string }) => ({
        label: item.content,
        value: item.content,
      }));
    },
  });

  const { isFetching, refetch } = useQuery({
    queryKey: ["getListLessons"],
    queryFn: async () => {
      const res = await Learning.getListLessons();
      setLstLessons(res.data);
      setFilteredLstLessons(res.data);
      return res.data as Lesson[];
    },
  });

  const mutationCreateUpdate = useMutation({
    mutationFn: modalCreate.typeModal === "create" ? Learning.createLesson : Learning.editLesson,
    onSuccess: (res, variables) => {
      const updatedLesson = {
        ...variables,
        lessonName: res.lessonName,
      };

      setLstLessons((prevLst) =>
        modalCreate.typeModal === "create"
          ? [...prevLst, updatedLesson]
          : prevLst.map((lesson) => (lesson.lessonName === res.lessonName ? updatedLesson : lesson))
      );
      setFilteredLstLessons((prevLst) =>
        modalCreate.typeModal === "create"
          ? [...prevLst, updatedLesson]
          : prevLst.map((lesson) => (lesson.lessonName === res.lessonName ? updatedLesson : lesson))
      );

      message.success(
        `${modalCreate.typeModal === "create" ? "Tạo mới thành công" : "Cập nhật thành công"}`
      );

      setModalCreate({ ...modalCreate, open: false, file: "", video: "" });
      form.resetFields();
    },
  });

  const mutationDel = useMutation({
    mutationFn: Learning.deleteLesson,
    onSuccess: () => {
      message.success("Xoá bài học thành công");
      refetch();
    },
  });

  const uploadFileMutation = useMutation({
    mutationFn: UploadModel.uploadFile,
    onSuccess: async (res: any) => {
      form.setFieldValue("file", res);
      setModalCreate({ ...modalCreate, file: res });
    },
    onError: (error: Error) => {
      console.error(error);
      message.error("File đã được lưu trước đó");
    },
  });

  const uploadVideoMutation = useMutation({
    mutationFn: UploadModel.uploadFile,
    onSuccess: async (res: any) => {
      form.setFieldValue("video", res);
      setModalCreate({ ...modalCreate, video: res });
    },
    onError: (error: Error) => {
      console.error(error);
      message.error("File đã được lưu trước đó");
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
      title: "Tên bài học",
      dataIndex: "lessonName",
      key: "lessonName",
      render: (value: string) => <div className="text-lg">{value}</div>,
      width: 200,
    },
    {
      title: "Chủ đề",
      dataIndex: "topicName",
      key: "topicName",
      render: (value: string) => <div className="text-lg">{value}</div>,
      width: 300,
    },
    user?.role === "ADMIN"
      ? {
          title: "Hành động",
          key: "lessonName",
          dataIndex: "lessonName",
          render: (value: any, record: Lesson) => (
            <div className="flex space-x-2">
              <Button
                icon={<EditOutlined />}
                onClick={() => {
                  form.setFieldsValue({
                    lessonName: record.lessonName,
                    topicName: record.topicName,
                    file: record.imageLocation,
                    video: record.videoLocation,
                  });
                  setModalCreate({
                    ...modalCreate,
                    open: true,
                    file: record.imageLocation,
                    video: record.videoLocation,
                    typeModal: "edit",
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
        }
      : null,
  ]?.filter((item) => item);

  const imageUploadProps: UploadProps = {
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

  const videoUploadProps: UploadProps = {
    name: "video",
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
      uploadVideoMutation.mutate(formData);
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

  const handleSearch = useCallback(
    debounce((searchText: string) => {
      if (searchText) {
        setFilteredLstLessons(
          lstLessons.filter((item: any) =>
            (item?.lessonName ?? "")
              .toLowerCase()
              .includes(searchText.toLowerCase()),
          ),
        );
      } else {
        setFilteredLstLessons(lstLessons);
      }
    }, 300),
    [lstLessons],
  );

  const isLoading = isFetching || mutationCreateUpdate.isPending;

  return (
    <div className="w-full p-4">
      <h1 className="mb-4 text-2xl font-bold">Danh sách bài học</h1>
      <div className="mb-4 flex items-center justify-between">
        <InputPrimary
          allowClear
          onClear={() => {
            refetch();
            setCurrentPage(1);
            setSearchText("");
          }}
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            handleSearch(e.target.value);
          }}
          className="mb-4"
          style={{ width: 400 }}
          placeholder="Tìm kiếm tên bài học"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(e.currentTarget.value);
            }
          }}
        />

        <Button
          hidden={!(user?.role === "ADMIN")}
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
      <CustomTable
        columns={columns as any}
        dataSource={filteredLstLessons}
        loading={isLoading}
        pagination={{
          pageSize: pageSize,
          current: currentPage,
          onChange: handleTableChange,
          showSizeChanger: false,
          position: ["bottomCenter"],
        }}
      />

      <BasicDrawer
        width={460}
        title={
          modalCreate.typeModal === "create"
            ? "Thêm mới bài học"
            : "Chỉnh sửa bài học"
        }
        onClose={() => {
          setModalCreate({ ...modalCreate, open: false, file: "", video: "" });
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
                setModalCreate({ ...modalCreate, open: false, file: "", video: "" });
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

                lessonName: value.lessonName,
                topicName: value.topicName,
                imageLocation: value.file,
                videoLocation: value.video,
              });
            }}
          >
            <Form.Item
              name="lessonName"
              label="Tên bài học"
              className="mb-2"
              required
              rules={[validateRequireInput("Tên bài học không được bỏ trống")]}
            >
              <Input placeholder="Nhập tên bài học muốn thêm" />
            </Form.Item>
            <Form.Item
              name="topicName"
              label="Chủ đề"
              className="mb-2"
              required
              rules={[{ required: true, message: "Chủ đề không được bỏ trống" }]}
            >
              <Select options={allTopics} placeholder="Lựa chọn chủ đề" />
            </Form.Item>
            <Form.Item name="file" label="Ảnh">
              <Upload {...imageUploadProps} showUploadList={false}>
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
              <Upload {...videoUploadProps} showUploadList={false}>
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

export default LessonList;