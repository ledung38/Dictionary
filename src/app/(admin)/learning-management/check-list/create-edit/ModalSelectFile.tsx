import BasicDrawer from "@/components/UI/draw/BasicDraw";
import { isImage } from "@/components/common/constants";
import Learning from "@/model/Learning";
import { useQuery } from "@tanstack/react-query";
import {
  Collapse,
  Empty,
  Form,
  Image,
  Modal,
  Pagination,
  Radio,
  Select,
  Tooltip,
} from "antd";
import { isFunction } from "lodash";
import React, { ReactNode, useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 9;

// Danh sách các đuôi file ảnh
const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp"];

// Hàm kiểm tra đuôi file có thuộc danh sách ảnh hay không
export function isImageLocation(url: string | undefined) {
  for (let ext of imageExtensions) {
    if (url?.toLowerCase().endsWith(ext)) {
      return true;
    }
  }
  return false;
}

interface QuestionModalProps {
  openChooseVideo: boolean;
  setOpenChooseVideo: (value: boolean) => void;
  children: ReactNode;
  file?: any;
  onChange?: any;
}

const QuestionModal: React.FC<QuestionModalProps> = ({
  openChooseVideo,
  setOpenChooseVideo,
  children,
  file,
  onChange,
}) => {
  const [topicId, setTopicId] = useState<number | undefined>(undefined);

  const { data: allTopics, refetch } = useQuery({
    queryKey: ["getAllTopics"],
    queryFn: async () => {
      const res = await Learning.getAllTopics();
      return res?.data?.map((item: { topicId: any; content: any }) => ({
        id: item.topicId,
        value: item.topicId,
        label: item.content,
        text: item.content,
      }));
    },
  });

  // Lựa chọn hình ảnh/ hoặc video
  const [selectedFileType, setSelectedFileType] = useState<string | null>(
    "image",
  );
  const [currentPageImage, setCurrentPageImage] = useState(1);
  const [currentPageVideo, setCurrentPageVideo] = useState(1);

  const [selectedFile, setSelectedFile] = useState<string | null>(null); // Thêm state cho file đã chọn

  // Khi component nhận props file mới, cập nhật giá trị cho selectedFile
  useEffect(() => {
    setSelectedFile(file);
    setSelectedFileType(isImage(file) ? "image" : "video");
  }, [file]);

  // Thêm hàm xử lý khi người dùng chọn loại file từ Select
  const handleSelectFileType = (value: string) => {
    setSelectedFileType(value);
  };

  // API lấy danh sách từ vựng theo topic
  const { data: listVideoAndImage } = useQuery({
    queryKey: ["listVideo", topicId],
    queryFn: async () => {
      if (topicId) {
        const res = await Learning.getVocabularyTopic(topicId);
        return res.data;
      }
    },
    enabled: !!topicId && openChooseVideo,
  });

  // Làm dữ liệu hiển thị
  const flattenedDataImage = listVideoAndImage?.flatMap((item: any) => {
    const locationsImage: {
      type: number;
      location: string;
      content: string;
    }[] = [];

    if (item.vocabularyImageResList) {
      item.vocabularyImageResList.forEach((image: any) => {
        locationsImage.push({
          type: 1,
          location: image.imageLocation,
          content: image.vocabularyContent,
        });
      });
    }

    return locationsImage;
  });

  const flattenedDataVideo = listVideoAndImage?.flatMap((item: any) => {
    const locationsVideo: {
      type: number;
      location: string;
      content: string;
    }[] = [];

    if (item.vocabularyVideoResList) {
      item.vocabularyVideoResList.forEach((video: any) => {
        locationsVideo.push({
          type: 2,
          location: video.videoLocation,
          content: video.vocabularyContent,
        });
      });
    }

    return locationsVideo;
  });

  // Chia page
  useEffect(() => {
    const totalPagesVideo =
      flattenedDataVideo?.length > PAGE_SIZE
        ? Math.ceil(flattenedDataVideo.length / PAGE_SIZE)
        : 1;
    setCurrentPageVideo(Math.min(currentPageVideo, totalPagesVideo));
  }, [currentPageVideo, flattenedDataVideo]);

  useEffect(() => {
    const totalPagesImage =
      flattenedDataImage?.length > PAGE_SIZE
        ? Math.ceil(flattenedDataImage.length / PAGE_SIZE)
        : 1;
    setCurrentPageImage(Math.min(currentPageImage, totalPagesImage));
  }, [flattenedDataImage, currentPageImage]);

  // Thêm hàm để cập nhật giá trị khi người dùng chọn file
  const handleSelectFile = (value: string) => {
    setSelectedFile(value);
  };

  const items = [
    selectedFileType === "image"
      ? {
          key: "1",
          label: "Hình ảnh",
          children: (
            <>
              {flattenedDataImage?.length ? (
                <Radio.Group
                  className="grid grid-cols-3 gap-3 "
                  onChange={(e) => handleSelectFile(e.target.value)}
                  value={selectedFile}
                >
                  {flattenedDataImage
                    ?.slice(
                      (currentPageImage - 1) * PAGE_SIZE,
                      currentPageImage * PAGE_SIZE,
                    )
                    ?.map((item: any, i: any) => (
                      <Radio key={i} value={item.location} className="">
                        <div key={i}>
                          {item.type === 1 && (
                            <div className="w-full">
                              <Tooltip
                                placement="topLeft"
                                title={
                                  <div className=" text-xl font-semibold">
                                    {item.content}
                                  </div>
                                }
                              >
                                <div className="max-w-[200px] truncate text-xl font-semibold">
                                  {item.content}
                                </div>
                              </Tooltip>
                              <Image
                                preview={false}
                                src={item.location}
                                alt=""
                                style={{
                                  width: 200,
                                  height: 200,
                                  objectFit: "contain",
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </Radio>
                    ))}
                </Radio.Group>
              ) : (
                <Empty
                  style={{ width: "100%" }}
                  description={`Không có dữ liệu `}
                />
              )}
              {flattenedDataImage?.length > PAGE_SIZE && (
                <div className="mt-4 flex w-full justify-center">
                  <Pagination
                    current={currentPageImage}
                    pageSize={PAGE_SIZE}
                    total={flattenedDataImage?.length}
                    onChange={(pageNumber) => setCurrentPageImage(pageNumber)}
                    showSizeChanger={false}
                  />
                </div>
              )}
            </>
          ),
        }
      : null,
    selectedFileType === "video"
      ? {
          key: "2",
          label: "Video",
          children: (
            <>
              {flattenedDataVideo?.length ? (
                <Radio.Group
                  className="grid grid-cols-3 gap-3 "
                  onChange={(e) => handleSelectFile(e.target.value)}
                  value={selectedFile}
                >
                  {flattenedDataVideo
                    ?.slice(
                      (currentPageVideo - 1) * PAGE_SIZE,
                      currentPageVideo * PAGE_SIZE,
                    )
                    ?.map((item: any, i: any) => (
                      <Radio key={i} value={item.location} className="">
                        <div key={i}>
                          {item.type === 2 && (
                            <div className="">
                              <Tooltip
                                placement="topLeft"
                                title={
                                  <div className=" text-xl font-semibold">
                                    {item.content}
                                  </div>
                                }
                              >
                                <div className="max-w-[200px] truncate text-xl font-semibold">
                                  {item.content}
                                </div>
                              </Tooltip>

                              <video controls>
                                <source src={item.location} type="video/mp4" />
                              </video>
                            </div>
                          )}
                        </div>
                      </Radio>
                    ))}
                </Radio.Group>
              ) : (
                <Empty
                  style={{ width: "100%" }}
                  description={`Không có dữ liệu `}
                />
              )}
              {flattenedDataVideo?.length > PAGE_SIZE && (
                <div className="mt-4 flex w-full justify-center">
                  <Pagination
                    current={currentPageVideo}
                    pageSize={PAGE_SIZE}
                    total={flattenedDataVideo?.length}
                    onChange={(pageNumber) => setCurrentPageVideo(pageNumber)}
                    showSizeChanger={false}
                  />
                </div>
              )}
            </>
          ),
        }
      : null,
  ]?.filter((e) => e);

  return (
    <>
      <div className="">
        {children}
        <BasicDrawer
          open={openChooseVideo}
          onClose={() => {
            setOpenChooseVideo(false);
          }}
          width={800}
          title="Chọn hình ảnh/video theo chủ đề"
          onOk={() => {
            setOpenChooseVideo(false);
            isFunction(onChange) && onChange(selectedFile);
          }}
          destroyOnClose
        >
          <div className="">
            <div className="flex w-full items-center gap-4">
              <Select
                className="w-1/2"
                placeholder="Chọn chủ đề"
                value={topicId}
                options={allTopics}
                onChange={(e) => setTopicId(e)}
              />
              <Select
                className="w-1/2"
                placeholder="Chọn ảnh / video"
                value={selectedFileType}
                onChange={handleSelectFileType}
                defaultValue="image"
              >
                <Select.Option value="image">Chọn hình ảnh</Select.Option>
                <Select.Option value="video">Chọn video</Select.Option>
              </Select>
            </div>

            <Collapse
              className="mt-6"
              defaultActiveKey={["1", "2"]}
              items={items as any}
              bordered={false}
            />
          </div>
        </BasicDrawer>
      </div>
    </>
  );
};

export default QuestionModal;
