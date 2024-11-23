"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Avatar, Button, Form, Input, Modal, message } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/adminSlice";
import { useRouter } from "next/navigation";
import User from "@/model/User";
import { GenerateUtils } from "@/utils/generate";

const DropdownUser = ({ admin }: { admin: User }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);
  const router = useRouter();
  const isMounted = useRef(false);

  const [isShowModalChangePass, setIsShowModalChangePass] = useState(false);

  // Remove this line as we no longer have SocketVideoCallContext
  // const { socket }: any = useContext(SocketVideoCallContext);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [dropdownOpen, trigger.current, dropdown.current]);

  // close if the esc key is pressed
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, [dropdownOpen]);

  // Thay đổi mật khẩu
  const handleChangePassword = async (value: any) => {
    if (value) {
      try {
        await User.changePassword(value);
        setTimeout(() => {
          message.success("Thay đổi mật khẩu thành công");
          setIsShowModalChangePass(false);
        }, 500);
      } catch (error) {
        message.error("Đã xảy ra lỗi, vui lòng thử lại");
      }
    }
  };

  const handleLogout = () => {
    router.push("/");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("pendingOffer");
    dispatch(logout());
    // Remove this line as we no longer have access to socket
    // socket.emit("disconnected");
  };

  return (
    <div className="relative">
      <Link
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        href="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            {admin?.name}
          </span>
          <span className="block text-xs">{admin?.role}</span>
        </span>

        <span className="h-12 w-12 rounded-full">
          <Avatar
            size={48}
            icon={<UserOutlined />}
            src={GenerateUtils.genUrlImage(admin?.avatarLocation)}
          />
        </span>
      </Link>

      {/* <!-- Dropdown Start --> */}
      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute right-0 z-[10000] mt-4 flex w-56 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${
          dropdownOpen === true ? "block" : "hidden"
        }`}
      >
        <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
          <li>
            <Link
              href="/profile"
              className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
            >
              <UserOutlined />
              Thông tin cá nhân
            </Link>
          </li>

          <li onClick={() => setIsShowModalChangePass(true)}>
            <div className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:cursor-pointer hover:text-primary lg:text-base">
              <LockOutlined />
              Đổi mật khẩu
            </div>
          </li>
        </ul>

        <button
          className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
          onClick={handleLogout}
        >
          <svg
            className="fill-current"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.5375 0.618744H11.6531C10.7594 0.618744 10.0031 1.37499 10.0031 2.26874V4.64062C10.0031 5.05312 10.3469 5.39687 10.7594 5.39687C11.1719 5.39687 11.55 5.05312 11.55 4.64062V2.23437C11.55 2.16562 11.5844 2.13124 11.6531 2.13124H15.5375C16.3625 2.13124 17.0156 2.78437 17.0156 3.60937V18.3562C17.0156 19.1812 16.3625 19.8344 15.5375 19.8344H11.6531C11.5844 19.8344 11.55 19.8 11.55 19.7312V17.3594C11.55 16.9469 11.2062 16.6031 10.7594 16.6031C10.3125 16.6031 10.0031 16.9469 10.0031 17.3594V19.7312C10.0031 20.625 10.7594 21.3812 11.6531 21.3812H15.5375C17.2219 21.3812 18.5625 20.0062 18.5625 18.3562V3.64374C18.5625 1.95937 17.1875 0.618744 15.5375 0.618744Z"
              fill=""
            />
            <path
              d="M6.05001 11.7563H12.2031C12.6156 11.7563 12.9594 11.4125 12.9594 11C12.9594 10.5875 12.6156 10.2438 12.2031 10.2438H6.08439L8.21564 8.07813C8.52501 7.76875 8.52501 7.2875 8.21564 6.97812C7.90626 6.66875 7.42501 6.66875 7.11564 6.97812L3.67814 10.4844C3.36876 10.7938 3.36876 11.275 3.67814 11.5844L7.11564 15.0906C7.25314 15.2281 7.45939 15.3312 7.66564 15.3312C7.87189 15.3312 8.04376 15.2625 8.21564 15.125C8.52501 14.8156 8.52501 14.3344 8.21564 14.025L6.05001 11.7563Z"
              fill=""
            />
          </svg>
          Đăng xuất
        </button>
      </div>

      {/* Modal đổi mật khẩu */}
      <Modal
        open={isShowModalChangePass}
        onCancel={() => setIsShowModalChangePass(false)}
        footer={null}
        okText="Xác nhận"
        cancelText="Đóng"
        title="Thay đổi mật khẩu"
        destroyOnClose
        centered
      >
        <Form layout="vertical" onFinish={handleChangePassword}>
          <Form.Item label="Mật khẩu cũ" name="oldPassword" className="mb-2">
            <Input.Password
              type="password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              placeholder="Nhập mật khẩu cũ"
            />
          </Form.Item>
          <Form.Item label="Mật khẩu mới" name="newPassword">
            <Input.Password
              type="password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              placeholder="Nhập mật khẩu mới"
            />
          </Form.Item>
          <Form.Item label="Nhập lại Mật khẩu mới" name="confirmPassword">
            <Input.Password
              type="password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              placeholder="Nhập laị mật khẩu mới"
            />
          </Form.Item>
          <div className="flex gap-3">
            <Button onClick={() => setIsShowModalChangePass(false)}>Huỷ</Button>
            <Button type="primary" htmlType="submit">
              Xác nhận
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default DropdownUser;
