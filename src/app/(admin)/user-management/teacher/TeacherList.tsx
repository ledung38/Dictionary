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
import { CustomTable } from "../../learning-management/check-list/ExamList";
import { debounce } from "lodash";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import User from "@/model/User";

interface Teacher {
  name: string;
  classroomTeacher: any;
  classRoomId: number;
}

const TeacherList: React.FC = () => {
  const user: User = useSelector((state: RootState) => state.admin);

  const [form] = useForm();
  const [lstTeachers, setLstTeachers] = useState<Teacher[]>([]);
  const [filteredLstTeachers, setFilteredLstTeachers] = useState<Teacher[]>([]);
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

  // Fetching the list of students
  const { isFetching, refetch } = useQuery({
    queryKey: ["getListTeacher", searchText],
    queryFn: async () => {
      const res = await User.getAllAccount({
        roleCode: "TEACHER",
        name: searchText,
      });
      setLstTeachers(res.content);
      setFilteredLstTeachers(res.content);
      return res as Teacher[];
    },
  });

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

      setLstTeachers((prevLst) =>
        modalCreate.typeModal === "create"
          ? [...prevLst, updatedStudent]
          : prevLst.map((student) =>
              student.name === res.name ? updatedStudent : student,
            ),
      );
      setFilteredLstTeachers((prevLst) =>
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
      title: "Tên giáo viên",
      dataIndex: "name",
      key: "name",
      render: (value: string) => <div className="text-lg">{value}</div>,
      width: 200,
    },
    {
      title: "Lớp",
      dataIndex: "classroomTeacher",
      key: "classroomTeacher",
      render: (value: string, record: any) => (
        <div className="text-lg">{record?.classroomTeacher?.name}</div>
      ),
      width: 200,
    },
    {
      title: "Trường",
      dataIndex: "schoolName",
      key: "schoolName",
      render: (value: string) => <div className="text-lg">{value}</div>,
      width: 350,
    },
    // user?.role === "ADMIN"
    //   ? {
    //       title: "Hành động",
    //       key: "name",
    //       dataIndex: "name",
    //       render: (value: any, record: Teacher) => (
    //         <div className="flex space-x-2">
    //           <Button
    //             icon={<EditOutlined />}
    //             onClick={() => {
    //               form.setFieldsValue({
    //                 name: record.name,
    //                 classroom: record.classroomTeacher,
    //               });
    //               setModalCreate({
    //                 ...modalCreate,
    //                 open: true,
    //                 typeModal: "edit",
    //               });
    //             }}
    //           />
    //           {/* <Button
    //             icon={<DeleteOutlined />}
    //             danger
    //             onClick={() => mutationDel.mutate(value)}
    //           /> */}
    //         </div>
    //       ),
    //     }
    //   : null,
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
    [lstTeachers],
  );

  const isLoading = isFetching || mutationCreateUpdate.isPending;

  return (
    <div className="w-full p-4">
      <h1 className="mb-4 text-2xl font-bold">Danh sách giáo viên</h1>
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
          placeholder="Tìm kiếm tên giáo viên"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(e.currentTarget.value);
            }
          }}
        />
      </div>
      <CustomTable
        columns={columns as any}
        dataSource={filteredLstTeachers}
        loading={isLoading}
        pagination={{
          pageSize: pageSize,
          current: currentPage,
          onChange: handleTableChange,
          showSizeChanger: false,
          position: ["bottomCenter"],
        }}
      />
    </div>
  );
};

export default TeacherList;
