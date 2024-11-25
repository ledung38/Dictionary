import { DotIcon, RequestIcon } from "@/assets/icons";
import { AdminIcon } from "@/assets/icons/AdminIcon";
import { MobileOutlined } from "@ant-design/icons";

export const AdminSystem = (admin: any) => {
  const menu = admin
    ? [
        {
          key: "/learning-management",
          label: "Quản lý học liệu",
          path: "/learning-management",
          icon: <AdminIcon color="white" size={20} />,
          children: [
            {
              key: "/learning-management/class",
              label: "Lớp học",
              path: "/learning-management/class",
              hidden: false,
              icon: <DotIcon color="white" size={20} />,
            },
            {
              key: "/learning-management/student",
              label: "Học sinh",
              path: "/learning-management/student",
              hidden: false,
              icon: <DotIcon color="white" size={20} />,
            },
            {
              key: "/learning-management/topics",
              label: "Chủ đề ",
              path: "/learning-management/topics",
              icon: <DotIcon color="white" size={20} />,
              children: [
                {
                  key: "/learning-management/topics/public",
                  label: "Chung",
                  path: "/learning-management/topics/public",
                  hidden: false,
                  icon: <DotIcon color="white" size={20} />,
                },
                {
                  key: "/learning-management/topics/private",
                  label: "Riêng",
                  path: "/learning-management/topics/private",
                  hidden: false,
                  icon: <DotIcon color="white" size={20} />,
                },
              ],
              hidden: false,
            },
            {
              key: "/learning-management/lessons",
              label: "Bài học",
              path: "/learning-management/lessons",
              hidden: false,
              icon: <DotIcon color="white" size={20} />,
            },
            {
              key: "/learning-management/vocabulary",
              label: "Từ điển",
              path: "/learning-management/vocabulary",
              hidden: false,
              icon: <DotIcon color="white" size={20} />,
              children: [
                {
                  key: "/learning-management/vocabulary/public",
                  label: "Chung",
                  path: "/learning-management/vocabulary/public",
                  hidden: false,
                  icon: <DotIcon color="white" size={20} />,
                },
                {
                  key: "/learning-management/vocabulary/private",
                  label: "Riêng",
                  path: "/learning-management/vocabulary/private",
                  hidden: false,
                  icon: <DotIcon color="white" size={20} />,
                },
              ],
            },
            {
              key: "/learning-management/questions",
              label: "Câu hỏi",
              path: "/learning-management/questions",
              hidden: false,
              icon: <DotIcon color="white" size={20} />,
            },
            {
              key: "/learning-management/check-list",
              label: "Bài kiểm tra ",
              path: "/learning-management/check-list",
              hidden: false,
              icon: <DotIcon color="white" size={20} />,
              children: [
                {
                  key: "/learning-management/check-list/public",
                  label: "Chung",
                  path: "/learning-management/check-list/public",
                  hidden: false,
                  icon: <DotIcon color="white" size={20} />,
                },
                {
                  key: "/learning-management/check-list/private",
                  label: "Riêng",
                  path: "/learning-management/check-list/private",
                  hidden: false,
                  icon: <DotIcon color="white" size={20} />,
                },
              ],
            },
          ],
          hidden: false,
        },
        {
          key: "/approve-request",
          label: "Phê duyệt yêu cầu",
          path: "/approve-request",
          icon: <RequestIcon color="white" size={20} />,
          children: [
            {
              key: "/approve-request/data-collect",
              label: "Dữ liệu thu thập",
              path: "/approve-request/data-collect",
              hidden: !(admin?.role === "ADMIN"),
              icon: <DotIcon color="white" size={20} />,
            },
            {
              key: "/approve-request/account",
              label: "Tài khoản",
              path: "/approve-request/account",
              hidden: !(admin?.role === "ADMIN"),
              icon: <DotIcon color="white" size={20} />,
            },
            {
              key: "/approve-request/class",
              label: "Lớp học",
              path: "/approve-request/class",
              hidden: !(admin?.role === "ADMIN"),
              icon: <DotIcon color="white" size={20} />,
            },
          ],
          hidden: !(admin?.role === "ADMIN"),
        },
        {
          key: "/introduction-management",
          label: "Giới thiệu",
          path: "/introduction-management",
          icon: <MobileOutlined color="white" size={20} />,
          hidden: !(admin?.role === "ADMIN"),
        },
      ]
    : [];

  // Hàm đệ quy để lọc các mục có hidden = false và duyệt vào children
  const filterMenuItems = (items: any) => {
    return items?.reduce((acc: any, item: any) => {
      if (!item?.hidden) {
        const newItem = { ...item };
        if (newItem.children) {
          newItem.children = filterMenuItems(newItem?.children); // Đệ quy lọc các children
        }
        acc.push(newItem);
      }
      return acc;
    }, []);
  };

  const filteredMenu = filterMenuItems(menu);

  return filteredMenu;
};
