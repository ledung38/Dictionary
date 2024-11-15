"use client";
import { colors } from "@/assets/colors";
import { Card, Tooltip, message } from "antd";
import { useState } from "react";
import * as icons from "../../assets/icons";

const Icons = () => {
  const [valueSearch, setValueSearch] = useState("");

  const renderIconGrids = () => {
    return Object.values(icons)
      .filter((Icon) => Icon.name.toLowerCase().trim().includes(valueSearch))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((Icon, index) => {
        return (
          <div
            key={index}
            onClickCapture={() => {
              navigator.clipboard.writeText(Icon.name);
              message.success(`Copy ${Icon.name} thành công!`);
            }}
          >
            <Tooltip arrow title={Icon.name} placement="top">
              <Card>
                <Icon
                  size={24}
                  width={24}
                  height={24}
                  color={colors.primary1100}
                />
              </Card>
            </Tooltip>
          </div>
        );
      });
  };

  return (
    <div className="pb-6">
      <div className="flex">{renderIconGrids()}</div>
    </div>
  );
};

export default Icons;
