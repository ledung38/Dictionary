import { trim } from "lodash";

// Validate trường bắt buộc nhập
export function validateRequire(message: any) {
  return {
    required: true,
    message: message || "Vui lòng không bỏ trống mục này",
  };
}

// Validate truong chi nhap khoang trang
export function validateRequireInput(message?: any, required = true) {
  return {
    required,
    validator: (_: any, value: string) => {
      if (!required) return Promise.resolve();
      if (!!value && trim(value) !== "") {
        return Promise.resolve();
      }

      return Promise.reject(message || "Vui lòng không bỏ trống mục này");
    },
  };
}

export function validateRequireComboboxAcceptZero(message: any) {
  return {
    required: true,
    validator: (value: any) => {
      if ((!!value && trim(value) !== "") || value === 0) {
        return Promise.resolve();
      }

      return Promise.reject(message || "Vui lòng không bỏ trống mục này");
    },
  };
}

export function validateEmail(message: string) {
  return {
    validator: (_: any, value: string) => {
      if (value && value.length) {
        const re =
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9]{2,}(?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
        if (re.test(value)) {
          return Promise.resolve();
        }

        return Promise.reject(message || "Vui lòng nhập đúng định dạng");
      }

      return Promise.resolve();
    },
  };
}
// Validate trường password
export function validatePassword(message: any) {
  return {
    validator: (_: any, value: string) => {
      if (value && value.length) {
        const regex = [];
        regex.push("[A-Z]"); // Uppercase
        regex.push("[a-z]"); // Lowercase
        regex.push("[0-9]"); // Digit ~<>
        regex.push("[!@#$%^&+=]");

        // regex.push(
        // 	"[\\s\\`\\~\\@\\#\\%\\&\\(\\)\\[\\]\\{\\}\\\\^\\$\\:\\;\\'\\/\\,\\|\\?\\*\\+\\.\\<\\>\\-\\=\\!\\_]",
        // );

        let passed = 0;
        for (let i = 0; i < regex.length; i++) {
          if (new RegExp(regex[i]).test(value)) {
            passed++;
          }
        }
        if (passed > 3 && value.length >= 8 && value.length <= 16) {
          return Promise.resolve();
        }

        return Promise.reject(message || "Giá trị nhập vào không hợp lệ");
      }

      return Promise.resolve();
    },
  };
}

export function validateInputValueRange(min: any, max: any, message?: any) {
  return {
    validator: (_: any, value: any) => {
      const regexNumber = /^[0-9]+(\.?[0-9]+)?$/g
      const isNumber = regexNumber.test(value)
      if (!isNumber) return Promise.resolve()
      if ((!!value || value === 0) && min <= Number(value) && Number(value) <= max) {
        return Promise.resolve()
      }
      return Promise.reject(message || `Giá trị phải trong khoảng từ ${min} đến ${max}`)
    },
  }
}
