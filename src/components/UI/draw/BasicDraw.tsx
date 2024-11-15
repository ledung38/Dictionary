// BasicDrawer.js
import type { DrawerProps } from "antd";
import React from "react";
import { Button, Drawer } from "antd";
import { CloseCircleOutlined, PlusOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { colors } from "@/assets/colors";
import { CloseIcon } from "@/assets/icons";

interface BasicDrawerProps extends DrawerProps {
  children: React.ReactNode;
  onClose: () => void;
  titleName?: string;
  onOk?: () => void;
}

const CustomDrawer = styled(Drawer)`
  .ant-drawer-header {
    padding: 24px 24px 12px 24px;
  }
  .ant-drawer-footer {
    padding: 12px 24px;
  }
`;

const BasicDrawer = (props: BasicDrawerProps) => {
  const { footer, open, children, onClose, titleName, onOk } = props;

  return (
    <CustomDrawer
      width={640}
      extra={
        <Button className="hover:opacity-60 " onClick={onClose} type="link">
          <CloseIcon color={colors.neutral700} size={20} />
        </Button>
      }
      title={
        <>
          <div className="flex items-center gap-4">
            <PlusOutlined />
            <div className="headline-16-semibold  text-neutral1100">
              {titleName}
            </div>
          </div>
        </>
      }
      footer={
        footer || (
          <div className="flex justify-end gap-4">
            <Button style={{ width: "120px" }} onClick={onClose}>
              Huỷ
            </Button>
            <Button
              type="primary"
              style={{ width: "120px", background: colors.primary600 }}
              onClick={onOk}
            >
              Xác nhận
            </Button>
          </div>
        )
      }
      placement="right"
      closeIcon={null}
      open={open}
      {...props}
    >
      {children}
    </CustomDrawer>
  );
};

export default BasicDrawer;
