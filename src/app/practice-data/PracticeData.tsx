"use client";
import { filterOption } from "@/components/Dashboard/DashboardApp";
import ButtonSecondary from "@/components/UI/Button/ButtonSecondary";
import Learning from "@/model/Learning";
import UploadModel from "@/model/UploadModel";
import { WarningFilled } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Button,
  Image,
  Modal,
  Select,
  Spin,
  Tabs,
  Tooltip,
  message,
} from "antd";
import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ReactMediaRecorder } from "react-media-recorder-2";
import Webcam from "react-webcam";
import * as XLSX from "xlsx";
import { formatTime } from "../collect-data/CollectData";
import LearningData from "./LearningData";

const PracticeData: React.FC = () => {
  const [webcamReady, setWebcamReady] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showModalPreview, setShowModalPreview] = useState<{
    open: boolean;
    preview: string | undefined;
    type: string;
  }>({ open: false, preview: "", type: "" });
  const [showModalResult, setShowModalResult] = useState<boolean>(false);
  const webcamRef = useRef<Webcam>(null);
  const isRecordingRef = useRef(false);
  const maxRecordingTime = 5;
  // Kết quả sau khi xử lý AI
  const [resultContent, setResultContent] = useState<{
    content: string;
    fileLocation?: string;
  }>({
    content: "",
    fileLocation: "",
  });
  const startTimeRef = useRef<number | null>(null);
  const recordingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const recordingStatusRef = useRef<string>("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const checkButtonRef = useRef<HTMLButtonElement>(null);

  // Dữ liệu mẫu
  const [filterParams, setFilterParams] = useState<any>({
    topic: "",
    vocabulary: "",
    file: "",
    vocabularyName: "",
  });

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

  const videoRef = useRef<any>(null);

  const handleWebcamReady = useCallback(() => {
    setWebcamReady(true);
  }, []);

  // Đọc file excel
  const [dataExcel, setDataExcel] = useState<any>([]);
  const excelUrl =
    "https://res.cloudinary.com/dso3fp1fx/raw/upload/v1720014385/01_1-200_yttv3i.xlsx";

  // Đọc dữ liệu lưu file AI tử cloudinary
  useEffect(() => {
    async function fetchData() {
      try {
        // Tải tệp từ Cloudinary
        const response = await axios.get(excelUrl, {
          responseType: "arraybuffer",
        });

        // Đọc tệp Excel
        const data = new Uint8Array(response.data);
        const workbook = XLSX.read(data, { type: "array" });

        // Chuyển đổi dữ liệu
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        const transformedData = jsonData.map((item: any) => {
          const newItem = {
            ...item,
            id: item["__EMPTY"],
            word: item["Words"],
            link: item["Link Video"],
          };
          delete newItem["__EMPTY"];
          delete newItem["Words"];
          delete newItem["Link Video"];
          return newItem;
        });

        // Lưu dữ liệu vào state
        setDataExcel(transformedData);
      } catch (error) {
        console.error("Lỗi khi đọc tệp Excel:", error);
      }
    }

    fetchData();
  }, [excelUrl]);

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

  const handleStartRecording = useCallback(
    (startRecording: any, stopRecording: any) => {
      if (isRecordingRef.current) return;
      isRecordingRef.current = true;
      setRecordingTime(0);
      startTimeRef.current = null; // Sẽ được đặt khi status thực sự là "recording"
      startRecording();

      // Kiểm tra status và bắt đầu đếm thời gian
      const checkRecordingStatus = () => {
        if (recordingStatusRef.current === "recording") {
          if (!startTimeRef.current) {
            startTimeRef.current = Date.now();
          }

          intervalRef.current = setInterval(() => {
            const elapsedTime = Math.floor(
              (Date.now() - startTimeRef.current!) / 1000,
            );
            setRecordingTime(elapsedTime);

            if (elapsedTime >= maxRecordingTime) {
              handleStopRecording(stopRecording);
            }
          }, 1000);

          // Đặt timeout để dừng ghi sau maxRecordingTime
          recordingTimeoutRef.current = setTimeout(() => {
            handleStopRecording(stopRecording);
          }, maxRecordingTime * 1000);
        } else {
          // Nếu chưa ở trạng thái recording, kiểm tra lại sau 100ms
          setTimeout(checkRecordingStatus, 100);
        }
      };

      checkRecordingStatus();
    },
    [maxRecordingTime],
  );

  const handleStopRecording = useCallback(
    async (stopRecording: () => void) => {
      if (!isRecordingRef.current) return;

      isRecordingRef.current = false;
      stopRecording();

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current);
        recordingTimeoutRef.current = null;
      }

      startTimeRef.current = null;
      setRecordingTime(0);
      setShowModalPreview({
        ...showModalPreview,
        open: false,
        type: "video",
      });
      setTimeout(() => {
        if (checkButtonRef.current) {
          checkButtonRef.current.click();
        }
      }, 1000);
    },

    [showModalPreview],
  );

  const uploadVideo = async (mediaBlobUrl: any) => {
    const formData = new FormData();
    const response = await fetch(mediaBlobUrl);
    const blob: any = await response.blob();
    const metadata = { type: blob.type, lastModified: blob.lastModified };
    const file = new File([blob], `volunteer_${Date.now()}.mp4`, metadata);
    formData.append("file", file);
    return await UploadModel.uploadFile(formData);
  };

  // Kiểm tra AI
  const mutationDetectAI = useMutation({
    mutationFn: UploadModel.checkAI,
    onSuccess: async (res: any) => {
      // Nếu mà AI nhận diện đúng đẩy từ đó đi thành dữ liệu tnv
      const vocabularyName =
        typeof filterParams?.vocabularyName === "string"
          ? filterParams.vocabularyName.toLowerCase()
          : null;
      const content =
        typeof res?.data?.content === "string"
          ? res?.data?.content.toLowerCase()
          : null;
      if (content && vocabularyName && content === vocabularyName) {
        const body = {
          dataLocation: filterParams.file,
          vocabularyId: filterParams.vocabulary,
        };
        await Learning.sendData(body);
      }

      if (res?.data?.content) {
        setResultContent({
          content: res.data?.content,
          fileLocation: res?.data.fileLocation,
        });
        setShowModalResult(true);
        message.success("Xử lý dữ liệu thành công");
      } else {
        message.error("Không có từ nào đúng với nội dung cung cấp");
      }
    },
  });

  return (
    <>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Luyện tập từ vựng" key="1">
          <div className="relative flex h-[600px] items-start justify-between gap-4 overflow-hidden bg-gray-2">
            <div className="flex w-1/2 flex-col justify-start">
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
                  className="w-full"
                  allowClear
                  showSearch
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
                      setFilterParams({
                        ...filterParams,
                        vocabulary: value,
                        vocabularyName: option.label,
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
              </div>
              {/* Button lựa chọn hiển kiểu dữ liệu mẫu */}
              <div className="mt-4  flex items-center gap-2">
                <ButtonSecondary
                  onClick={() =>
                    setModalVideo({ ...modalVideo, type: "video" })
                  }
                  fontSize="text-sm"
                  sizeClass="px-3 py-2"
                  className="border border-neutral-400"
                >
                  Dữ liệu mẫu theo video
                </ButtonSecondary>
                <ButtonSecondary
                  onClick={() =>
                    setModalVideo({ ...modalVideo, type: "image" })
                  }
                  fontSize="text-sm"
                  sizeClass="px-3 py-2"
                  className="border border-neutral-400"
                >
                  Dữ liệu mẫu theo ảnh
                </ButtonSecondary>
              </div>
              {/* Dữ liệu mẫu */}
              <div className="mt-3 flex items-start justify-start ">
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
                    style={{ width: 800, maxHeight: 400 }}
                    className="flex items-start justify-start"
                  >
                    <source src={modalVideo.previewVideo} type="video/mp4" />
                  </video>
                )}
              </div>
            </div>
            <div className="w-1/2">
              {!webcamReady && (
                <div className="flex justify-center">
                  <Spin />
                </div>
              )}
              <div className="h-[80px]"></div>
              <Webcam
                className="scale-x-[-1] object-contain"
                width={600}
                height={400}
                ref={webcamRef}
                audio={false}
                onUserMedia={handleWebcamReady}
                style={{
                  filter: "FlipH",
                }}
              />
              <ReactMediaRecorder
                video={true}
                render={({
                  status,
                  startRecording,
                  stopRecording,
                  mediaBlobUrl,
                }) => {
                  recordingStatusRef.current = status;
                  return (
                    <div className="mt-3 object-contain">
                      <div className="flex gap-2">
                        <p>Trạng thái quay video: {status}</p>
                        <Button
                          className="flex items-center gap-3"
                          onClick={() => {
                            handleStartRecording(startRecording, stopRecording);
                          }}
                          disabled={
                            isRecordingRef.current ||
                            filterParams.vocabulary === ""
                          }
                          icon={
                            <Tooltip
                              title={`Thời gian tối đa cho mỗi video là ${maxRecordingTime}s.`}
                              placement="top"
                              trigger="hover"
                              color="#4096ff"
                            >
                              <WarningFilled style={{ color: "#4096ff" }} />
                            </Tooltip>
                          }
                        >
                          Bắt đầu quay
                          {isRecordingRef.current && (
                            <p
                              className="text-sm text-black"
                              style={{ color: "red" }}
                            >
                              {formatTime(Math.max(0, recordingTime))}
                            </p>
                          )}
                        </Button>
                        <Button
                          onClick={() => handleStopRecording(stopRecording)}
                          disabled={!isRecordingRef.current}
                        >
                          Dừng quay
                        </Button>
                        <Button
                          disabled={!mediaBlobUrl}
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
                      <div className="mt-3 flex w-full justify-center">
                        <Button
                          size="large"
                          type="primary"
                          disabled={!mediaBlobUrl}
                          loading={mutationDetectAI.isPending}
                          ref={checkButtonRef}
                          className="text-center"
                          onClick={async () => {
                            const link = await uploadVideo(mediaBlobUrl);
                            mutationDetectAI.mutate({ videoUrl: link });
                          }}
                        >
                          Kiểm tra
                        </Button>
                      </div>
                    </div>
                  );
                }}
              />
            </div>
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Luyện tập theo bảng chữ cái" key="2">
          <LearningData />
        </Tabs.TabPane>
      </Tabs>

      {/* Modal hiển thị kết quả */}
      <Modal
        open={showModalResult}
        onCancel={() => setShowModalResult(false)}
        footer={null}
        title="Kết quả"
        width={1200}
      >
        <div className="w-full ">
          <Spin spinning={mutationDetectAI.isPending}>
            <div className="mb-4 flex items-center justify-between gap-4 text-[60px] font-bold">
              <div className="w-1/2">
                <div className=" text-[20px]">Từ cần biểu diễn</div>
                <div className=" text-[24px] text-primary">
                  {modalVideo.vocabularyContent}
                </div>
              </div>
              <div className="w-1/2">
                <div className="w-1/2 text-[20px]">Từ nhận diện</div>
                <div className="text-[24px] text-primary">
                  {resultContent.content}
                </div>
              </div>
            </div>

            {resultContent.fileLocation && (
              <video
                width={800}
                controls
                src={resultContent.fileLocation}
              ></video>
            )}
          </Spin>
        </div>
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
        width={800}
      >
        <div className="flex justify-center">
          {showModalPreview.type === "video" ? (
            <video controls src={showModalPreview.preview}></video>
          ) : (
            <Image
              preview={false}
              src={showModalPreview.preview}
              alt="preview"
            />
          )}
        </div>
      </Modal>
    </>
  );
};

export default PracticeData;
