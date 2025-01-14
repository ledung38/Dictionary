"use client";
import { RootState } from "@/store";
import { useQuery } from "@tanstack/react-query";
import {
  Spin,
  message,
  Table,
  Select,
  Input,
  Image,
  Modal,
  Button,
  Carousel,
} from "antd";
import { FC, useState, useCallback, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { debounce } from "lodash";
import {
  EyeOutlined,
  LeftOutlined,
  RightOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import Learning from "@/model/Learning";
import styled from "styled-components";
import ButtonPrimary from "@/components/UI/Button/ButtonPrimary";
import { GenerateUtils } from "@/utils/generate";
import User from "@/model/User";

const CustomSlider = styled(Carousel)`
  &.ant-carousel {
    width: 100%;
  }
  .slick-slide.slick-active.slick-current {
    display: flex;
    justify-content: center;
  }
`;

const TYPE_VOCABULARY = {
  WORD: "WORD",
  SENTENCE: "SENTENCE",
  PARAGRAPH: "PARAGRAPH",
};

export interface SectionHero2Props {
  className?: string;
}

const Vocabulary: FC<SectionHero2Props> = ({ className = "" }) => {
  const user: User = useSelector((state: RootState) => state.admin);

  //value search
  const [filterParams, setFilterParams] = useState<{
    topicId?: number;
    isPrivate?: boolean;
    vocabularyType?: string;
    content?: string;
  }>({});

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [modalPreview, setModalPreview] = useState<{
    open: boolean;
    file: string;
    type: "image" | "video";
  }>({
    open: false,
    file: "",
    type: "image",
  });

  const [vocabularyModal, setVocabularyModal] = useState<{
    open: boolean;
    vocabulary: any;
  }>({
    open: false,
    vocabulary: null,
  });

  const [fileIndex, setFileIndex] = useState(0);
  const slider = useRef<any>(null);
  const videoRef = useRef<any>(null);
  const [autoplayEnabled, setAutoplay] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videoCurrent, setVideoCurrent] = useState<any>();

  useEffect(() => {
    if (
      vocabularyModal.open &&
      vocabularyModal.vocabulary?.videosPath?.length
    ) {
      setAutoplay(true);
      setVideoCurrent(vocabularyModal.vocabulary?.videosPath[0]);
      setCurrentVideoIndex(0);
    }
  }, [vocabularyModal.open, vocabularyModal.vocabulary]);

  const handleNextVideo = () => {
    const nextIndex = currentVideoIndex + 1;
    if (nextIndex < vocabularyModal.vocabulary?.videosPath?.length) {
      setCurrentVideoIndex(nextIndex);
      setAutoplay(true);
      setVideoCurrent(vocabularyModal.vocabulary?.videosPath[nextIndex]);
    }
  };

  const handlePreviousVideo = () => {
    const previousIndex = currentVideoIndex - 1;
    if (previousIndex >= 0) {
      setCurrentVideoIndex(previousIndex);
      setAutoplay(true);
      setVideoCurrent(vocabularyModal.vocabulary?.videosPath[previousIndex]);
    }
  };

  const handleNext = () => {
    if (fileIndex < vocabularyModal.vocabulary.imagesPath.length - 1) {
      setFileIndex(fileIndex + 1);
    }
  };

  const handlePrev = () => {
    if (fileIndex > 0) {
      setFileIndex(fileIndex - 1);
    }
  };

  const handleTableChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const onCloseDetail = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setAutoplay(false);
    setVideoCurrent(null);
    setVocabularyModal({ open: false, vocabulary: null });
  };

  // API lấy danh sách topics
  const { data: allTopics } = useQuery({
    queryKey: ["getAllTopics"],
    queryFn: async () => {
      const res = await Learning.getAllTopics();
      return res?.content?.map((item: { id: any; name: any }) => ({
        id: item.id,
        value: item.id,
        label: item.name,
        text: item.name,
      }));
    },
  });

  // API lấy danh sách từ khi tìm kiếm
  const {
    data: allVocabulary,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["searchVocabulary", filterParams],
    queryFn: async () => {
      const res = await Learning.getAllVocabulary({
        ...filterParams,
        ...(user.role === "USER" ? { isPrivate: false } : {}),
      });
      if (!res?.content?.length) {
        message.warning("Không có kết quả tìm kiếm");
        return [];
      }
      // Sắp xếp priamry lên đầu
      res?.content?.forEach(
        (item: { imagesPath: any[]; videosPath: any[] }) => {
          item.imagesPath?.sort((a: { primary: any }, b: { primary: any }) => {
            // Sắp xếp sao cho phần tử có primary = true được đặt lên đầu
            return a.primary === b.primary ? 0 : a.primary ? -1 : 1;
          });
          item.videosPath?.sort((a: { primary: any }, b: { primary: any }) => {
            // Sắp xếp sao cho phần tử có primary = true được đặt lên đầu
            return a.primary === b.primary ? 0 : a.primary ? -1 : 1;
          });
        },
      );
      // Sort the vocabulary data alphabetically by content
      res.content.sort((a: { content: string }, b: { content: string }) => {
        return a.content.localeCompare(b.content);
      });
      return res.content;
    },
  });

  const columns = [
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
          onClick={() => {
            try {
              user?.id && User.viewVocabulary({ id: record.id });
              setVocabularyModal({ open: true, vocabulary: record });
            } catch (error: any) {
              message.error(error?.data?.message);
            }
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
      dataIndex: "topic",
      key: "topic",
      render: (content: any) => (
        <span style={{ fontWeight: 500 }}>{content?.name}</span>
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
          imagesPath: string | any[];
          content: string | undefined;
        },
      ) => {
        if (record.imagesPath?.length && record.imagesPath[0]) {
          return (
            <EyeOutlined
              style={{ fontSize: "1.5rem" }}
              onClick={() =>
                setModalPreview({
                  open: true,
                  file: record.imagesPath[0],
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
      dataIndex: "videosPath",
      key: "videosPath",
      align: "center",
      render: (videoLocation: any, record: { videosPath: string | any[] }) => {
        if (record.videosPath?.length && record.videosPath[0]) {
          return (
            <EyeOutlined
              style={{ fontSize: "1.5rem" }}
              onClick={() =>
                setModalPreview({
                  open: true,
                  file: record.videosPath[0],
                  type: "video",
                })
              }
            />
          );
        } else {
          return <span>Không video có minh họa</span>;
        }
      },
      width: 200,
    },
  ];

  const handleSearch = useCallback(
    debounce((searchText: string) => {
      setFilterParams({ ...filterParams, content: searchText });
    }, 300),
    [filterParams],
  );

  const isLoading = isFetching;

  return (
    <Spin spinning={isLoading}>
      <h1 className="mb-4 text-2xl font-bold">Danh sách từ điển học liệu</h1>
      <div className="mb-4 flex w-full gap-4">
        <Select
          placeholder="Chọn chủ đề"
          style={{ width: 200 }}
          options={allTopics}
          value={filterParams.topicId}
          onChange={(value) =>
            setFilterParams({ ...filterParams, topicId: value })
          }
        />
        <Select
          placeholder="Loại từ vựng"
          style={{ width: 200 }}
          onChange={(value) =>
            setFilterParams({ ...filterParams, vocabularyType: value })
          }
        >
          <Select.Option value="WORD">Từ</Select.Option>
          <Select.Option value="SENTENCE">Câu</Select.Option>
          <Select.Option value="PARAGRAPH">Đoạn</Select.Option>
        </Select>
        <Input
          placeholder="Nhập từ vựng"
          style={{ width: 400 }}
          value={filterParams?.content}
          onChange={(e) => {
            // setFilterParams({
            //   ...filterParams,
            //   name: e.target.value,
            // });
            handleSearch(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setFilterParams({
                ...filterParams,
                content: e.currentTarget.value,
              });
              handleSearch(e.currentTarget.value);
            }
          }}
          suffix={<SearchOutlined />}
        />
      </div>

      <Table
        columns={columns as any}
        dataSource={allVocabulary}
        loading={isLoading}
        pagination={{
          pageSize: pageSize,
          current: currentPage,
          onChange: handleTableChange,
          showSizeChanger: false,
          position: ["bottomCenter"],
        }}
      />

      <Modal
        visible={modalPreview.open}
        footer={null}
        onCancel={() =>
          setModalPreview({ open: false, file: "", type: "image" })
        }
      >
        {modalPreview.type === "image" ? (
          <Image
            width="100%"
            src={GenerateUtils.genUrlImage(modalPreview.file)}
          />
        ) : (
          <video width="100%" controls>
            <source
              src={GenerateUtils.genUrlImage(modalPreview.file)}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        )}
      </Modal>

      <Modal
        open={vocabularyModal.open}
        footer={null}
        onCancel={onCloseDetail}
        title={
          <>
            {vocabularyModal.vocabulary &&
            vocabularyModal.vocabulary.vocabularyType ===
              TYPE_VOCABULARY.WORD ? (
              <div className="line-clamp-1 text-[32px] font-bold">
                {vocabularyModal.vocabulary?.content}
              </div>
            ) : (
              <div>
                {vocabularyModal.vocabulary &&
                vocabularyModal.vocabulary.vocabularyType ===
                  TYPE_VOCABULARY.SENTENCE ? (
                  <div className="line-clamp-1 text-[32px] font-bold">
                    Học tập theo câu văn
                  </div>
                ) : (
                  <div className="line-clamp-1 text-[32px] font-bold">
                    Học tập theo đoạn văn
                  </div>
                )}
              </div>
            )}
          </>
        }
        width={1420}
        key={vocabularyModal.vocabulary?.content}
        centered
      >
        <div className="w-full px-4">
          <div className="w-full">
            <div className="grid grid-cols-3 items-center gap-3">
              <CustomSlider
                ref={slider}
                className="flex w-full items-center justify-center"
                dots={false}
              >
                {vocabularyModal.vocabulary?.imagesPath?.map(
                  (item: string, index: React.Key | null | undefined) => (
                    <div key={index}>
                      {item ? (
                        <div className="text-center">
                          <Image
                            preview={false}
                            src={GenerateUtils.genUrlImage(item)}
                            alt="imageLocation"
                            className="flex max-h-[400px] w-[400px] items-center justify-center object-scale-down"
                          />
                          {vocabularyModal.vocabulary && (
                            <>
                              <div
                                className="line-clamp-[10] w-[420px] overflow-y-auto text-left text-[18px]"
                                style={{
                                  display:
                                    vocabularyModal.vocabulary
                                      .vocabularyType !== TYPE_VOCABULARY.WORD
                                      ? "block"
                                      : "none",
                                }}
                              >
                                {vocabularyModal.vocabulary?.content}
                              </div>
                              {vocabularyModal.vocabulary?.note && (
                                <div className="mt-2">
                                  {vocabularyModal.vocabulary?.note}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="text-center text-xl">
                          Chưa có hình ảnh minh hoạ
                        </div>
                      )}
                    </div>
                  ),
                )}
              </CustomSlider>

              <div className="col-span-2">
                {videoCurrent ? (
                  <video
                    key={videoCurrent}
                    controls
                    ref={videoRef}
                    autoPlay={autoplayEnabled}
                    style={{ width: "100%", height: 550 }}
                    onEnded={() => setAutoplay(false)}
                  >
                    <source
                      src={GenerateUtils.genUrlImage(videoCurrent)}
                      type="video/mp4"
                    />
                  </video>
                ) : (
                  <div className="text-center text-xl">
                    Chưa có video minh hoạ
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between px-4">
          <div className="flex w-1/3 justify-center">
            <Button
              style={{
                display:
                  vocabularyModal.vocabulary?.imagesPath?.length < 2
                    ? "none"
                    : "block",
              }}
              icon={<LeftOutlined />}
              onClick={() => slider.current.prev()}
            />
            <Button
              style={{
                display:
                  vocabularyModal.vocabulary?.imagesPath?.length < 2
                    ? "none"
                    : "block",
              }}
              icon={<RightOutlined />}
              onClick={() => slider.current.next()}
            />
          </div>
          <div className="mt-4 flex w-2/3 justify-center">
            <Button
              style={{ display: currentVideoIndex === 0 ? "none" : "block" }}
              icon={<LeftOutlined />}
              onClick={handlePreviousVideo}
            />
            <Button
              style={{
                display:
                  currentVideoIndex ===
                  vocabularyModal.vocabulary?.videosPath?.length - 1
                    ? "none"
                    : "block",
              }}
              icon={<RightOutlined />}
              onClick={handleNextVideo}
            />
          </div>
        </div>
        <div className="mt-4 flex w-full justify-center gap-3">
          <ButtonPrimary disabled={fileIndex === 0} onClick={handlePrev}>
            Previous (Lùi lại)
          </ButtonPrimary>
          <ButtonPrimary
            disabled={fileIndex === allVocabulary?.length - 1}
            onClick={handleNext}
          >
            Next (Kế tiếp)
          </ButtonPrimary>
        </div>
      </Modal>
    </Spin>
  );
};

export default Vocabulary;
