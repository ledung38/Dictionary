import BasicDrawer from "@/components/UI/draw/BasicDraw";
import Learning from "@/model/Learning";
import MediaModel from "@/model/MediaModel";
import UploadModel from "@/model/UploadModel";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Button,
  Image,
  Modal,
  Popconfirm,
  Popover,
  Switch,
  Table,
  Upload,
  message,
} from "antd";
import React, { useEffect, useReducer, useState } from "react";
import ModalAddMedia from "./ModalAddMedia";
import { TYPE_VOCABULARY } from "../VocabularyList";

interface ModalListMediaProps {
  showModalLstMedia: boolean;
  record: any;
  refetch: () => void;
  onClose?: any;
}

interface DetailVocabulary {
  vocabularyId: number;
  vocabularyImageResList: any[];
  vocabularyVideoResList: any[];
}

interface State {
  openPreviewVideo: boolean;
  itemVocabulary: any;
  isShowModalUpdateMedia: boolean;
  recordUpdated: any;
  fileUrlImage: string;
  fileUrlVideo: string;
  imageLocations: string | undefined;
  videoLocations: string | undefined;
  primaryMedia: boolean | undefined;
}

type Action =
  | { type: "SET_OPEN_PREVIEW_VIDEO"; payload: boolean }
  | { type: "SET_ITEM_VOCABULARY"; payload: any }
  | { type: "SET_IS_SHOW_MODAL_UPDATE_MEDIA"; payload: boolean }
  | { type: "SET_RECORD_UPDATED"; payload: any }
  | { type: "SET_FILE_URL_IMAGE"; payload: string }
  | { type: "SET_FILE_URL_VIDEO"; payload: string }
  | { type: "SET_IMAGE_LOCATIONS"; payload: string | undefined }
  | { type: "SET_VIDEO_LOCATIONS"; payload: string | undefined }
  | { type: "SET_PRIMARY_MEDIA"; payload: boolean | undefined };

const initialState: State = {
  openPreviewVideo: false,
  itemVocabulary: undefined,
  isShowModalUpdateMedia: false,
  recordUpdated: undefined,
  fileUrlImage: "",
  fileUrlVideo: "",
  imageLocations: undefined,
  videoLocations: undefined,
  primaryMedia: undefined,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_OPEN_PREVIEW_VIDEO":
      return { ...state, openPreviewVideo: action.payload };
    case "SET_ITEM_VOCABULARY":
      return { ...state, itemVocabulary: action.payload };
    case "SET_IS_SHOW_MODAL_UPDATE_MEDIA":
      return { ...state, isShowModalUpdateMedia: action.payload };
    case "SET_RECORD_UPDATED":
      return { ...state, recordUpdated: action.payload };
    case "SET_FILE_URL_IMAGE":
      return { ...state, fileUrlImage: action.payload };
    case "SET_FILE_URL_VIDEO":
      return { ...state, fileUrlVideo: action.payload };
    case "SET_IMAGE_LOCATIONS":
      return { ...state, imageLocations: action.payload };
    case "SET_VIDEO_LOCATIONS":
      return { ...state, videoLocations: action.payload };
    case "SET_PRIMARY_MEDIA":
      return { ...state, primaryMedia: action.payload };
    default:
      return state;
  }
}

const ModalListMedia: React.FC<ModalListMediaProps> = ({
  showModalLstMedia,
  record,
  refetch,
  onClose,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Modal thêm media
  const [modalAddMedia, setModalAddMedia] = useState<{
    open: boolean;
    record: any;
  }>({ open: false, record: "" });

  useEffect(() => {
    if (state.recordUpdated) {
      dispatch({
        type: "SET_PRIMARY_MEDIA",
        payload: state.recordUpdated?.primary,
      });
    }
  }, [state.recordUpdated]);

  const {
    data: detailVocabulary,
    isFetching,
    refetch: refetchDetail,
  } = useQuery<DetailVocabulary>({
    queryKey: ["getDetailVocabulary", record?.vocabularyId],
    queryFn: async () => {
      const res = await Learning.getDetailVocabularyById(record?.vocabularyId);
      return res.data;
    },
    enabled: !!showModalLstMedia,
  });

  const mutationSetPrimaryVideo = useMutation({
    mutationFn: async (data: any) =>
      await MediaModel.setPrimaryVideoVocabulary(data),
    onSuccess: () => {
      message.success("Cập nhật video hiển thị chính thành công");
      refetchDetail();
      refetch();
    },
  });

  const mutationSetPrimaryImage = useMutation({
    mutationFn: async (data: any) =>
      await MediaModel.setPrimaryImageVocabulary(data),
    onSuccess: () => {
      message.success("Cập nhật hình ảnh hiển thị chính thành công");
      refetchDetail();
      refetch();
    },
  });

  const mutationUpdateImage = useMutation({
    mutationFn: async (body: any) =>
      await MediaModel.updateImageVocabulary(body),
    onSuccess: () => {
      message.success("Cập nhật hình ảnh minh hoạ thành công");
      refetchDetail();
      dispatch({ type: "SET_IS_SHOW_MODAL_UPDATE_MEDIA", payload: false });
      refetch();
    },
  });

  const mutationUpdateVideo = useMutation({
    mutationFn: async (body: any) =>
      await MediaModel.updateVideoVocabulary(body),
    onSuccess: () => {
      message.success("Cập nhật video minh hoạ thành công");
      refetchDetail();
      refetch();
      dispatch({ type: "SET_IS_SHOW_MODAL_UPDATE_MEDIA", payload: false });
    },
  });

  const mutationDelImage = useMutation({
    mutationFn: async (id: number) =>
      await MediaModel.deleteImageVocabulary(id),
    onSuccess: () => {
      message.success("Xoá hình ảnh minh hoạ thành công");
      dispatch({ type: "SET_IS_SHOW_MODAL_UPDATE_MEDIA", payload: false });
      refetchDetail();
      refetch();
    },
  });

  const mutationDelVideo = useMutation({
    mutationFn: async (id: number) =>
      await MediaModel.deleteVideoVocabulary(id),
    onSuccess: () => {
      message.success("Xoá video minh hoạ thành công");
      dispatch({ type: "SET_IS_SHOW_MODAL_UPDATE_MEDIA", payload: false });
      refetchDetail();
      refetch();
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => UploadModel.uploadFile(formData),
    onSuccess: (res: string) => {
      dispatch({ type: "SET_IMAGE_LOCATIONS", payload: res });
    },
  });

  const uploadMutationVideo = useMutation({
    mutationFn: async (formData: FormData) => UploadModel.uploadFile(formData),
    onSuccess: (res: string) => {
      dispatch({ type: "SET_VIDEO_LOCATIONS", payload: res });
    },
  });

  const columns = (hiddenVideo: boolean, hiddenImage: boolean) => {
    return [
      {
        title: "STT",
        dataIndex: "stt",
        key: "stt",
        render: (value: any, record: any, index: number) => index + 1,
        width: 50,
      },
      {
        title: "Ảnh minh hoạ",
        dataIndex: "imageLocation",
        key: "imageLocation",
        render: (imageLocation: string, record: any) => {
          if (imageLocation) {
            return (
              <Image width={120} src={imageLocation} alt={record.content} />
            );
          } else {
            return <span>Không có minh họa</span>;
          }
        },
        width: "30%",
        align: "center",
        hidden: hiddenImage,
      },
      {
        title: "Video minh hoạ",
        dataIndex: "videoLocation",
        key: "videoLocation",
        align: "center",
        render: (videoLocation: string, record: any) => {
          if (videoLocation) {
            return (
              <EyeOutlined
                style={{ fontSize: "1.5rem" }}
                onClick={() => {
                  dispatch({ type: "SET_OPEN_PREVIEW_VIDEO", payload: true });
                  dispatch({ type: "SET_ITEM_VOCABULARY", payload: record });
                }}
              />
            );
          } else {
            return <span>Không video có minh họa</span>;
          }
        },
        width: "30%",
        hidden: hiddenVideo,
      },
      {
        title: "Hình ảnh minh hoạ chính",
        dataIndex: "primary",
        align: "center",
        render: (value: boolean, record: any) => (
          <Switch
            disabled={value}
            checked={value}
            onChange={(item) => {
              mutationSetPrimaryImage.mutate({
                vocabularyImageId: record.vocabularyImageId,
                primary: item,
              });
            }}
          />
        ),
        width: 200,
        hidden: hiddenImage,
      },
      {
        title: "Video minh hoạ chính",
        dataIndex: "primary",
        align: "center",
        render: (value: boolean, record: any) => (
          <Switch
            disabled={value}
            checked={value}
            onChange={(item) => {
              mutationSetPrimaryVideo.mutate({
                vocabularyVideoId: record.vocabularyVideoId,
                primary: item,
              });
            }}
          />
        ),
        width: 200,
        hidden: hiddenVideo,
      },
      {
        title: "Thao tác",
        key: "action",
        align: "center",
        render: (value: any, record: any) => (
          <>
            <Popover content="Chỉnh sửa" placement="left">
              <Button
                onClick={() => {
                  dispatch({
                    type: "SET_IS_SHOW_MODAL_UPDATE_MEDIA",
                    payload: true,
                  });
                  dispatch({ type: "SET_RECORD_UPDATED", payload: record });
                  if (record?.imageLocation) {
                    dispatch({
                      type: "SET_FILE_URL_IMAGE",
                      payload: record?.imageLocation,
                    });
                  } else {
                    dispatch({
                      type: "SET_FILE_URL_VIDEO",
                      payload: record?.videoLocation,
                    });
                  }
                }}
              >
                <EditOutlined />
              </Button>
            </Popover>
            {record?.primary ? null : (
              <Popover content="Xóa" placement="left">
                <Popconfirm
                  placement="topRight"
                  title={"Bạn có muốn xoá hình ảnh này không?"}
                  onConfirm={() => {
                    if (record?.vocabularyImageId) {
                      mutationDelImage.mutate(record?.vocabularyImageId);
                    } else {
                      mutationDelVideo.mutate(record?.vocabularyVideoId);
                    }
                  }}
                  okText="Có"
                  cancelText="Không"
                >
                  <Button danger>
                    <DeleteOutlined />
                  </Button>
                </Popconfirm>
              </Popover>
            )}
          </>
        ),
      },
    ].filter((column) => !column.hidden);
  };

  return (
    <div>
      <Modal
        title={
          <div>
            Danh sách hình ảnh / video minh hoạ của{" "}
            {record.vocabularyType &&
              TYPE_VOCABULARY[record?.vocabularyType].toLowerCase()}{" "}
            <span className="text-xl text-red">{record.content}</span>
          </div>
        }
        open={showModalLstMedia}
        onCancel={onClose}
        width={1200}
        centered
        footer={null}
        destroyOnClose
      >
        <div className="mb-3 flex items-center justify-end pr-6">
          <Button
            type="primary"
            onClick={() => {
              setModalAddMedia({ ...modalAddMedia, open: true });
            }}
          >
            Thêm video/ hình ảnh cho{" "}
            {record.vocabularyType &&
              TYPE_VOCABULARY[record?.vocabularyType].toLowerCase()}
          </Button>
        </div>
        <div className="flex justify-between gap-4">
          <div className="w-1/2">
            <h2>Dánh sách ảnh</h2>
            <Table
              columns={columns(true, false).filter((e) => !e.hidden) as any}
              dataSource={detailVocabulary?.vocabularyImageResList}
              pagination={{ pageSize: 4, position: ["bottomCenter"] }}
            />
          </div>
          <div className="w-1/2">
            <h2>Dánh sách video</h2>
            <Table
              columns={columns(false, true).filter((e) => !e.hidden) as any}
              dataSource={detailVocabulary?.vocabularyVideoResList}
              pagination={{ pageSize: 6, position: ["bottomCenter"] }}
            />
          </div>
        </div>
      </Modal>

      {/* Preview */}
      <Modal
        open={state.openPreviewVideo}
        onCancel={() =>
          dispatch({ type: "SET_OPEN_PREVIEW_VIDEO", payload: false })
        }
        centered
        footer={null}
        width={1000}
      >
        <div className="mt-4 flex items-center justify-center py-4">
          <video
            src={state.itemVocabulary?.videoLocation}
            controls
            style={{ width: 800 }}
          ></video>
        </div>
      </Modal>

      {/* Chỉnh sửa */}
      <BasicDrawer
        width={560}
        titleName="Chỉnh sửa Media"
        open={state.isShowModalUpdateMedia}
        onClose={() =>
          dispatch({ type: "SET_IS_SHOW_MODAL_UPDATE_MEDIA", payload: false })
        }
        onOk={() => {
          if (state.recordUpdated.vocabularyImageId) {
            mutationUpdateImage.mutate({
              ...state.recordUpdated,
              primary: state.primaryMedia,
              imageLocation: state.imageLocations,
            });
          } else {
            mutationUpdateVideo.mutate({
              ...state.recordUpdated,
              primary: state.primaryMedia,
              videoLocation: state.videoLocations,
            });
          }
        }}
        destroyOnClose
      >
        <div className="py-2">
          <div>
            <div className="w-full">
              <div className="flex items-center justify-between">
                Hiển thị minh hoạ chính
                <Switch
                  disabled={state.primaryMedia}
                  checked={state.primaryMedia}
                  onChange={(item) => {
                    dispatch({ type: "SET_PRIMARY_MEDIA", payload: item });
                  }}
                />
              </div>
              {state.recordUpdated?.vocabularyImageId ? (
                <div className="w-full">
                  <p
                    className="ant-upload-text"
                    style={{ margin: "10px 0 10px 0" }}
                  >
                    Ảnh minh hoạ:
                  </p>
                  <Upload
                    showUploadList={false}
                    accept="image/*"
                    customRequest={({ file }: any) => {
                      const isImg = file.type.includes("image");
                      const formData = new FormData();
                      formData.append("file", file);
                      if (isImg) {
                        const fileReader = new FileReader();
                        fileReader.onload = (e) => {
                          dispatch({
                            type: "SET_FILE_URL_IMAGE",
                            payload: e.target!.result as string,
                          });
                        };
                        fileReader.readAsDataURL(file);
                        uploadMutation.mutate(formData);
                      } else {
                        message.error("Sai định dạng ảnh");
                      }
                    }}
                  >
                    <Button type="primary" icon={<UploadOutlined />}>
                      Chọn File
                    </Button>
                  </Upload>
                  {state.fileUrlImage && (
                    <div className="relative mt-3 flex flex-col items-center justify-center">
                      <Image
                        src={state.fileUrlImage}
                        alt="Uploaded Image"
                        className="flex items-center justify-center"
                        style={{ width: 300 }}
                      />
                      <Button
                        className="mt-2"
                        onClick={() => {
                          dispatch({
                            type: "SET_FILE_URL_IMAGE",
                            payload: "",
                          });
                          dispatch({
                            type: "SET_IMAGE_LOCATIONS",
                            payload: undefined,
                          });
                        }}
                      >
                        Xoá ảnh
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full">
                  <p
                    className="ant-upload-text"
                    style={{ margin: "10px 0 10px 0" }}
                  >
                    Video minh hoạ:
                  </p>
                  <Upload
                    showUploadList={false}
                    customRequest={({ file }: any) => {
                      const isVideo = file.type.startsWith("video/");
                      if (!isVideo) {
                        message.error("Sai định dạng video.");
                      } else {
                        const fileReader = new FileReader();
                        fileReader.onload = (e) => {
                          dispatch({
                            type: "SET_FILE_URL_VIDEO",
                            payload: e.target!.result as string,
                          });
                        };
                        fileReader.readAsDataURL(file);
                      }
                      const formData = new FormData();
                      formData.append("file", file);
                      uploadMutationVideo.mutate(formData);
                    }}
                  >
                    <Button type="primary" icon={<UploadOutlined />}>
                      Chọn File
                    </Button>
                  </Upload>
                  {state.fileUrlVideo ? (
                    <>
                      <div className="relative mt-3 flex flex-col items-center justify-center">
                        <video src={state.fileUrlVideo} controls />
                      </div>
                      <Button
                        className="mt-2"
                        onClick={() => {
                          dispatch({
                            type: "SET_FILE_URL_VIDEO",
                            payload: "",
                          });
                          dispatch({
                            type: "SET_VIDEO_LOCATIONS",
                            payload: undefined,
                          });
                        }}
                      >
                        Xoá video
                      </Button>
                    </>
                  ) : (
                    <>Chưa có video minh hoạ</>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </BasicDrawer>

      {/* Thêm media cho từ */}
      <ModalAddMedia
        isShowModalAddMedia={modalAddMedia.open}
        onClose={() => setModalAddMedia({ open: false, record: "" })}
        refetch={refetchDetail}
        recordMedia={record}
      />
    </div>
  );
};

export default ModalListMedia;
