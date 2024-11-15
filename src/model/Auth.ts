/* eslint-disable import/no-anonymous-default-export */
import { Base } from "./Base";

class Auth extends Base {
  // Đăng nhập
  login = async (body?: any) => {
    const res = await this.apiPost("/auth/login", body);
    return res.data;
  };
  // Đăng ký
  register = async (body?: any) => {
    return await this.apiPost("/register/generate-otp", body);
  };

  // validate otp
  validateOtp = async (body?: any) => {
    return await this.apiPost("/register/validate-otp", body);
  };
}

export default new Auth("user-service");
