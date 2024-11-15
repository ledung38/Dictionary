import { IconProps } from "@/types/icon";
import React from "react";

export const EndCallIcon: React.FC<IconProps> = ({
  size = 20,
  color = "#0084FF",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 48 48"
    >
      <path
        fill={color}
        d="m43.5 16.8l-2.3-2.3c-8.1-7.9-27.5-6.8-34.5 0l-2.3 2.3c-.6.6-.6 1.6 0 2.3L9 23.6c.6.6 1.7.6 2.3 0l5.1-4.9l-.4-5.3c1.6-1.6 14.4-1.6 16 0l-.3 5.5l4.9 4.7c.6.6 1.7.6 2.3 0l4.6-4.5c.7-.7.7-1.7 0-2.3"
      />
      <g fill={color}>
        <path d="M24 40.5L16 31h16z" />
        <path d="M21 24h6v7.5h-6z" />
      </g>
    </svg>
  );
};
