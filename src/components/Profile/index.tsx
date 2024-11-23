"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/UI/Breadcrumbs/Breadcrumb";
import { RootState } from "@/store";
import { Avatar, message } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { VALUE_GENDER } from "../common/constants";
import { useRouter } from "next/navigation";
import {
  CalendarOutlined,
  MailOutlined,
  ManOutlined,
  PhoneOutlined,
  WomanOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { AvatarUpload } from "../UI/Upload/AvatarUpload";
import User from "@/model/User";
import { login } from "@/store/slices/adminSlice";

const Profile = () => {
  const router = useRouter();
  const user: User = useSelector((state: RootState) => state.admin);
  const dispatch = useDispatch();

  return (
    <div className="mx-auto max-w-242.5">
      <Breadcrumb
        pageName="Thông tin cá nhân"
        itemBreadcrumb={[
          { pathName: "/", name: "Trang chủ" },
          { pathName: "#", name: "Thông tin cá nhân" },
        ]}
      />

      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
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
          <div
            className="xsm:bottom-4 xsm:right-4 absolute bottom-1 right-1 z-10"
            onClick={() => router.push(`/profile/${user.userId}`)}
          >
            <label
              htmlFor="cover"
              className="xsm:px-4 flex cursor-pointer items-center justify-center gap-2 rounded bg-primary px-2 py-1 text-sm font-medium text-white hover:bg-opacity-80"
            >
              <span>Chỉnh sửa</span>
            </label>
          </div>
        </div>
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="relative z-30 mx-auto -mt-22 h-44 w-full max-w-44 rounded-full p-3  ">
            <div className="relative drop-shadow-2">
              <AvatarUpload
                size={160}
                value={user?.avatarLocation}
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
          <div className="mt-4">
            <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
              {user?.name}
            </h3>
            <p className="font-medium">
              {user?.address || "Chưa có thông tin"}
            </p>

            <div className="mx-auto mt-4 max-w-[460px]">
              <h4 className="font-semibold text-black dark:text-white">
                Thông tin cơ bản
              </h4>

              <div className="mt-4 flex items-center gap-3 ">
                <div className="flex w-1/3 items-center gap-2">
                  <MailOutlined style={{ fontSize: 16, marginTop: "1px" }} />
                  <p className="text-gray-500 dark:text-gray-400 mr-2 text-sm font-medium">
                    Email
                  </p>
                </div>
                <p className="text-black dark:text-white">{user?.email}</p>
              </div>

              <div className="my-2 flex items-center gap-3 ">
                <div className="flex w-1/3 items-center gap-2">
                  <PhoneOutlined style={{ fontSize: 16, marginTop: "1px" }} />
                  <p className="text-gray-500 dark:text-gray-400 mr-2 text-sm font-medium">
                    Số điện thoại
                  </p>
                </div>
                <p className="text-black dark:text-white">
                  {user?.phoneNumber || "Chưa có thông tin"}
                </p>
              </div>

              <div className="my-2 flex items-center gap-3 ">
                <div className="flex w-1/3 items-center gap-2">
                  {user?.gender === "MALE" ? (
                    <ManOutlined style={{ fontSize: 16, marginTop: "1px" }} />
                  ) : (
                    <WomanOutlined style={{ fontSize: 16, marginTop: "1px" }} />
                  )}{" "}
                  <p className="text-gray-500 dark:text-gray-400 mr-2 text-sm font-medium">
                    Giới tính
                  </p>
                </div>
                <p className="text-black dark:text-white">
                  {VALUE_GENDER[user?.gender] || "Chưa có thông tin"}
                </p>
              </div>

              <div className="my-2 flex items-center gap-3 ">
                <div className="flex w-1/3 items-center gap-2">
                  <CalendarOutlined
                    style={{ fontSize: 16, marginTop: "1px" }}
                  />
                  <p className="text-gray-500 dark:text-gray-400 mr-2 text-sm font-medium">
                    Năm sinh
                  </p>
                </div>
                <p className="text-black dark:text-white">
                  {user?.birthDay
                    ? moment(user?.birthDay).format("DD/MM/YYYY")
                    : "Chưa có thông tin"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
