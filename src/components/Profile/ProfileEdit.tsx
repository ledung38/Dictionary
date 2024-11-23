"use client";
import Breadcrumb from "@/components/UI/Breadcrumbs/Breadcrumb";
import User from "@/model/User";
import { RootState } from "@/store";
import { login } from "@/store/slices/adminSlice";
import { validateRequireInput } from "@/utils/validation/validtor";
import { Button, DatePicker, Form, Input, Select, message } from "antd";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AvatarUpload } from "../UI/Upload/AvatarUpload";

const ProfileEdit = () => {
  const [form] = useForm();
  const router = useRouter();
  const user: User = useSelector((state: RootState) => state.admin);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.birthDay) {
      form.setFieldsValue({
        ...user,
        birthDay: dayjs(user?.birthDay),
      });
    } else {
      form.setFieldsValue({
        ...user,
        birthDay: null,
      });
    }
  }, [user]);

  return (
    <div className="mx-auto max-w-242.5 pb-4">
      <Breadcrumb
        pageName="Thông tin cá nhân"
        itemBreadcrumb={[
          { pathName: "/", name: "Trang chủ" },
          { pathName: "/profile", name: "Thông tin cá nhân" },
          { pathName: "#", name: "Chỉnh sửa thông tin cá nhân" },
        ]}
      />

      <div className="overflow-hidden rounded-sm border border-stroke bg-white pb-4 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="relative z-20 h-35 md:h-65">
          <Image
            src={"/images/cover/cover-01.png"}
            alt="profile cover"
            className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
            width={970}
            height={260}
            style={{
              width: "auto",
              height: "auto",
            }}
          />
          <div className="xsm:bottom-4 xsm:right-4 absolute bottom-1 right-1 z-10">
            <label
              htmlFor="cover"
              className="xsm:px-4 flex cursor-pointer items-center justify-center gap-2 rounded bg-primary px-2 py-1 text-sm font-medium text-white hover:bg-opacity-80"
            >
              <input type="file" name="cover" id="cover" className="sr-only" />
              <span>
                <svg
                  className="fill-current"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.101 13.4874 3.42919C13.8156 3.75738 14 4.2025 14 4.66663V11.0833C14 11.5474 13.8156 11.9925 13.4874 12.3207C13.1592 12.6489 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.6489 0.512563 12.3207C0.184375 11.9925 0 11.5474 0 11.0833V4.66663C0 4.2025 0.184374 3.75738 0.512563 3.42919C0.840752 3.101 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27837 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72163 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z"
                    fill="white"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.99992 5.83329C6.03342 5.83329 5.24992 6.61679 5.24992 7.58329C5.24992 8.54979 6.03342 9.33329 6.99992 9.33329C7.96642 9.33329 8.74992 8.54979 8.74992 7.58329C8.74992 6.61679 7.96642 5.83329 6.99992 5.83329ZM4.08325 7.58329C4.08325 5.97246 5.38909 4.66663 6.99992 4.66663C8.61075 4.66663 9.91659 5.97246 9.91659 7.58329C9.91659 9.19412 8.61075 10.5 6.99992 10.5C5.38909 10.5 4.08325 9.19412 4.08325 7.58329Z"
                    fill="white"
                  />
                </svg>
              </span>
            </label>
          </div>
        </div>

        <Form
          form={form}
          onFinish={async (value) => {
            try {
              const newValue = {
                ...value,
                birthDay: dayjs(value.birthDay).format("YYYY-MM-DD"),
              };
              await User.updateProfile(newValue);
              message.success("Cập nhật thành công");
              const response = await User.getProfile();
              dispatch(login(response));
              router.push("/profile");
            } catch (error: any) {
              console.log("error", error);
              message.error(error?.data?.message);
            }
          }}
          layout="vertical"
          className="mx-auto max-w-[400px] py-4"
        >
          <div className="relative z-30 mx-auto -mt-22 h-44 w-full max-w-44 rounded-full p-3  ">
            <div className="relative drop-shadow-2">
              <AvatarUpload
                size={160}
                value={user.avatarLocation}
                listType="picture-circle"
                onChange={async (value) => {
                  const res = await User.updateProfile({
                    avatarLocation: value,
                  });
                  const response = await User.getProfile();
                  dispatch(login(response));
                  message.success("Cập nhật avatar thành công");
                }}
              />
            </div>
          </div>
          <Form.Item
            required
            rules={[validateRequireInput("Họ tên không được bỏ trống")]}
            label="Họ tên"
            className="mb-0"
            name="name"
          >
            <Input size="large" placeholder="Nhập họ và tên" />
          </Form.Item>
          <Form.Item label="Số điện thoại" className="mb-0" name="phoneNumber">
            <Input size="large" placeholder="Nhập số điện thoại" />
          </Form.Item>
          <Form.Item label="Ngày sinh" className="mb-0" name="birthDay">
            <DatePicker size="large" format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item label="Giới tính" className="mb-0" name="gender">
            <Select
              size="large"
              options={[
                {
                  label: "Nam",
                  value: "MALE",
                },
                {
                  label: "Nữ",
                  value: "FEMALE",
                },
              ]}
              placeholder="Chọn giới tính"
            />
          </Form.Item>
          <Form.Item label="Địa chỉ" className="mb-0" name="address">
            <Input size="large" placeholder="Địa chỉ" />
          </Form.Item>
          <div className=" mt-8 flex justify-center gap-4">
            <Button onClick={() => router.back()}>Huỷ</Button>
            <Button type="primary" htmlType="submit">
              Xác nhận
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ProfileEdit;
