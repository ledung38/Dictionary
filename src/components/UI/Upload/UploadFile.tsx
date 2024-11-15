import { isImage } from "@/components/common/constants";
import UploadModel from "@/model/UploadModel";
import { DeleteOutlined, EyeFilled, PlusOutlined } from "@ant-design/icons";
import { Image, message, Modal, Upload } from "antd";
import { isFunction } from "lodash";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";

interface MediaUploadProps {
  value?: any[];
  onChange?: (value: any) => void;
  limit?: number;
  uploadWidth?: number;
  uploadHeight?: number;
}

const uploadButton = (uploadWidth?: number, uploadHeight?: number) => (
  <button
    className="flex flex-col items-center justify-center gap-y-2 border-none bg-neutral-400 px-4 py-6"
    type="button"
    style={{
      width: uploadWidth || 100,
      height: uploadHeight || 100,
    }}
  >
    <PlusOutlined size={24} />
    <div className="caption-12-medium text-neutral1100">Tải lên</div>
  </button>
);

const ITEM_DISPLAY = 1;

export const MediaUpload: FC<MediaUploadProps> = ({
  value,
  onChange,
  uploadWidth = 100,
  uploadHeight = 100,
}) => {
  const [mediaList, setMediaList] = useState<any[]>([]);

  const mediaType = useMemo(() => {
    if (mediaList[0]) {
      return isImage(mediaList[0]?.length && mediaList[0]);
    }
  }, [mediaList]);

  const validateMedia: (file: File) => boolean = useCallback(
    (file) => {
      const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
      const image = isImage(fileExtension);
      const mediaExtensionList = image
        ? ["jpeg", "png", "jpg", "webp"]
        : ["mp4", "mkv", "mov"];
      const viableExtension = mediaExtensionList.includes(fileExtension);
      const viableSize = file.size / 1024 / 1024 < 10;
      if (!viableExtension)
        message
          .error(
            `Tệp tin chỉ hỗ trợ định dạng ${image ? "JPEG, PNG, JPG, WEBP" : "MP4, MKV, MOV"}`,
          )
          .then();
      if (!viableSize) message.error("Tệp tin không được quá 10MB").then();
      return viableExtension && viableSize;
    },
    [value],
  );

  const handleUpload: (value: { file: File }) => void = useCallback(
    ({ file }) => {
      if (validateMedia(file)) {
        const formData = new FormData();
        formData.append("file", file);
        UploadModel.uploadFile(formData).then((res) => {
          if (isFunction(onChange)) onChange(res);
          else setMediaList([...mediaList, res]);
        });
      }
    },
    [onChange, mediaList, validateMedia],
  );

  const handleRemove: (file: { id: number } | any) => void = useCallback(
    (file) => {
      const newMediaList = mediaList.filter((media) => media.id !== file.id);
      if (isFunction(onChange)) onChange(newMediaList);
      else setMediaList(newMediaList);
    },
    [onChange, mediaList],
  );

  useEffect(() => {
    if (value) {
      setMediaList([value] || []);
    }
  }, [value]);

  const [preview, setPreview] = useState<{
    open: boolean;
    media: string;
    title: string;
  }>({
    open: false,
    media: "",
    title: "",
  });

  const handleCancel: () => void = useCallback(
    () => setPreview({ open: false, media: "", title: "" }),
    [],
  );

  return (
    <>
      <div className="flex flex-wrap items-center gap-4">
        {mediaList[0]?.length > 0 ? (
          mediaList?.slice(0, ITEM_DISPLAY)?.map((e: any, index: number) => (
            <div key={index} className="relative ">
              {mediaType && (
                <Image
                  alt=""
                  className="rounded-lg object-contain"
                  style={{
                    width: uploadWidth || 200,
                    height: uploadHeight || 200,
                  }}
                  src={e}
                />
              )}
              {!isImage(e) && (
                <video
                  controls={false}
                  style={{
                    width: uploadWidth || 200,
                    height: uploadHeight || 200,
                  }}
                >
                  <source src={e} type="video/mp4" />
                </video>
              )}
              <div className="absolute inset-0 flex cursor-pointer items-center justify-center gap-1 bg-[#1f1c1c] opacity-0 transition-opacity duration-300 hover:opacity-70">
                <span
                  className=""
                  onClick={() =>
                    setPreview({
                      open: true,
                      media: e,
                      title: e,
                    })
                  }
                >
                  <EyeFilled style={{ color: "white" }} />
                </span>
                <span className="" onClick={() => handleRemove(e)}>
                  <DeleteOutlined style={{ color: "white" }} />
                </span>
              </div>
            </div>
          ))
        ) : (
          <CustomUpload uploadWidth={uploadWidth} uploadHeight={uploadHeight}>
            <Upload
              listType={mediaType ? "picture-card" : undefined}
              showUploadList={false}
              customRequest={handleUpload as any}
              onRemove={handleRemove}
            >
              {uploadButton(uploadWidth, uploadHeight)}
            </Upload>
          </CustomUpload>
        )}

        {mediaList?.length > ITEM_DISPLAY && (
          <div className="relative">
            {mediaType ? (
              <Image alt="" className="h-20 w-20 rounded-lg" />
            ) : (
              <video controls={false} style={{ width: "80px", height: "80px" }}>
                <source type="video/mp4" />
              </video>
            )}
            <div
              className="headline-16-semibold absolute  inset-0 flex items-center  
                  justify-center  rounded-xl text-white"
              style={{ background: "rgba(12, 12, 12, 0.7)" }}
            >
              + {mediaList?.length - ITEM_DISPLAY}
            </div>
          </div>
        )}
      </div>

      <Modal
        open={preview.open}
        title={preview.title}
        footer={null}
        onCancel={handleCancel}
      >
        {mediaType ? (
          <Image
            alt="example"
            style={{
              width: "100%",
            }}
            src={preview.media}
          />
        ) : (
          <video controls style={{ width: "100%" }}>
            <source src={preview.media} type="video/mp4" />
          </video>
        )}
      </Modal>
    </>
  );
};
const CustomUpload = styled.div<{
  uploadWidth: number;
  uploadHeight: number;
}>`
  .ant-upload.ant-upload-select {
    width: ${(props) => props.uploadWidth}px !important;
    height: ${(props) => props.uploadHeight}px !important;
    .ant-upload {
      display: flex !important;
    }
  }
`;
