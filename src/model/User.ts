/* eslint-disable import/no-anonymous-default-export */
import { Base } from "./Base";

class User extends Base {
  // thông tin cá nhân
  getProfile = async () => {
    const res = await this.apiGet("-auth/profile");
    return res.data;
  };

  //Cập nhật thông tin cá nhân
  updateProfile = async (body: any) => {
    const res = await this.apiPut(`-auth/profile`, body);
    return res.data;
  };

  // Cập nhật avatar
  updateAvatar = async (body: any) => {
    const res = await this.apiUploadFile(`-auth/users/upload-avatar`, body);
    return res.data;
  };

  // Thông tin người dùng chi tiết
  getUserInfo = async (id: number) => {
    const res = await this.apiGet(`-auth/profile`);
    return res.data;
  };

  // Thay đổi mật khẩu
  changePassword = async (body: any) => {
    const res = await this.apiPut(`-auth/change-password`, body);
    return res.data;
  };

  // Tìm kiếm bạn bè
  searchFriend = async (param: any) => {
    const res = await this.apiGet(`/users/search/v2`, param);
    return res.data;
  };

  // Danh sách bạn bè
  getLstFriend = async (param?: any) => {
    const res = await this.apiGet(`/friend-ship/friend-list`, param);
    return res.data;
  };

  // Lời mời kết bạn
  getLstRequest = async (param?: any) => {
    const res = await this.apiGet(`/friend-ship/request-list`, param);
    return res.data;
  };

  // Lời mời đã gửi
  getLstSending = async (param?: any) => {
    const res = await this.apiGet(`/friend-ship/sending-list`, param);
    return res.data;
  };

  // Thêm bạn bè
  addFriend = async (userId: number) => {
    const res = await this.apiPost(`/friend-ship/add-friend/${userId}`, {
      userId,
    });
    return res.data;
  };

  // Đồng ý kết bạn
  acceptFriend = async (userId: number) => {
    const res = await this.apiPost(`/friend-ship/accept-friend/${userId}`, {});
    return res.data;
  };

  // Huỷ kết bạn, lời mời
  cancelFriend = async (userId: number) => {
    const res = await this.apiDelete(`/friend-ship/cancel-friend/${userId}`);
    return res.data;
  };

  // Danh sách tài khoản
  getAllAccount = async (param?: any) => {
    const res = await this.apiGet(`/search`, param);
    return res.data;
  };

  // Phê duyệt tài khoản
  approveAccount = async (id: number) => {
    const res = await this.apiPut(`-auth/authorization/${id}`, { id: id });
    return res.data;
  };
}

export default new User("user");
