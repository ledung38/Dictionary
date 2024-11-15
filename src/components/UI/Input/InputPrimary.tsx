/* eslint-disable react/display-name */
import React, { InputHTMLAttributes, useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { CloseCircleOutlined } from "@ant-design/icons";
import { isFunction } from "lodash";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  sizeClass?: string;
  fontClass?: string;
  rounded?: string;
  suffixIcon?: React.ReactNode;
  onSuffixClick?: (value: string) => void;
  allowClear?: boolean;
  onClear?: () => void;
}

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SuffixIcon = styled.div`
  position: absolute;
  right: 5%;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const ClearIcon = styled(CloseCircleOutlined)`
  position: absolute;
  right: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const InputPrimary = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = "",
      sizeClass = "h-11 px-4 py-3",
      fontClass = "text-sm font-normal",
      rounded = "rounded-2xl",
      type = "text",
      suffixIcon,
      onSuffixClick,
      allowClear = false,
      onClear,
      ...args
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState(args.value || "");

    const handleSuffixClick = () => {
      if (inputRef.current) {
        const inputValue = inputRef.current.value;
        if (onSuffixClick) {
          onSuffixClick(inputValue);
        }
      }
    };

    const handleClearClick = () => {
      if (inputRef.current) {
        inputRef.current.value = "";
        setValue("");
        isFunction(onClear) && onClear();
        if (args.onChange) {
          const event = new Event("input", { bubbles: true });
          inputRef.current.dispatchEvent(event);
        }
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      if (args.onChange) {
        args.onChange(e);
      }
    };

    useEffect(() => {
      if (args.value !== undefined) {
        setValue(args.value);
      }
    }, [args.value]);

    return (
      <InputWrapper className={className}>
        <input
          ref={inputRef}
          type={type}
          className={`dark:focus:ring-primary-6000 relative block w-full border-neutral-200 bg-white focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:bg-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 dark:focus:ring-opacity-25 dark:disabled:bg-neutral-800 ${rounded} ${fontClass} ${sizeClass}`}
          value={value}
          onChange={handleInputChange}
          {...args}
        />
        {suffixIcon && (
          <SuffixIcon
            style={{ paddingRight: allowClear && value ? "20px" : "0px" }}
            onClick={handleSuffixClick}
          >
            {suffixIcon}
          </SuffixIcon>
        )}
        {allowClear && value && <ClearIcon onClick={handleClearClick} />}
      </InputWrapper>
    );
  },
);

export default InputPrimary;
