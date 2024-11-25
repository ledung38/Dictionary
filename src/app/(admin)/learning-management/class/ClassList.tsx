"use client";
import { CloseIcon } from "@/assets/icons";
import InputPrimary from "@/components/UI/Input/InputPrimary";
import BasicDrawer from "@/components/UI/draw/BasicDraw";
import Learning from "@/model/Learning";
import UploadModel from "@/model/UploadModel";
import { validateRequireInput } from "@/utils/validation/validtor";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Select,
  Button,
  Form,
  Image,
  Input,
  Upload,
  UploadProps,
  message,
} from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useCallback, useState } from "react";
import { CustomTable } from "../check-list/ExamList";
import { debounce } from "lodash";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { ClassLevel } from "@/utils/enum";
import User from "@/model/User";
import { GenerateUtils } from "@/utils/generate";

interface Class {
  id: number;
  name: string;
  teacher: {
    id: number;
    name: string;
  };
  thumbnailPath: string;
  videoLocation?: string;
  classLevel: ClassLevel;
  teacherId: number;
  teacherName: string;
  classCode: string;
}

const ClassList: React.FC = () => {
  const user: User = useSelector((state: RootState) => state.admin);

  const [form] = useForm();
  const [lstClass, setLstClass] = useState<Class[]>([]);
  const [filteredLstClass, setFilteredLstClass] = useState<Class[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [userList, setUserList] = useState<any[]>([]);

  const pageSize = 10;
  const [modalCreate, setModalCreate] = useState<{
    open: boolean;
    file: string;
    typeModal: string;
  }>({
    open: false,
    file: "",
    typeModal: "create",
  });

  const handleTableChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Fetching the list of teachers

  // API lấy danh sách lớp
  const { isFetching, refetch } = useQuery({
    queryKey: ["getListClass", searchText],
    queryFn: async ({ queryKey: [_, searchText] }) => {
      const res = await Learning.getListClass({
        name: searchText,
      });
      setLstClass(res.content);
      setFilteredLstClass(res.content);
      return res as Class[];
    },
  });

  // Thêm mới / chỉnh sửa lớp
  const mutationCreateUpdate = useMutation({
    mutationFn:
      modalCreate.typeModal === "create"
        ? Learning.createClass
        : Learning.editClass,
    onSuccess: (res, variables) => {
      refetch();

      const updatedClass = {
        ...variables,
        id: res.id,
        name: res.name,
      };

      setLstClass((prevLst) =>
        modalCreate.typeModal === "create"
          ? [...prevLst, updatedClass]
          : prevLst.map((cls) => (cls.name === res.name ? updatedClass : cls)),
      );
      setFilteredLstClass((prevLst) =>
        modalCreate.typeModal === "create"
          ? [...prevLst, updatedClass]
          : prevLst.map((cls) => (cls.name === res.name ? updatedClass : cls)),
      );

      message.success(
        `${modalCreate.typeModal === "create" ? "Thêm mới lớp học thành công" : "Cập nhật lớp học thành công"}`,
      );

      setModalCreate({ ...modalCreate, open: false, file: "" });
      form.resetFields();
    },
  });

  // Xoá lớp
  const mutationDel = useMutation({
    mutationFn: Learning.deleteClass,
    onSuccess: () => {
      message.success("Xoá lớp học thành công");
      refetch();
    },
  });

  // Upload file
  const uploadFileMutation = useMutation({
    mutationFn: UploadModel.image,
    onSuccess: async (res: any) => {
      form.setFieldValue("file", res);
      setModalCreate({ ...modalCreate, file: res });
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
      title: "Tên khối",
      dataIndex: "classLevel",
      key: "classLevel",
      render: (value: string) => <div className="text-lg">{value}</div>,
      width: 100,
    },
    {
      title: "Tên lớp học",
      dataIndex: "name",
      key: "name",
      render: (value: string) => <div className="text-lg">{value}</div>,
      width: 200,
    },
    {
      title: "Mã lớp",
      dataIndex: "classCode",
      key: "classCode",
      render: (value: string) => <div className="text-lg">{value}</div>,
      width: 100,
    },
    {
      title: "Tên giáo viên",
      dataIndex: "teacher",
      key: "teacher",
      render: (value: any) => <div className="text-lg">{value?.name}</div>,
      width: 300,
    },
    (user?.role === "ADMIN" || user?.role === "TEACHER") && {
      title: "Hành động",
      key: "actions",
      dataIndex: "classRoomName",
      render: (value: any, record: Class) => (
        <div className="flex space-x-2">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              form.setFieldsValue({
                name: record.name,
                teacherName: record.teacher.name,
                file: record.thumbnailPath,
                classLevel: record.classLevel,
                teacherId: record.teacherId,
                id: record.id,
                classCode: record.classCode,
              });
              setModalCreate({
                ...modalCreate,
                open: true,
                file: record.thumbnailPath,
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
    },
  ].filter(Boolean);

  const props: UploadProps = {
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

  const handleSearch = useCallback(
    debounce((searchText: string) => {
      // if (searchText) {
      //   // setFilteredLstClass(
      //   //   lstClass.filter((item: any) =>
      //   //     (item?.content ?? "")
      //   //       .toLowerCase()
      //   //       .includes(searchText.toLowerCase()),
      //   //   ),
      //   // );
      // } else {
      //   setFilteredLstClass(lstClass);
      // }
      refetch();
    }, 300),
    [lstClass],
  );

  const isLoading = isFetching || mutationCreateUpdate.isPending;

  const handleOnchangeTeacher = async (e: any) => {
    const response = await User.getAllAccount({
      roleCode: "TEACHER",
      name: e,
    });
    setUserList(response.content.map((item: any) => item));
  };

  return (
    <div className="w-full p-4">
      <h1 className="mb-4 text-2xl font-bold">Danh sách lớp học</h1>
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
          placeholder="Tìm kiếm tên lớp học"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(e.currentTarget.value);
            }
          }}
        />

        <Button
          hidden={!(user?.role === "ADMIN" || user?.role === "TEACHER")}
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
        dataSource={filteredLstClass}
        loading={isLoading}
        pagination={{
          pageSize: pageSize,
          current: currentPage,
          onChange: handleTableChange,
          showSizeChanger: false,
          position: ["bottomCenter"],
        }}
      />

      {/* Thêm lớp */}
      <BasicDrawer
        width={460}
        title={
          modalCreate.typeModal === "create"
            ? "Thêm mới lớp học"
            : "Chỉnh sửa lớp học"
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
                classLevel: value.classLevel,
                teacherId: form.getFieldValue("teacherId"),
                name: value.name,
                thumbnailPath: value.file,
                id: form.getFieldValue("id"),
                classCode: value.classCode,
              });
            }}
          >
            {(user?.role === "ADMIN" || user?.role === "TEACHER") && (
              <Form.Item
                name="classLevel"
                label="Tên khối"
                className="mb-2"
                required
                rules={[
                  { required: true, message: "Tên khối không được bỏ trống" },
                ]}
              >
                <Select
                  size="small"
                  placeholder="Chọn lớp"
                  style={{
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "8px",
                  }}
                  options={[
                    {
                      label: "Lớp 1",
                      value: ClassLevel.CLASS_LEVEL_1,
                    },
                    {
                      label: "Lớp 2",
                      value: ClassLevel.CLASS_LEVEL_2,
                    },
                    {
                      label: "Lớp 3",
                      value: ClassLevel.CLASS_LEVEL_3,
                    },
                    {
                      label: "Lớp 4",
                      value: ClassLevel.CLASS_LEVEL_4,
                    },
                    {
                      label: "Lớp 5",
                      value: ClassLevel.CLASS_LEVEL_5,
                    },
                  ]}
                />
              </Form.Item>
            )}

            <Form.Item
              name="name"
              label="Tên lớp học"
              className="mb-2"
              required
              rules={[validateRequireInput("Tên lớp học không được bỏ trống")]}
            >
              <Input placeholder="Nhập tên lớp học muốn thêm" />
            </Form.Item>
            <Form.Item
              name="classCode"
              label="Mã lớp"
              className="mb-2"
              required
              rules={[
                { required: true, message: "Mã lớp không được bỏ trống" },
              ]}
            >
              <Input type="text" placeholder="Nhập mã lớp" />
            </Form.Item>
            {user?.role === "ADMIN" && (
              <Form.Item
                label="Tên giáo viên"
                className="mb-2"
                required
                rules={[
                  validateRequireInput("Tên giáo viên không được bỏ trống"),
                ]}
              >
                <Input
                  placeholder="Nhập tên giáo viên"
                  value={
                    form.getFieldValue("teacherId") &&
                    `${form.getFieldValue("teacherName")} - ${form.getFieldValue("teacherId")}`
                  }
                  onChange={(e) => handleOnchangeTeacher(e.target.value)}
                />
                {userList.length > 0 && (
                  <ul className="border-gray-300 absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border bg-white shadow-lg">
                    {userList.map((item, index) => (
                      <li
                        key={index}
                        className="cursor-pointer px-4 py-2 hover:bg-blue-100"
                        onClick={() => {
                          console.log(item);
                          form.setFieldValue("teacherId", item.id);
                          form.setFieldValue("teacherName", item.name);
                          setUserList([]);
                        }}
                      >
                        {item.name}
                      </li>
                    ))}
                  </ul>
                )}
              </Form.Item>
            )}
            <Form.Item name="file" label="Ảnh">
              <Upload {...props} showUploadList={false}>
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
          </Form>
        </div>
      </BasicDrawer>
    </div>
  );
};

export default ClassList;
