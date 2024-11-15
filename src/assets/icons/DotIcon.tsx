import { IconProps } from "@/types/icon";
import React from "react";
import { colors } from "../colors";

export const DotIcon: React.FC<IconProps> = ({
  size = "1em",
  color = "#646515",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
    >
      <path
        fill={color}
        d="M12 18a6 6 0 1 1 0-12a6 6 0 0 1 0 12m0-1.5a4.5 4.5 0 1 0 0-9a4.5 4.5 0 0 0 0 9"
      />
    </svg>
  );
};
