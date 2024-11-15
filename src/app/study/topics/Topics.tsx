"use client";
import { default as Learning } from "@/model/Learning";
import { RootState } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { Input, Select, Spin, Table, Modal, Image, Button, message } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Topic, User, Vocabulary } from "@/types";
import { useSearchParams, useRouter } from "next/navigation"; // Import useSearchParams and useRouter

export interface SectionHero2Props {
  className?: string;
}

const Topics: FC<SectionHero2Props> = ({ className = "" }) => {
  const user: User | null = useSelector((state: RootState) => state.admin);
  const searchParams = useSearchParams(); // Initialize useSearchParams
  const router = useRouter(); // Initialize useRouter
  const pageSize = 10;
  const [searchText, setSearchText] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string | undefined>(searchParams.get("className") || undefined); // Get initial class from query
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalPreview, setModalPreview] = useState<{
    open: boolean;
    file: string;
  }>({
    open: false,
    file: "",
  });
  const [vocabularyModal, setVocabularyModal] = useState<{
    open: boolean;
    topicId: number | null;
  }>({
    open: false,
    topicId: null,
  });

  // API lấy danh sách topics
  const { data: allTopics, isFetching } = useQuery({
    queryKey: ["getAllTopics"],
    queryFn: async () => {
      const res = await Learning.getAllTopics({
        isPrivate: "false",
      });
      return res.data as Topic[];
    },
    onError: (error) => {
      message.error("Failed to fetch topics");
      console.error("Error fetching topics:", error);
    },
  });

  // API lấy danh sách lớp
  const { data: allClasses } = useQuery({
    queryKey: ["getListClass"],
    queryFn: async () => {
      const res = await Learning.getListClass();
      return res.data.map((cls: { classRoomId: number; content: string; teacherName: string }) => ({
        value: cls.content, // Use class name as value
        label: cls.content,
        teacherName: cls.teacherName, // Include teacherName
      }));
    },
    onError: (error) => {
      message.error("Failed to fetch classes");
      console.error("Error fetching classes:", error);
    },
  });

  useEffect(() => {
    if (allTopics && allClasses) {
      let filtered = allTopics.map((topic) => {
        const classInfo = allClasses.find((cls) => cls.value === topic.classRoomContent);
        return {
          ...topic,
          teacherName: classInfo ? classInfo.teacherName : "",
        };
      });

      if (searchText) {
        filtered = filtered.filter((topic) =>
          topic.content.toLowerCase().includes(searchText.toLowerCase())
        );
      }
      if (selectedClass) {
        filtered = filtered.filter((topic) => topic.classRoomContent === selectedClass);
      }
      setFilteredTopics(
        filtered.sort((a, b) => (a.content || "").localeCompare(b.content || ""))
      );
    }
  }, [searchText, selectedClass, allTopics, allClasses]);

  const columns = [
    {
      title: "STT",
      key: "index",
      render: (_: any, __: any, index: number) =>
        (currentPage - 1) * pageSize + index + 1,
      width: 50,
    },
    {
      title: "Lớp",
      dataIndex: "classRoomContent",
      key: "classRoomContent",
      render: (value: string) => <div className="text-lg">{value}</div>,
    },
    {
      title: "Tên chủ đề",
      dataIndex: "content",
      key: "content",
      render: (value: string, record: Topic) => (
        <div
          className="text-lg cursor-pointer text-blue-500"
          onClick={() => setVocabularyModal({ open: true, topicId: record.topicId })} // Open vocabulary modal
        >
          {value}
        </div>
      ),

    },
    {
      title: "Minh họa",
      dataIndex: "imageLocation",
      key: "image",
      render: (text: string) => (
        <>
          {text ? (
            <EyeOutlined
              style={{ fontSize: "1.5rem", alignSelf: "center"}}
              onClick={() =>
                setModalPreview({
                  open: true,
                  file: text,
                })
              }
            />
          ) : (
            <div className="">Không có ảnh minh hoạ</div>
          )}
        </>
      ),
      width: 200,
    },
    {
      title: "Tên giáo viên",
      dataIndex: "teacherName",
      key: "teacherName",
      render: (value: string) => <div className="text-lg">{value}</div>,
    },
  ];

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
  };

  const { data: vocabularyList, isFetching: isFetchingVocabulary } = useQuery({
    queryKey: ["getVocabularyByTopic", vocabularyModal.topicId],
    queryFn: async () => {
      if (vocabularyModal.topicId === null) return [];
      const res = await Learning.getVocabularyByTopic(vocabularyModal.topicId);
      return res.data as Vocabulary[];
    },
    enabled: vocabularyModal.open,
    onError: (error) => {
      message.error("Failed to fetch vocabulary");
      console.error("Error fetching vocabulary:", error);
    },
  });

  const vocabularyColumns = [
    {
      title: "Từ vựng",
      dataIndex: "content",
      key: "content",
      render: (content: any, record: any) => (
        <span
          className="w-[200px] cursor-pointer truncate "
          style={{
            fontWeight: 500,
            color: "#1890ff",
            maxWidth: "200px",
          }}
        >
          {content}
        </span>
      ),
      ellipsis: true,
      width: 200,
    },
    {
      title: "Chủ đề",
      dataIndex: "topicContent",
      key: "topicContent",
      render: (content: string) => (
        <span style={{ fontWeight: 500 }}>{content}</span>
      ),
      ellipsis: true,
      width: 100,
    },
    {
      title: "Loại từ vựng",
      dataIndex: "vocabularyType",
      key: "vocabularyType",
      render: (content: string) => (
        <span style={{ fontWeight: 500 }}>
          {content === "WORD"
            ? "Từ"
            : content === "SENTENCE"
            ? "Câu"
            : content === "PARAGRAPH"
            ? "Đoạn"
            : content}
        </span>
      ),
      ellipsis: true,
      width: 100,
    },
    {
      title: "Ảnh minh hoạ",
      dataIndex: "imageLocation",
      key: "imageLocation",
      align: "center",
      render: (
        imageLocation: any,
        record: {
          vocabularyImageResList: string | any[];
          content: string | undefined;
        },
      ) => {
        if (
          record.vocabularyImageResList?.length &&
          record.vocabularyImageResList[0].imageLocation
        ) {
          return (
            <EyeOutlined
              style={{ fontSize: "1.5rem" }}
              onClick={() =>
                setModalPreview({
                  open: true,
                  file: record.vocabularyImageResList[0].imageLocation,
                  type: "image",
                })
              }
            />
          );
        } else {
          return <span>Không có minh họa</span>;
        }
      },
      width: 120,
    },
    {
      title: "Video minh hoạ",
      dataIndex: "videoLocation",
      key: "videoLocation",
      align: "center",
      render: (
        videoLocation: any,
        record: { vocabularyVideoResList: string | any[] },
      ) => {
        if (
          record.vocabularyVideoResList?.length &&
          record.vocabularyVideoResList[0].videoLocation
        ) {
          return (
            <EyeOutlined
              style={{ fontSize: "1.5rem" }}
              onClick={() =>
                setModalPreview({
                  open: true,
                  file: record.vocabularyVideoResList[0].videoLocation,
                  type: "video",
                })
              }
            />
          );
        } else {
          return <span>Không có video minh hoạ</span>;
        }
      },
      width: 200,
    },
  ];

  return (
    <Spin spinning={isFetching}>
      <h1 className="mb-4 text-2xl font-bold">Danh sách chủ đề</h1>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select
            style={{ width: 200 }}
            placeholder="Lọc theo lớp"
            allowClear
            options={allClasses}
            value={selectedClass} // Set the value of the Select component
            onChange={(value) => setSelectedClass(value)}
          />
          <Input
            allowClear
            style={{ width: 300 }}
            placeholder="Tìm kiếm chủ đề"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={filteredTopics}
        pagination={{
          pageSize: 10,
          current: currentPage,
          onChange: handleTableChange,
        }}
        rowKey="topicId"
      />

      <Modal
        visible={modalPreview.open}
        footer={null}
        onCancel={() => setModalPreview({ open: false, file: "" })}
      >
        <Image width="100%" src={modalPreview.file} />
      </Modal>

      <Modal
        visible={vocabularyModal.open}
        footer={null}
        onCancel={() => setVocabularyModal({ open: false, topicId: null })}
        width={1000}
      >
        <Spin spinning={isFetchingVocabulary}>
          <Table
            columns={vocabularyColumns}
            dataSource={vocabularyList}
            pagination={{
              pageSize: pageSize,
              current: currentPage,
              onChange: handleTableChange,
              showSizeChanger: false,
              position: ["bottomCenter"],
            }}
            onChange={handleTableChange}
            rowKey="vocabularyId"
          />
        </Spin>
      </Modal>
    </Spin>
  );
};

export default Topics;