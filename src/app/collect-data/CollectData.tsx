"use client";
import { CallIcon } from "@/assets/icons";
import ButtonSecondary from "@/components/UI/Button/ButtonSecondary";
import Learning from "@/model/Learning";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  UploadOutlined,
  VideoCameraFilled,
  WarningFilled,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Button,
  Empty,
  Form,
  Image,
  Modal,
  Popover,
  Select,
  Spin,
  Table,
  Tooltip,
  message,
} from "antd";
import { ReactMediaRecorder } from "react-media-recorder-2";

import Webcam from "react-webcam";

import { isImage } from "@/components/common/constants";
import UploadModel from "@/model/UploadModel";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { filterOption } from "@/components/Dashboard/DashboardApp";
import { MediaUpload } from "@/components/UI/Upload/UploadFile";
import { validateRequire } from "@/utils/validation/validtor";

interface FilterParams {
  page: number;
  size: number;
  topic: string;
  vocabulary: string | null;
  ascending?: boolean;
  status: number;
  createdFrom: string;
  createdTo: string;
  score: number;
  dataCollectionId?: number;
}

const optionStatus = [
  {
    label: "Đang chờ phê duyệt",
    value: 100,
  },
  {
    label: "Đã phê duyệt",
    value: 200,
  },
  {
    label: "Từ chối",
    value: 300,
  },
];

const optionScore = [
  {
    label: "0",
    value: 0,
  },
  {
    label: "1",
    value: 1,
  },
  {
    label: "2",
    value: 2,
  },
  {
    label: "3",
    value: 3,
  },
  {
    label: "4",
    value: 4,
  },
  {
    label: "5",
    value: 5,
  },
  {
    label: "6",
    value: 6,
  },
  {
    label: "7",
    value: 7,
  },
  {
    label: "8",
    value: 8,
  },
  {
    label: "9",
    value: 9,
  },
  {
    label: "10",
    value: 10,
  },
];

export const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

function normalizeString(inputString: any) {
  let lowercasedString = inputString.toLowerCase();

  return lowercasedString;
}

export default function CollectData() {
  const [form] = Form.useForm();
  const [filterParams, setFilterParams] = useState<FilterParams>({
    page: 1,
    size: 999999,
    topic: "",
    vocabulary: "",
    ascending: true,
    status: 100,
    createdFrom: "",
    createdTo: "",
    score: 0,
    dataCollectionId: 0,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  //Modal
  const [showModalPreview, setShowModalPreview] = useState<{
    open: boolean;
    preview: string | undefined;
    type: string;
  }>({ open: false, preview: "", type: "" });

  const [modalVideo, setModalVideo] = useState<{
    open: boolean;
    previewImg: string;
    previewVideo: string;
    type: string;
    vocabularyContent?: string;
    typeModal?: string;
  }>({
    open: false,
    previewImg: "",
    previewVideo: "",
    type: "",
    vocabularyContent: "",
    typeModal: "create",
  });
  const [modalUpload, setModalUpload] = useState<boolean>(false);

  const videoRef = useRef<any>(null);
  const webcamRef = useRef<any>(null);
  const startRecordingRef = useRef<any>(null);
  const stopRecordingRef = useRef<any>(null);
  const recordingTimerIdRef = useRef<number | null>(null);
  // Quay video
  const [recordingTime, setRecordingTime] = useState(0);

  // API lấy danh sách  table
  const { data: allTableData, refetch } = useQuery({
    queryKey: ["getTableDataVolunteer", filterParams.status],
    queryFn: async () => {
      const res = await Learning.getTableDataVolunteer({
        status: filterParams.status,
      });
      return res?.data || [];
    },
  });

  // API lấy danh sách  topics
  const { data: allTopics } = useQuery({
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

  // API lấy danh sách từ theo topics
  const { data: allVocabulary, isFetching: isFetchingVocabulary } = useQuery({
    queryKey: ["getVocabularyTopic", filterParams.topic],
    queryFn: async () => {
      const res = await Learning.getVocabularyTopic(filterParams.topic);
      if (res?.data) {
        return res?.data?.map(
          (item: {
            vocabularyId: any;
            content: any;
            vocabularyImageResList: any;
            vocabularyVideoResList: any;
          }) => ({
            id: item.vocabularyId,
            value: item.vocabularyId,
            label: item.content,
            vocabularyImageResList: item.vocabularyImageResList,
            vocabularyVideoResList: item.vocabularyVideoResList,
          }),
        );
      }
      return [];
    },
    enabled: !!filterParams.topic,
  });

  // edit data
  const mutationEdit = useMutation({
    mutationFn: Learning.editData,
    onSuccess: () => {
      message.success("Cập nhật thành công");
      refetch();
    },
  });

  // Xoá data
  const mutationDel = useMutation({
    mutationFn: Learning.deleteData,
    onSuccess: () => {
      message.success("Xoá dữ liệu thành công");
      refetch();
    },
  });

  const columns = [
    {
      title: "Từ vựng",
      dataIndex: "vocabularyContent",
      width: "10%",
    },
    {
      title: "Ngày đăng",
      dataIndex: "createdDate",
      width: "20%",
      render: (text: string | number | Date) => (
        <span>
          {new Date(text).getHours()}:{new Date(text).getMinutes()}{" "}
          {new Date(text).getDate()}/{new Date(text).getMonth() + 1}/
          {new Date(text).getFullYear()}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: "20%",
      render: (status: number) =>
        status === 100 ? (
          <div style={{ display: "table" }}>
            <div style={{ display: "table-cell", verticalAlign: "top" }}>
              <div
                className="dot-status"
                style={{ border: `1px solid gray`, backgroundColor: "gray" }}
              ></div>
            </div>
            <div
              style={{ display: "table-cell", verticalAlign: "top" }}
              className="inline-block bg-yellow-200 px-2 text-yellow-900"
              data-tooltip="true"
            >
              Đang chờ xét duyệt
            </div>
          </div>
        ) : status === 300 ? (
          <div style={{ display: "table" }}>
            <div style={{ display: "table-cell", verticalAlign: "top" }}>
              <div
                className="dot-status"
                style={{ border: `1px solid red`, backgroundColor: "red" }}
              ></div>
            </div>
            <div
              style={{ display: "table-cell", verticalAlign: "top" }}
              className="inline-block bg-neutral-200 px-2 text-neutral-900"
              data-tooltip="true"
            >
              Từ chối
            </div>
          </div>
        ) : (
          <div style={{ display: "table" }}>
            <div style={{ display: "table-cell", verticalAlign: "top" }}>
              <div
                className="dot-status"
                style={{ border: `1px solid grean`, backgroundColor: "green" }}
              ></div>
            </div>
            <div
              style={{ display: "table-cell", verticalAlign: "top" }}
              className="inline-block bg-green-200 px-2 text-green-900"
              data-tooltip="true"
            >
              Đã xét duyệt
            </div>
          </div>
        ),
    },
    {
      title: "Điểm",
      dataIndex: "score",
      width: "10%",
      render: (value: any) => (
        <div className="">{value ? value : "Chưa có"}</div>
      ),
    },
    {
      title: "Đánh giá",
      dataIndex: "feedBack",
      render: (value: string) => (
        <Popover
          placement="topLeft"
          content={
            <CustomDivPopper
              className="col-span-2 "
              style={{ maxWidth: "560px" }}
            >
              {value}
            </CustomDivPopper>
          }
        >
          <CustomDiv style={{ maxWidth: "260px" }}>{value}</CustomDiv>
        </Popover>
      ),
      width: 300,
    },
    {
      title: "Xem lại",
      dataIndex: "dataLocation",
      key: "dataLocation",
      width: 100,
      render: (value: string) => (
        <>
          <Button
            key={value}
            icon={<EyeOutlined style={{ fontSize: "1.25rem" }} />}
            onClick={() => {
              setShowModalPreview({
                open: true,
                preview: value,
                type: isImage(value) ? "image" : "video",
              });
            }}
          >
            Xem lại
          </Button>
        </>
      ),
    },
    {
      title: "Hành động",
      dataIndex: "dataCollectionId",
      width: 100,
      render: (value: any, record: any) => (
        <div className="flex space-x-2">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setModalVideo({
                ...modalVideo,
                open: true,
                type: isImage(record.dataLocation) ? "image" : "video",
                previewImg: record.dataLocation,
                previewVideo: record.dataLocation,
                typeModal: "edit",
                vocabularyContent: record.vocabularyContent,
              });
              setFilterParams({
                ...filterParams,
                vocabulary: record.vocabularyId,
                dataCollectionId: value,
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

  // Bắt đầu quay
  const handleStartRecording = (startRecording: () => void) => {
    startRecording();
    const timerId = setInterval(() => {
      setRecordingTime((prevTime) => prevTime + 1);
    }, 1000);
    recordingTimerIdRef.current = timerId as any;
  };

  const handleStopRecording = (stopRecording: () => void) => {
    stopRecording();
    if (recordingTimerIdRef.current !== null) {
      clearInterval(recordingTimerIdRef.current);
      recordingTimerIdRef.current = null;
    }
    setRecordingTime(0);
    message.success("Video đã được lưu. Bạn có thể xem lại video");
    setShowModalPreview({
      ...showModalPreview,
      type: "video",
    });
  };

  // Tải file lên
  const convertToBlob = async (base64Data: string | URL | Request) => {
    const response = await fetch(base64Data);
    const blob: any = await response.blob();
    const metadata = { type: blob.type, lastModified: blob.lastModified };
    const file = new File([blob], `captured_image_${Date.now()}.jpg`, metadata);
    return file;
  };

  const handleDownload = async (file: any) => {
    try {
      setIsLoading(true);
      let link = "";

      if (showModalPreview.type === "image") {
        link = await uploadImage();
      } else {
        link = await uploadVideo(file);
      }

      if (link) {
        await handleAIProcessing(link);
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching and converting to file:", error);
      setIsLoading(false);
    }
  };

  const uploadImage = async () => {
    const formData = new FormData();
    const file = await convertToBlob(showModalPreview.preview as any);
    formData.append("file", file);
    return await UploadModel.uploadFile(formData);
  };

  const uploadVideo = async (link?: any) => {
    const formData = new FormData();
    const response = await fetch(link as any);
    const blob: any = await response.blob();
    const metadata = { type: blob.type, lastModified: blob.lastModified };
    const file = new File(
      [blob],
      `volunteer_${modalVideo.vocabularyContent}_${Date.now()}.mp4`,
      metadata,
    );
    formData.append("file", file);
    return await UploadModel.uploadFile(formData);
  };

  const handleAIProcessing = async (link: string) => {
    try {
      const data = { videoUrl: link };
      const response = await UploadModel.checkAI(data);

      const body = {
        dataLocation: link,
        vocabularyId: filterParams.vocabulary,
      };

      if (modalVideo.typeModal === "create") {
        await Learning.sendData(body);
      } else {
        mutationEdit.mutate({
          ...body,
          dataCollectionId: filterParams.dataCollectionId,
        });
      }

      validateAIResponse(response.data?.content);
    } catch (error) {
      console.error("Error processing AI response:", error);
    }
  };

  const validateAIResponse = (aiContent: string) => {
    if (
      aiContent &&
      normalizeString(aiContent) ===
        normalizeString(modalVideo.vocabularyContent)
    ) {
      message.success(
        `Thêm dữ liệu cho ${modalVideo.vocabularyContent} thành công.`,
      );
    } else if (aiContent) {
      message.error(
        `AI nhận diện dữ liệu không hợp lệ (là ${aiContent}), vui lòng thử lại.`,
      );
    } else {
      message.error(`AI nhận diện dữ liệu không hợp lệ`);
    }
    setModalVideo({ ...modalVideo, open: false });
    refetch();
  };

  // Xử lý khi ấn phím tắt
  useEffect(() => {
    if (filterParams.vocabulary) {
      const handleKeyDown = (event: any) => {
        if (event.key === "b" && startRecordingRef.current) {
          handleStartRecording(startRecordingRef.current);
        } else if (event.key === "d" && stopRecordingRef.current) {
          handleStopRecording(stopRecordingRef.current);
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [filterParams.vocabulary]);

  return (
    <div className="">
      {/* Heding */}
      <div className="mb-4 flex items-center gap-2 text-xl font-bold">
        <VideoCameraFilled /> Danh sách nội dung tình nguyện viên đăng tải
      </div>

      {/* filter */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Select
          className="w-full"
          allowClear
          value={filterParams.status}
          placeholder="Trạng thái"
          options={optionStatus}
          onChange={(e) => setFilterParams({ ...filterParams, status: e })}
        />
      </div>

      <div className="flex w-full items-center justify-end gap-4">
        <ButtonSecondary
          onClick={() => {
            setModalUpload(true);
            setModalVideo({
              ...modalVideo,
              open: false,
              previewImg: "",
              previewVideo: "",
              type: "",
            });
          }}
          className="mt-2 flex items-center justify-end  gap-2 border border-neutral-300  p-2"
        >
          <UploadOutlined /> Upload video
        </ButtonSecondary>
        <ButtonSecondary
          onClick={() =>
            setModalVideo({
              ...modalVideo,
              open: true,
              previewImg: "",
              previewVideo: "",
              type: "",
            })
          }
          className="mt-2 flex items-center justify-end  gap-2 border border-neutral-300  p-2"
        >
          <CallIcon /> Quay video
        </ButtonSecondary>
      </div>

      {/* Table */}
      <div className="mt-4 rounded-lg bg-white p-4">
        <Table
          dataSource={allTableData}
          columns={columns}
          locale={{ emptyText: <Empty description="Chưa có dữ liệu" /> }}
        />
      </div>

      {/* Modal quay video */}
      <Modal
        title="Quay video dành cho tình nguyện viên"
        open={modalVideo?.open}
        onCancel={() => {
          setModalVideo({ ...modalVideo, open: false });
          setShowModalPreview({
            ...showModalPreview,
            open: false,
            preview: "",
          });
          setFilterParams({
            page: 1,
            size: 999999,
            topic: "",
            vocabulary: "",
            ascending: true,
            status: 100,
            createdFrom: "",
            createdTo: "",
            score: 0,
          });
        }}
        width={1300}
        footer={null}
        destroyOnClose
      >
        <Spin spinning={isLoading}>
          <span className="ml-2 text-center text-base text-yellow-600">
            Lưu ý: Nhấn phím b để (bắt đầu quay), phim d (dừng quay)
          </span>
          <div className="flex items-start gap-3">
            {modalVideo.typeModal === "edit" ? (
              <div className="w-1/2">
                <div className="">
                  Dữ liệu đã quay trước đó cho từ{" "}
                  <span className="text-xl font-bold">
                    {modalVideo.vocabularyContent}
                  </span>
                </div>
                {/* Dữ liệu mẫu */}
                <div className="justify-s= mt-3 flex items-start ">
                  {modalVideo.type === "image" && modalVideo.previewImg && (
                    <Image
                      src={modalVideo.previewImg}
                      alt="Uploaded"
                      style={{ width: 400, height: 400 }}
                      className="flex items-start justify-start"
                    />
                  )}
                  {modalVideo.type === "video" && modalVideo.previewVideo && (
                    <video
                      ref={videoRef}
                      controls
                      style={{ width: 800 }}
                      className="flex items-start justify-start"
                    >
                      <source src={modalVideo.previewVideo} type="video/mp4" />
                    </video>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-1/2">
                <div className="mb-2 text-center text-xl font-semibold">
                  Dữ liệu mẫu
                </div>
                <div className="flex gap-4">
                  <Select
                    className="w-full"
                    allowClear
                    showSearch
                    placeholder="Chọn chủ đề"
                    options={allTopics}
                    onChange={(value, option: any) =>
                      setFilterParams({
                        ...filterParams,
                        topic: value,
                        vocabulary: null,
                      })
                    }
                    filterOption={filterOption}
                  />

                  <Select
                    showSearch
                    className="w-full"
                    allowClear
                    placeholder="Chọn từ vựng"
                    disabled={!filterParams.topic}
                    options={allVocabulary}
                    value={filterParams.vocabulary}
                    onChange={(value, option: any) => {
                      if (value) {
                        option?.vocabularyImageResList.sort(
                          (a: { primary: any }, b: { primary: any }) => {
                            // Sắp xếp sao cho phần tử có primary = true được đặt lên đầu
                            return a.primary === b.primary
                              ? 0
                              : a.primary
                                ? -1
                                : 1;
                          },
                        );
                        option?.vocabularyVideoResList.sort(
                          (a: { primary: any }, b: { primary: any }) => {
                            // Sắp xếp sao cho phần tử có primary = true được đặt lên đầu
                            return a.primary === b.primary
                              ? 0
                              : a.primary
                                ? -1
                                : 1;
                          },
                        );
                        setFilterParams({ ...filterParams, vocabulary: value });
                        setModalVideo((prevModalVideo) => ({
                          ...prevModalVideo,
                          previewImg:
                            option?.vocabularyImageResList[0]?.imageLocation,
                          previewVideo:
                            option?.vocabularyVideoResList[0]?.videoLocation,
                          vocabularyContent: option.label,
                        }));
                        if (videoRef.current) {
                          videoRef.current.load();
                          videoRef.current.play();
                        }
                      } else {
                        setModalVideo({
                          ...modalVideo,
                          previewImg: "",
                          previewVideo: "",
                        });
                        setFilterParams({ ...filterParams, vocabulary: "" });
                      }
                    }}
                    filterOption={filterOption}
                    loading={isFetchingVocabulary}
                    notFoundContent={
                      isFetchingVocabulary ? (
                        <Spin size="small" />
                      ) : (
                        "Không tìm thấy từ vựng"
                      )
                    }
                  />
                </div>
                {/* Button lựa chọn hiển kiểu dữ liệu mẫu */}
                <div className="mt-4  flex items-center gap-2">
                  <ButtonSecondary
                    onClick={() => {
                      if (modalVideo.previewVideo) {
                        setModalVideo({ ...modalVideo, type: "video" });
                      } else {
                        message.warning("Không có dữ liệu mẫu");
                      }
                    }}
                    fontSize="text-sm"
                    sizeClass="px-3 py-2"
                    className="border border-neutral-400"
                  >
                    Dữ liệu mẫu theo video
                  </ButtonSecondary>
                  <ButtonSecondary
                    onClick={() => {
                      if (modalVideo.previewImg) {
                        setModalVideo({ ...modalVideo, type: "image" });
                      } else {
                        message.warning("Không có dữ liệu mẫu");
                      }
                    }}
                    fontSize="text-sm"
                    sizeClass="px-3 py-2"
                    className="border border-neutral-400"
                  >
                    Dữ liệu mẫu theo ảnh
                  </ButtonSecondary>
                </div>
                {/* Dữ liệu mẫu */}
                <div className="justify-s= mt-3 flex items-start ">
                  {modalVideo.type === "image" && modalVideo.previewImg && (
                    <Image
                      src={modalVideo.previewImg}
                      alt="Uploaded"
                      style={{ width: 400, height: 400 }}
                      className="flex items-start justify-start"
                    />
                  )}
                  {modalVideo.type === "video" && modalVideo.previewVideo && (
                    <video
                      ref={videoRef}
                      controls
                      style={{ width: 800 }}
                      className="flex items-start justify-start"
                    >
                      <source src={modalVideo.previewVideo} type="video/mp4" />
                    </video>
                  )}
                </div>
              </div>
            )}

            <div className="w-1/2">
              <Webcam
                mirrored={true}
                style={{ width: "100%" }}
                audio={false}
                ref={webcamRef}
              />
              <div className="mt-3">
                <ReactMediaRecorder
                  video={true}
                  render={({
                    status,
                    startRecording,
                    stopRecording,
                    mediaBlobUrl,
                  }) => {
                    startRecordingRef.current = startRecording;
                    stopRecordingRef.current = stopRecording;

                    return (
                      <div>
                        <p>
                          Trạng thái quay video: {status}{" "}
                          {recordingTime !== 0 && (
                            <p style={{ color: "red" }}>
                              {formatTime(recordingTime)}
                            </p>
                          )}
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleStartRecording(startRecording)}
                            disabled={
                              status === "recording" || !filterParams.vocabulary
                            }
                            icon={
                              <Tooltip
                                title="Thời gian tối đa cho mỗi video là 5s."
                                placement="top"
                                trigger="hover"
                                color="#4096ff"
                              >
                                <WarningFilled style={{ color: "#4096ff" }} />
                              </Tooltip>
                            }
                          >
                            Bắt đầu quay{" "}
                          </Button>
                          <Button
                            onClick={() => handleStopRecording(stopRecording)}
                            disabled={status !== "recording"}
                          >
                            Dừng quay
                          </Button>
                          <Button
                            onClick={() => {
                              setShowModalPreview({
                                ...showModalPreview,
                                preview: webcamRef.current.getScreenshot(),
                                type: "image",
                              });
                              message.success("Chụp ảnh thành công");
                            }}
                          >
                            Chụp ảnh
                          </Button>
                          <Button onClick={() => handleDownload(mediaBlobUrl)}>
                            Tải lên
                          </Button>
                          <Button
                            disabled={
                              !mediaBlobUrl && !showModalPreview.preview
                            }
                            onClick={() => {
                              if (showModalPreview.type === "image") {
                                setShowModalPreview({
                                  ...showModalPreview,
                                  open: true,
                                });
                              } else {
                                setShowModalPreview({
                                  ...showModalPreview,
                                  open: true,
                                  preview: mediaBlobUrl,
                                });
                              }
                            }}
                          >
                            Xem lại file
                          </Button>
                        </div>
                      </div>
                    );
                  }}
                />
              </div>
            </div>
          </div>
        </Spin>
      </Modal>

      {/* Modal upload video */}
      <Modal
        open={modalUpload}
        title="Upload video dành cho tình nguyện viên"
        width={1000}
        footer={null}
        onCancel={() => {
          form.resetFields();
          setModalUpload(false);
          setShowModalPreview({
            ...showModalPreview,
            open: false,
            preview: "",
          });
          setFilterParams({
            page: 1,
            size: 999999,
            topic: "",
            vocabulary: "",
            ascending: true,
            status: 100,
            createdFrom: "",
            createdTo: "",
            score: 0,
          });
        }}
        destroyOnClose
      >
        <Spin spinning={isLoading}>
          <Form
            layout="vertical"
            form={form}
            onFinish={async (value) => {
              const body = {
                dataLocation: value.dataLocation,
                vocabularyId: value.vocabulary,
              };
              const res = await Learning.sendData(body);
              if (res.code === 200) {
                const data = { videoUrl: value.dataLocation };
                const response = await UploadModel.checkAI(data);
                validateAIResponse(response.data?.content);
              } else {
                message.success("Upload dữ liệu thất bại");
              }
              form.resetFields();
              refetch();
              setModalUpload(false);
            }}
          >
            <div className="flex items-start gap-3">
              <div className="w-1/2">
                <div className="mb-2 text-center text-xl font-semibold">
                  Dữ liệu mẫu
                </div>
                <div className="flex gap-4">
                  <Form.Item
                    className="w-full"
                    name="topicId"
                    required
                    rules={[validateRequire("Chủ đề không được bỏ trống")]}
                  >
                    <Select
                      className="w-full"
                      allowClear
                      showSearch
                      placeholder="Chọn chủ đề"
                      options={allTopics}
                      onChange={(value, option: any) =>
                        setFilterParams({
                          ...filterParams,
                          topic: value,
                          vocabulary: null,
                        })
                      }
                      filterOption={filterOption}
                    />
                  </Form.Item>

                  <Form.Item
                    className="w-full"
                    name="vocabulary"
                    required
                    rules={[validateRequire("Từ vựng không được bỏ trống")]}
                  >
                    <Select
                      showSearch
                      className="w-full"
                      allowClear
                      disabled={!filterParams.topic}
                      placeholder="Chọn từ vựng"
                      options={allVocabulary}
                      value={filterParams.vocabulary}
                      onChange={(value, option: any) => {
                        if (value) {
                          option?.vocabularyImageResList.sort(
                            (a: { primary: any }, b: { primary: any }) => {
                              // Sắp xếp sao cho phần tử có primary = true được đặt lên đầu
                              return a.primary === b.primary
                                ? 0
                                : a.primary
                                  ? -1
                                  : 1;
                            },
                          );
                          option?.vocabularyVideoResList.sort(
                            (a: { primary: any }, b: { primary: any }) => {
                              // Sắp xếp sao cho phần tử có primary = true được đặt lên đầu
                              return a.primary === b.primary
                                ? 0
                                : a.primary
                                  ? -1
                                  : 1;
                            },
                          );
                          setFilterParams({
                            ...filterParams,
                            vocabulary: value,
                          });
                          setModalVideo((prevModalVideo) => ({
                            ...prevModalVideo,
                            previewImg:
                              option?.vocabularyImageResList[0]?.imageLocation,
                            previewVideo:
                              option?.vocabularyVideoResList[0]?.videoLocation,
                            vocabularyContent: option.label,
                          }));
                          if (videoRef.current) {
                            videoRef.current.load();
                            videoRef.current.play();
                          }
                        } else {
                          setModalVideo({
                            ...modalVideo,
                            previewImg: "",
                            previewVideo: "",
                          });
                        }
                      }}
                      filterOption={filterOption}
                      loading={isFetchingVocabulary}
                      notFoundContent={
                        isFetchingVocabulary ? (
                          <Spin size="small" />
                        ) : (
                          "Không tìm thấy từ vựng"
                        )
                      }
                    />
                  </Form.Item>
                </div>
                {/* Button lựa chọn hiển kiểu dữ liệu mẫu */}
                <div className="mt-4  flex items-center gap-2">
                  <ButtonSecondary
                    onClick={() => {
                      if (modalVideo.previewVideo) {
                        setModalVideo({ ...modalVideo, type: "video" });
                      } else {
                        message.warning("Không có dữ liệu mẫu");
                      }
                    }}
                    fontSize="text-sm"
                    sizeClass="px-3 py-2"
                    className="border border-neutral-400"
                  >
                    Dữ liệu mẫu theo video
                  </ButtonSecondary>
                  <ButtonSecondary
                    onClick={() => {
                      if (modalVideo.previewImg) {
                        setModalVideo({ ...modalVideo, type: "image" });
                      } else {
                        message.warning("Không có dữ liệu mẫu");
                      }
                    }}
                    fontSize="text-sm"
                    sizeClass="px-3 py-2"
                    className="border border-neutral-400"
                  >
                    Dữ liệu mẫu theo ảnh
                  </ButtonSecondary>
                </div>
                {/* Dữ liệu mẫu */}
                <div className="justify-s= mt-3 flex items-start ">
                  {modalVideo.type === "image" && modalVideo.previewImg && (
                    <Image
                      src={modalVideo.previewImg}
                      alt="Uploaded"
                      style={{ width: 400, height: 400 }}
                      className="flex items-start justify-start"
                    />
                  )}
                  {modalVideo.type === "video" && modalVideo.previewVideo && (
                    <video
                      ref={videoRef}
                      controls
                      style={{ width: 800 }}
                      className="flex items-start justify-start"
                    >
                      <source src={modalVideo.previewVideo} type="video/mp4" />
                    </video>
                  )}
                </div>
              </div>

              <div className="w-1/2">
                <div className="h-[100px]"></div>
                <div className="item-center flex w-full justify-center">
                  <Form.Item
                    name="dataLocation"
                    label="Tải file lên"
                    required
                    rules={[validateRequire("File không được bỏ trống")]}
                  >
                    <MediaUpload uploadWidth={300} uploadHeight={300} />
                  </Form.Item>
                </div>
              </div>
            </div>
            <div className="mt-4 flex w-full justify-center">
              <Button className="" type="primary" htmlType="submit">
                Tải lên
              </Button>
            </div>
          </Form>
        </Spin>
      </Modal>

      {/* Modal xem lại */}
      <Modal
        open={showModalPreview.open}
        onCancel={() =>
          setShowModalPreview({ ...showModalPreview, open: false })
        }
        footer={null}
        title={
          showModalPreview.type === "image" ? "Xem lại ảnh: " : "Xem lại video"
        }
        zIndex={10000}
      >
        {!(showModalPreview.type === "image") ? (
          <div>
            <video key={showModalPreview.preview} controls width="100%">
              <source src={showModalPreview.preview} />
              video không hỗ trợ cho trình duyệt này.
            </video>
          </div>
        ) : (
          <div>
            <Image
              preview={false}
              src={showModalPreview.preview}
              alt="Captured"
            />
          </div>
        )}
      </Modal>
    </div>
  );
}

export const CustomDiv = styled.div`
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  line-height: 1.4em;
  max-height: calc(1.4em * 5);
  word-break: break-word;
`;
export const CustomDivPopper = styled.div`
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 12;
  line-height: 1.4em;
  max-height: calc(1.4em * 12);
  word-break: break-word;
`;
