"use client";
import { default as Learning } from "@/model/Learning";
import { RootState } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { Input, Table, message } from "antd";
import { FC, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { debounce } from "lodash";

interface Student {
  studentName: string;
  classRoomName: string;
}

const Students: FC = () => {
  const user: User = useSelector((state: RootState) => state.admin);

  const [lstStudents, setLstStudents] = useState<Student[]>([]);
  const [filteredLstStudents, setFilteredLstStudents] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const pageSize = 10;

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
  };

  // Fetching the list of students
  const { isFetching, refetch } = useQuery({
    queryKey: ["getListStudents"],
    queryFn: async () => {
      const res = await Learning.getListStudents();
      if (!res.data?.length) {
        message.warning("Không có học sinh nào");
        return [];
      }
      const sortedData = res.data.sort((a: Student, b: Student) =>
        a.studentName.localeCompare(b.studentName)
      );
      setLstStudents(sortedData);
      setFilteredLstStudents(sortedData);
      return sortedData as Student[];
    },
  });

  const handleSearch = useCallback(
    debounce((searchText: string) => {
      if (searchText) {
        setFilteredLstStudents(
          lstStudents.filter((item) =>
            item.studentName.toLowerCase().includes(searchText.toLowerCase())
          )
        );
      } else {
        setFilteredLstStudents(lstStudents);
      }
    }, 300),
    [lstStudents]
  );

  const isLoading = isFetching;

  return (
    <div className="w-full p-4">
      <h1 className="mb-4 text-2xl font-bold">Danh sách học sinh</h1>
      <div className="mb-4 flex items-center justify-between">
        <Input
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
      </div>
      <Table
        columns={[
          {
            title: "STT",
            key: "index",
            render: (_: any, __: any, index: number) =>
              (currentPage - 1) * pageSize + index + 1,
            width: 50,
          },
          {
            title: "Tên học sinh",
            dataIndex: "studentName",
            key: "studentName",
            render: (value: string) => <div className="text-lg">{value}</div>,
            width: 200,
          },
          {
            title: "Lớp",
            dataIndex: "classRoomName",
            key: "classRoomName",
            render: (value: string) => <div className="text-lg">{value}</div>,
            width: 200,
          },
        ]}
        dataSource={filteredLstStudents}
        loading={isLoading}
        pagination={{
          pageSize: pageSize,
          current: currentPage,
          onChange: handleTableChange,
          showSizeChanger: false,
          position: ["bottomCenter"],
        }}
        onChange={handleTableChange}
        rowClassName="student-row"
      />
      <style jsx>{`
        .student-row {
          background-color: #f9f9f9;
        }
        .student-row:hover {
          background-color: #e6f7ff;
        }
        .ant-table-thead > tr > th {
          background-color: #fafafa;
          font-weight: bold;
        }
        .ant-table-tbody > tr > td {
          padding: 16px;
        }
      `}</style>
    </div>
  );
};

export default Students;