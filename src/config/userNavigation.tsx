import {
  ChatIcon,
  CollectDataIcon,
  DashboardIcon,
  DotIcon,
  ExamIcon,
  PracticeIcon,
  StudyIcon,
} from "@/assets/icons";
import { Introduction } from "@/assets/icons/Introduction";
import { RootState, store } from "@/store";
import { UserOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

export const MenuSystem = () => {
  const admin = useSelector((state: RootState) => state.admin);

  return [
    {
      key: "/introduction",
      label: "Giới thiệu",
      path: "/introduction",
      icon: <Introduction color="white" size={20} />,
      hidden: false,
    },
    {
      key: "/dashboard",
      label: "Dashboard",
      path: "/dashboard",
      icon: <DashboardIcon />,
      hidden: false,
    },
    {
      key: "/student",
      label: "Học sinh",
      path: "/student",
      hidden: false,
      icon: <DashboardIcon />,
    },
    // {
    //   key: "/friend",
    //   label: "Bạn bè",
    //   path: "/friend",
    //   icon: <UserOutlined color="white" size={20} />,
    //   hidden: !admin,
    // },
    {
      key: "/study",
      label: "Học tập",
      path: "/study",
      icon: <StudyIcon color="white" size={20} />,
      children: [
        {
          key: "/study/room",
          label: "Lớp",
          path: "/study/room",
          hidden: false,
          icon: <DotIcon color="white" size={20} />,
        },
        {
          key: "/study/lesson",
          label: "Bài học",
          path: "/study/lesson",
          hidden: false,
          icon: <DotIcon color="white" size={20} />,
        },
        {
          key: "/study/vocabulary",
          label: "Từ điển học liệu",
          path: "/study/vocabulary",
          hidden: false,
          icon: <DotIcon color="white" size={20} />,
        },
        // {
        //   key: "/study/sentence",
        //   label: "Câu",
        //   path: "/study/sentence",
        //   hidden: false,
        //   icon: <DotIcon color="white" size={20} />,
        // },
        // {
        //   key: "/study/paragraph",
        //   label: "Đoạn",
        //   path: "/study/paragraph",
        //   hidden: false,
        //   icon: <DotIcon color="white" size={20} />,
        // },
        {
          key: "/study/alphabet",
          label: "Bảng chữ cái",
          path: "/study/alphabet",
          hidden: false,
          icon: <DotIcon color="white" size={20} />,
        },
        {
          key: "/study/alphanumeric",
          label: "Bảng chữ số",
          path: "/study/alphanumeric",
          hidden: false,
          icon: <DotIcon color="white" size={20} />,
        },
      ],
      hidden: false,
    },
    {
      key: "/chat",
      label: "Trò chuyện",
      path: "/chat",
      icon: <ChatIcon size={20} color="white" />,
      hidden: true,
    },
    {
      key: "/exam",
      label: "Kiểm tra",
      path: "/exam",
      icon: <ExamIcon color="white" size={20} />,
      hidden: !admin,
    },
    // {
    //   key: "/collect-data",
    //   label: "Thu thập dữ liệu",
    //   path: "/collect-data",
    //   icon: <CollectDataIcon color="white" size={20} />,
    //   hidden: !admin,
    // },
    {
      key: "/practice-data",
      label: "Luyện tập",
      path: "/practice-data",
      icon: <PracticeIcon color="white" size={20} />,
      hidden: false,
    },
  ].filter((item) => !item.hidden);
};
