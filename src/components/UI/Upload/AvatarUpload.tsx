import UploadModel from "@/model/UploadModel";
import { GenerateUtils } from "@/utils/generate";
import { Avatar, Upload, message } from "antd";
import { isFunction } from "lodash";
import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import styled, { css } from "styled-components";

/** Kiểu dữ liệu của component upload hình ảnh */
interface ImageUploadProps {
  // Giá trị đầu vào
  value?: string;
  // Function thay đổi giá trị đầu vào
  onChange?: (value: any) => void;
  // Độ rộng
  size?: number;
  // Kiểu
  listType?: string;
  //
  children?: ReactNode;
}

const uploadButton = (
  <button
    className="flex flex-col items-center justify-center gap-y-2 border-none bg-none"
    type="button"
  >
    <div className="caption-12-medium text-neutral1100">Tải lên</div>
  </button>
);

/** Component upload ảnh */
export const AvatarUpload: FC<ImageUploadProps> = ({
  value,
  onChange,
  size = 80,
  listType = "picture-card",
  children,
}) => {
  /** Danh sách ảnh đã upload */
  const [imageUrl, setImageUrl] = useState<any>();

  /** Xử lý validate định dạng ảnh */
  const validateImg: (file: File) => boolean = useCallback((file) => {
    // Lấy định dạng file
    const fileExtension = file.name.split(".")?.pop()?.toLowerCase() || "";
    // Danh sách định dạng được phép upload
    const imageExtensionList = ["jpeg", "png", "jpg", "webp"];
    // Kiểm tra định dạng file có thỏa mãn không
    const viableExtension = imageExtensionList.includes(fileExtension);
    // Kiểm tra kích thước file có thỏa mãn không
    const viableSize = file.size / 1024 / 1024 < 10;
    // Nếu định dạng không thỏa mãn thì thông báo sai định dạng
    if (!viableExtension)
      message
        .error(
          "Ảnh tải lên định dạng JPEC, JPG, PNG, WEBP dung lượng tối đa 10 MB",
        )
        .then();
    // Nếu kích thước không thỏa mãn thì thông báo sai kích thước
    if (!viableSize)
      message
        .error(
          "Ảnh tải lên định dạng JPEC, JPG, PNG, WEBP dung lượng tối đa 10 MB",
        )
        .then();
    // Trả về kết quả file upload có hợp lệ hay không
    return viableExtension && viableSize;
  }, []);

  /** Xử lý upload ảnh */
  const handleUpload: (value: { file: File }) => void = useCallback(
    ({ file }) => {
      // Kiểm tra định dạng file
      if (validateImg(file)) {
        const formData = new FormData();
        formData.append("file", file);
        UploadModel.image(formData).then((res) => {
          if (isFunction(onChange)) onChange(res);
          else setImageUrl(res);
        });
      }
    },
    [onChange, imageUrl],
  );

  /** Xử lý đặt lại giá trị của danh sách ảnh khi giá trị đầu vào thay đổi */
  useEffect(() => setImageUrl(value || null), [value]);

  return (
    <>
      <div className=" flex flex-wrap items-center gap-4">
        <CustomUpload
          size={size}
          listType={listType as any}
          showUploadList={false}
          customRequest={handleUpload as any}
          accept="image/*"
        >
          {children || (
            <>
              {imageUrl ? (
                <Avatar
                  className="object-cover"
                  src={GenerateUtils.genUrlImage(imageUrl)}
                  size={160}
                />
              ) : (
                <>{uploadButton}</>
              )}
              <span className="xsm:px-4 absolute bottom-2 right-0 flex cursor-pointer items-center justify-center gap-2 rounded bg-neutral-600 px-2 py-1 text-sm font-medium text-white hover:bg-opacity-80">
                <svg
                  className="fill-current"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.101 13.4874 3.42919C13.8156 3.75738 14 4.2025 14 4.66663V11.0833C14 11.5474 13.8156 11.9925 13.4874 12.3207C13.1592 12.6489 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.6489 0.512563 12.3207C0.184375 11.9925 0 11.5474 0 11.0833V4.66663C0 4.2025 0.184374 3.75738 0.512563 3.42919C0.840752 3.101 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27837 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72163 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z"
                    fill="white"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.99992 5.83329C6.03342 5.83329 5.24992 6.61679 5.24992 7.58329C5.24992 8.54979 6.03342 9.33329 6.99992 9.33329C7.96642 9.33329 8.74992 8.54979 8.74992 7.58329C8.74992 6.61679 7.96642 5.83329 6.99992 5.83329ZM4.08325 7.58329C4.08325 5.97246 5.38909 4.66663 6.99992 4.66663C8.61075 4.66663 9.91659 5.97246 9.91659 7.58329C9.91659 9.19412 8.61075 10.5 6.99992 10.5C5.38909 10.5 4.08325 9.19412 4.08325 7.58329Z"
                    fill="white"
                  />
                </svg>
              </span>
            </>
          )}
        </CustomUpload>
      </div>
    </>
  );
};

const CustomUpload = styled(Upload)<{ size: number }>`
  ${({ size }) => css`
    .ant-upload.ant-upload-select {
      background: #cfd1d1 !important;
      width: ${size}px !important;
      height: ${size}px !important;
      .ant-upload {
        display: flex !important;
      }
    }
  `}
`;
