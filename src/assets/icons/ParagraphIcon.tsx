import { IconProps } from "@/types/icon";
import React from "react";

export const ParagraphIcon: React.FC<IconProps> = ({
  size = "1em",
  color = "currentColor",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 48 48"
    >
      <g
        fill="none"
        stroke={color}
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M24 9H42" />
        <path d="M24 19H42" />
        <path d="M6 29H42" />
        <path d="M6 39H42" />
        <rect width="10" height="10" x="6" y="9" fill="#2f88ff" />
      </g>
    </svg>
  );
};
