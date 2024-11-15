import { IconProps } from "@/types/icon";
import React from "react";

export const CloseIcon = ({ size = 24, color = "#465B7F" }: IconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.22846 6.22846C6.53307 5.92385 7.02693 5.92385 7.33154 6.22846L18.7715 17.6685C19.0762 17.9731 19.0762 18.4669 18.7715 18.7715C18.4669 19.0762 17.9731 19.0762 17.6685 18.7715L6.22846 7.33154C5.92385 7.02693 5.92385 6.53307 6.22846 6.22846Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.22846 18.7715C5.92385 18.4669 5.92385 17.9731 6.22846 17.6685L17.6685 6.22846C17.9731 5.92385 18.4669 5.92385 18.7715 6.22846C19.0762 6.53307 19.0762 7.02693 18.7715 7.33154L7.33154 18.7715C7.02693 19.0762 6.53307 19.0762 6.22846 18.7715Z"
        fill={color}
      />
    </svg>
  );
};
