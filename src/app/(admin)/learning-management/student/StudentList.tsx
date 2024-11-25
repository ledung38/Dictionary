"use client";
import { CloseIcon } from "@/assets/icons";
import InputPrimary from "@/components/UI/Input/InputPrimary";
import BasicDrawer from "@/components/UI/draw/BasicDraw";
import Learning from "@/model/Learning";
import { validateRequireInput } from "@/utils/validation/validtor";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, Input, Select, message } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useCallback, useState } from "react";
import { CustomTable } from "../check-list/ExamList";
import { debounce } from "lodash";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import User from "@/model/User";

interface Student {
  name: string;
  classroom: any;
  classRoomId: number;
}

const StudentList: React.FC = () => {
  const user: User = useSelector((state: RootState) => state.admin);

  const [form] = useForm();
  const [lstStudents, setLstStudents] = useState<Student[]>([]);
  const [filteredLstStudents, setFilteredLstStudents] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const pageSize = 10;
  const [modalCreate, setModalCreate] = useState<{
    open: boolean;
    typeModal: string;
  }>({
    open: false,
    typeModal: "create",
  });

  const handleTableChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Fetching the list of classes
  const { data: allClasses, isFetching: isFetchingClasses } = useQuery({
    queryKey: ["getListClass"],
    queryFn: async () => {
      const res = await Learning.getListClass();
      return res.content.map((item: { classroom: string }) => ({
        label: item.classroom,
        value: item.classroom,
      }));
    },
  });

  // Fetching the list of students
  const { isFetching, refetch } = useQuery({
    queryKey: ["getListStudents", searchText],
    queryFn: async () => {
      const res = await User.getAllAccount({
        roleCode: "STUDENT",
        name: searchText,
      });
      setLstStudents(res.content);
      setFilteredLstStudents(res.content);
      return res as Student[];
    },
  });

  // Adding or editing a student
  const mutationCreateUpdate = useMutation({
    mutationFn:
      modalCreate.typeModal === "create"
        ? Learning.joinClass
        : Learning.leaveClass,
    onSuccess: (res, variables) => {
      refetch();

      const updatedStudent = {
        ...variables,
        studentName: res.studentName,
      };

      setLstStudents((prevLst) =>
        modalCreate.typeModal === "create"
          ? [...prevLst, updatedStudent]
          : prevLst.map((student) =>
              student.name === res.name ? updatedStudent : student,
            ),
      );
      setFilteredLstStudents((prevLst) =>
        modalCreate.typeModal === "create"
          ? [...prevLst, updatedStudent]
          : prevLst.map((student) =>
              student.name === res.name ? updatedStudent : student,
            ),
      );

      message.success(
        `${modalCreate.typeModal === "create" ? "Thêm mới học sinh thành công" : "Cập nhật học sinh thành công"}`,
      );

      setModalCreate({ ...modalCreate, open: false });
      form.resetFields();
    },
  });

  // Deleting a student
  // const mutationDel = useMutation({
  //   mutationFn: Learning.deleteStudent,
  //   onSuccess: () => {
  //     message.success("Xoá học sinh thành công");
  //     refetch();
  //   },
  //    */
  // });

  const columns = [
    {
      title: "STT",
      key: "index",
      render: (_: any, __: any, index: number) =>
        (currentPage - 1) * pageSize + index + 1,
      width: 50,
    },
    {
      title: "Tên học sinh",
      dataIndex: "name",
      key: "name",
      render: (value: string) => <div className="text-lg">{value}</div>,
      width: 200,
    },
    {
      title: "Lớp",
      dataIndex: "classroom",
      key: "classroom",
      render: (value: string) => <div className="text-lg">{value}</div>,
      width: 200,
    },
    user?.role === "ADMIN"
      ? {
          title: "Hành động",
          key: "name",
          dataIndex: "name",
          render: (value: any, record: Student) => (
            <div className="flex space-x-2">
              <Button
                icon={<EditOutlined />}
                onClick={() => {
                  form.setFieldsValue({
                    name: record.name,
                    classroom: record.classroom,
                  });
                  setModalCreate({
                    ...modalCreate,
                    open: true,
                    typeModal: "edit",
                  });
                }}
              />
              {/* <Button
                icon={<DeleteOutlined />}
                danger
                onClick={() => mutationDel.mutate(value)}
              /> */}
            </div>
          ),
        }
      : null,
  ]?.filter((item) => item);

  const handleSearch = useCallback(
    debounce((searchText: string) => {
      // if (searchText) {
      //   setFilteredLstStudents(
      //     lstStudents.filter((item: any) =>
      //       (item?.studentName ?? "")
      //         .toLowerCase()
      //         .includes(searchText.toLowerCase()),
      //     ),
      //   );
      // } else {
      //   setFilteredLstStudents(lstStudents);
      // }
      refetch();
    }, 300),
    [lstStudents],
  );

  const isLoading = isFetching || mutationCreateUpdate.isPending;

  return (
    <div className="w-full p-4">
      <h1 className="mb-4 text-2xl font-bold">Danh sách học sinh</h1>
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
          placeholder="Tìm kiếm tên học sinh"
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
        dataSource={filteredLstStudents}
        loading={isLoading}
        pagination={{
          pageSize: pageSize,
          current: currentPage,
          onChange: handleTableChange,
          showSizeChanger: false,
          position: ["bottomCenter"],
        }}
      />

      {/* Thêm học sinh */}
      <BasicDrawer
        width={460}
        title={
          modalCreate.typeModal === "create"
            ? "Thêm mới học sinh"
            : "Chỉnh sửa học sinh"
        }
        onClose={() => {
          setModalCreate({ ...modalCreate, open: false });
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
                setModalCreate({ ...modalCreate, open: false });
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
                studentName: value.studentName,
                classroom: value.classroom,
              });
            }}
          >
            <Form.Item
              name="studentName"
              label="Tên học sinh"
              className="mb-2"
              required
              rules={[validateRequireInput("Tên học sinh không được bỏ trống")]}
            >
              <Input placeholder="Nhập tên học sinh" />
            </Form.Item>
            <Form.Item
              name="classroom"
              label="Lớp"
              className="mb-2"
              required
              rules={[{ required: true, message: "Lớp không được bỏ trống" }]}
            >
              <Select options={allClasses} placeholder="Lựa chọn lớp" />
            </Form.Item>
          </Form>
        </div>
      </BasicDrawer>
    </div>
  );
};

export default StudentList;
