import React from "react";
import Button, { ButtonProps } from "./Button";

export interface ButtonSecondaryProps extends ButtonProps {}

const ButtonSecondary: React.FC<ButtonSecondaryProps> = ({
  className = " border border-slate-300 dark:border-slate-700 ",
  ...args
}) => {
  return (
    <Button
      className={`ttnc-ButtonSecondary hover:bg-gray-100 bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 ${className}`}
      {...args}
    />
  );
};

export default ButtonSecondary;
