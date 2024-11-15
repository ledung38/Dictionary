import React from "react";
import Button, { ButtonProps } from "./Button";

export interface ButtonPrimaryProps extends ButtonProps {}

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
  className = "",
  ...args
}) => {
  return (
    <Button
      className={`ttnc-ButtonPrimary bg-slate-900 text-slate-50 shadow-xl hover:bg-slate-800 disabled:bg-opacity-90 dark:bg-slate-100 dark:text-slate-800 ${className}`}
      {...args}
    />
  );
};

export default ButtonPrimary;
