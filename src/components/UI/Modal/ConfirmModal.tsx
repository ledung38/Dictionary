import { colors } from "@/assets/colors";
import {
  CheckCircleOutlined,
  DeleteOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Modal } from "antd";
import { ReactNode } from "react";

interface ConfirmModalProps {
  visible: boolean;
  setVisibleModal?: (visible: boolean) => void;
  iconType: "SUCCESS" | "ERROR" | "WARNING" | "DELETE";
  title: ReactNode;
  content: ReactNode;
  cancelButton?: boolean;
  onClick: () => void;
  cancelButtonText?: string;
  confirmButtonText?: string;
  onCloseModal?: () => void;
  closable?: boolean;
}

export const ConfirmModal = ({
  visible,
  setVisibleModal,
  iconType,
  title,
  content,
  cancelButton,
  onClick,
  cancelButtonText = "Hủy",
  confirmButtonText = "Xác Nhận",
  onCloseModal, // TH dùng chung modol cùng 1 state dạng {A: false, B: false}
  closable = true,
}: ConfirmModalProps) => {
  const closeModal = () => {
    setVisibleModal && setVisibleModal(false);
    onCloseModal && onCloseModal();
  };
  const handleClick = () => {
    onClick();
    closeModal();
  };
  return (
    <>
      <Modal
        centered
        open={visible}
        onCancel={closeModal}
        closable={closable}
        maskClosable={false}
        width={384}
        title={
          <div className="flex h-10 w-10 items-start justify-start rounded-full bg-rose-100 p-2">
            {iconType === "SUCCESS" && <CheckCircleOutlined />}
            {iconType === "ERROR" && (
              <DeleteOutlined style={{ color: colors.red700, fontSize: 23 }} />
            )}
            {iconType === "WARNING" && <WarningOutlined />}
            {iconType === "DELETE" && (
              <DeleteOutlined style={{ color: colors.red700, fontSize: 23 }} />
            )}
          </div>
        }
        onOk={handleClick}
        cancelText={cancelButtonText}
        okText={confirmButtonText}
        destroyOnClose
      >
        <div className="">
          <div className="text-neutral1100 text-base font-semibold">
            {title}
          </div>
          <div className="text-neutral800 mt-2 text-sm">{content}</div>
        </div>
      </Modal>
    </>
  );
};
