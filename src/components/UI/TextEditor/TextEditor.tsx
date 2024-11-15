import React, { FC, useCallback, useMemo } from "react";
import "react-quill/dist/quill.snow.css";
import { styled } from "styled-components";
import ReactQuill, { Value } from "react-quill";
import { StringMap } from "quill";
import { isFunction } from "lodash";
import DOMPurify from "dompurify";

/** Style của khung Text Editor */
const StyledQuill: typeof ReactQuill = styled(ReactQuill)`
  .ql-toolbar.ql-snow {
    border: 1px solid #e6e6e6;
    border-top-left-radius: 0.75rem;
    border-top-right-radius: 0.75rem;
    background-color: #f8f8f8;
  }
  .ql-container.ql-snow {
    border: 1px solid #e6e6e6;
    border-bottom-left-radius: 0.75rem;
    border-bottom-right-radius: 0.75rem;
    min-height: 150px;
  }
`;

/** Style của khung Text Editor khi dùng ở màn chi tiết */
const StyledQuillContent = styled(ReactQuill)<{ isShowLess: boolean }>`
  .ql-toolbar.ql-snow {
    display: none;
  }
  .ql-container.ql-snow {
    border: none;
  }
  .ql-editor {
    padding: 0;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: ${(props) => (props.isShowLess ? "1" : "unset")};
  }
  .ql-tooltip {
    display: none;
  }
  .ql-clipboard {
    display: none;
  }
`;

/** Các module được hiển thị của Text Editor */
const CustomQuillModules: StringMap = {
  toolbar: [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction

    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ["clean"], // remove formatting button
  ],
};

/** Thuộc tính của các biến truyền vào trong component */
interface TextEditorProps {
  // Nội dung của Editor
  value?: string;
  // Độ dài tối đa của nội dung nhập vào
  maxLength?: number;
  // Thông báo hiện lên khi chưa nhập gì
  placeholder?: string;
  // Function xử lý khi nhập nội dung vào editor
  onChange?: (value?: Value) => void;
  // Chỉ hiển thị nội dung, không hiển thị khung và thao tác, dùng để xem chi tiết
  readOnly?: boolean;
  isShowLess?: boolean;
}

/** Component của Text Editor */
export const TextEditor: FC<TextEditorProps> = ({
  maxLength = 1000,
  placeholder,
  value,
  onChange = (value) => value,
  readOnly,
  isShowLess,
}) => {
  /** Độ dài hiện tại của text đã nhập */
  const textLength = useMemo(
    () => (value || "").replace(/<[^>]*>/g, "").length,
    [value],
  );

  /** Xử lý mã độc trước khi gán value cho Text-editor */
  const purifiedValue = useMemo(
    () => (value ? DOMPurify.sanitize(value) : ""),
    [value],
  );

  /** Xử lý nhập text vào editor */
  const handleInput: (input: string) => void = useCallback(
    (input) => {
      // Sử dụng regex để tìm và thay thế các thẻ <a> thành <p>
      const modifiedInput = input.replace(
        /<a\b[^>]*>(.*?)<\/a>/gi,
        "<p>$1</p>",
      );

      // Nếu có function onChange truyền vào thì truyền giá trị đã nhập cho function đó
      if (isFunction(onChange)) onChange(modifiedInput);
    },
    [onChange],
  );

  /** Xử lý giới hạn độ dài text của editor */
  const handleInputLimit: (event: {
    target: { outerText?: string };
    key: string;
    altKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
    preventDefault: () => void;
  }) => void = useCallback((event) => {
    // Lấy độ dài hiện tại của text được nhập
    const currentTextLength =
      event.target?.outerText?.replace(/\r?\n|\r/g, "")?.length || 0;
    // Khi độ dài đạt giới hạn tối đa thì chỉ cho phép xóa đi và không được nhập thêm
    if (
      // Chặn khi độ dài nhập thêm lớn hơn hoặc bằng độ dài tối đa
      currentTextLength >= maxLength &&
      // Chặn khi nhập thêm kí tự
      ((event.key !== "Backspace" &&
        !event.altKey &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.shiftKey) ||
        // Chặn khi Ctrl + V paste thêm
        (event.key === "v" && event.ctrlKey))
    )
      event.preventDefault();
  }, []);

  return readOnly ? (
    <StyledQuillContent
      value={purifiedValue}
      readOnly
      isShowLess={isShowLess}
    />
  ) : (
    <div className="w-full space-y-2">
      <StyledQuill
        modules={CustomQuillModules}
        placeholder={placeholder || ""}
        value={purifiedValue}
        onChange={handleInput}
        onKeyDown={handleInputLimit}
      />
      <div
        className={`caption-12-regular text-right ${textLength < maxLength ? "text-neutral700" : "text-red-500"}`}
      >
        {textLength}/{maxLength}
      </div>
    </div>
  );
};
