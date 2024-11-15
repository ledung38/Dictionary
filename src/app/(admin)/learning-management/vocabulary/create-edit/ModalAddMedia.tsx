import BasicDrawer from "@/components/UI/draw/BasicDraw";
import { isImage } from "@/components/common/constants";
import MediaModel from "@/model/MediaModel";
import UploadModel from "@/model/UploadModel";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Collapse, Image, Modal, Upload, message } from "antd";
import React, { useState } from "react";
import styled from "styled-components";
import { TYPE_VOCABULARY } from "../VocabularyList";

const CustomCollapse = styled(Collapse)`
  &&& {
    border: none;
    border-radius: 0;
    background-color: white;
    box-shadow: none;
  }

  .ant-collapse-header-text {
    color: "#0F131A";
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    letter-spacing: 0.07px;
  }

  &.ant-collapse > .ant-collapse-item:first-child .ant-collapse-header {
    color: red;
  }

  &.ant-collapse > .ant-collapse-item > .ant-collapse-header {
    padding: 0 0 8px;
  }

  &.ant-collapse .ant-collapse-content > .ant-collapse-content-box {
    &:nth-child(n + 2) {
      padding: 8px 0;
    }
    padding: 0;
  }

  &.ant-collapse-borderless > .ant-collapse-item {
    &:nth-child(n + 2) {
      padding: 16px 0 8px;
    }
    padding-bottom: 8px;
    border-bottom: none;
    &:nth-child(n + 2) {
      border-top: 1px solid #e2e8f3;
    }
  }
`;

interface ModalAddMediaProps {
  isShowModalAddMedia: boolean;
  recordMedia?: any;
  refetch: () => void;
  onClose?: any;
}

const ModalAddMedia: React.FC<ModalAddMediaProps> = ({
  isShowModalAddMedia,
  recordMedia,
  refetch,
  onClose,
}) => {
  const [fileList, setFileList] = useState<any[]>([]);
  const [previewFile, setPreviewFile] = useState<any>("");

  const handleUpload = async () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("files", file.originFileObj);
    });

    const res = await UploadModel.upLoadList(formData);
    const images = res.data
      ?.filter((item: { imageLocation: null }) => item.imageLocation !== null)
      .map((item: { imageLocation: any }) => item.imageLocation);
    const videos = res.data
      ?.filter((item: { videoLocation: null }) => item.videoLocation !== null)
      .map((item: { videoLocation: any }) => item.videoLocation);

    const bodyListImage = images?.map((imageLocation: any) => ({
      imageLocation,
      primary: false,
      vocabularyId: recordMedia.vocabularyId,
    }));

    const bodyListVideo = videos?.map((videoLocation: any) => ({
      videoLocation,
      primary: false,
      vocabularyId: recordMedia.vocabularyId,
    }));

    if (res.code === 200) {
      const responseImage =
        await MediaModel.addListImageVocabulary(bodyListImage);
      const responseVideo =
        await MediaModel.addListVideoVocabulary(bodyListVideo);

      if (responseImage.code === 200 && responseVideo.code === 200) {
        message.success("Thêm danh sách hình ảnh/video thành công");
        setFileList([]);
        onClose();
        refetch();
      } else if (responseImage.code === 200) {
        message.error("Lỗi upload video");
      } else {
        message.error("Lỗi upload images");
      }
    } else {
      message.error("Lỗi upload files");
    }
  };

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onloadend = () => resolve(reader.result as string);
      });
    }
    setPreviewFile({ open: true, file: file });
  };

  const handleChange = ({ fileList }: any) => {
    const containsOtherFileType = fileList.some(
      (file: { type: string }) =>
        !file.type.startsWith("image/") && !file.type.startsWith("video/"),
    );
    if (containsOtherFileType) {
      message.error("Chỉ chấp nhận tệp ảnh và video!");
      return;
    }
    setFileList(fileList);
  };

  const items = [
    {
      key: "1",
      label: "Thêm các video/hình ảnh khác",
      children: (
        <div className="max-h-[600px] overflow-y-scroll py-2">
          <Upload
            listType="text"
            multiple
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            customRequest={({ file }: any) => {
              const isImageOrVideo =
                file.type.startsWith("image/") ||
                file.type.startsWith("video/");
              if (!isImageOrVideo) {
                message.error("Chỉ được chọn file video hoặc ảnh.");
              }
            }}
            accept="image/*,video/*"
          >
            <Button icon={<UploadOutlined />}>Chọn File</Button>
          </Upload>
        </div>
      ),
    },
  ];

  return (
    <>
      <BasicDrawer
        width={450}
        onClose={onClose}
        open={isShowModalAddMedia}
        title={`Bổ sung hình ảnh/video cho ${recordMedia.vocabularyType && TYPE_VOCABULARY[recordMedia?.vocabularyType].toLowerCase()} ${recordMedia?.content}`}
        footer={[
          <Button key="back" onClick={onClose}>
            Hủy bỏ
          </Button>,
          <Button
            className="ml-4"
            key="submit"
            type="primary"
            disabled={!fileList.length}
            onClick={handleUpload}
          >
            Tải lên
          </Button>,
        ]}
        destroyOnClose
      >
        <CustomCollapse
          defaultActiveKey={["1"]}
          items={items}
          bordered={false}
        />
      </BasicDrawer>

      <Modal
        open={previewFile.open}
        onCancel={() => setPreviewFile({ open: false, file: "" })}
        footer={null}
        width={600}
        closeIcon={null}
      >
        <div className="flex w-full items-center justify-center">
          {previewFile && (
            <>
              {previewFile.file?.originFileObj?.type?.startsWith("image/") ? (
                <Image
                  className="w-full"
                  alt=""
                  src={previewFile.file.preview}
                />
              ) : (
                <div className="w-full">
                  <video controls style={{ width: "100%", height: "auto" }}>
                    <source src={previewFile.file.preview} />
                  </video>
                </div>
              )}
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ModalAddMedia;
