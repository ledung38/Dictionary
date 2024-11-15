import { IconProps } from "@/types/icon";
import React from "react";

export const ImageIcon: React.FC<IconProps> = ({
  size = "1em",
  color = "#0084FF",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 20 20"
  >
    <path
      fill={color}
      d="M18.405 2.799c-.112-.44-.656-.799-1.21-.799H2.805c-.555 0-1.099.359-1.21.799L1.394 4h17.211zM19.412 5H.587a.58.58 0 0 0-.577.635l.923 11.669a.77.77 0 0 0 .766.696H18.3a.77.77 0 0 0 .766-.696l.923-11.669A.58.58 0 0 0 19.412 5m-6.974 3.375a.938.938 0 1 1 0 1.876a.938.938 0 0 1 0-1.876M5.5 14l2.486-5.714l2.827 4.576l2.424-1.204L14.5 14z"
    />
  </svg>
);
