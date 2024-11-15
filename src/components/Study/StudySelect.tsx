import { colors } from "@/assets/colors";
import {
  AlphabetIcon,
  NumberIcon,
  ParagraphIcon,
  RoomIcon,
  SentenceIcon,
  TopicIcon,
  VocabularyIcon,
} from "@/assets/icons";
import { Tooltip } from "antd";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const iconsData = [
  {
    icon: <RoomIcon size={38} color={colors.green500} />,
    tooltipText: "Theo lớp học",
    link: "/study/room",
  },
  {
    icon: <TopicIcon size={38} />,
    tooltipText: "Chủ đề",
    link: "/study/topics",
  },
  {
    icon: <VocabularyIcon size={38} color={colors.yellow900} />,
    tooltipText: "Từ vựng",
    link: "/study/vocabulary",
  },
  {
    icon: <SentenceIcon size={38} color={colors.green400} />,
    tooltipText: "Câu",
    link: "/study/sentence",
  },
  {
    icon: <ParagraphIcon size={38} color={colors.black1000} />,
    tooltipText: "Đoạn",
    link: "/study/paragraph",
  },
  {
    icon: <AlphabetIcon size={38} color={colors.primary600} />,
    tooltipText: "Bảng chữ cái",
    link: "/study/alphabet",
  },
  {
    icon: <NumberIcon size={38} color={colors.green600} />,
    tooltipText: "Bảng chữ số",
    link: "/study/alphanumeric",
  },
];

const StudySelect: React.FC = () => {
  const router = useRouter();
  const pathName = usePathname();
  return (
    <div className="flex items-center justify-center gap-4">
      {iconsData.map((item) => (
        <div key={item.tooltipText} className="relative">
          <Tooltip placement="top" title={<span>{item.tooltipText}</span>}>
            <div
              className={`rounded-xl  px-2 py-1 hover:cursor-pointer ${pathName?.includes(item.link) ? "bg-neutral-200" : ""} `}
              onClick={() => router.push(item.link)}
            >
              {item.icon}
            </div>
          </Tooltip>
        </div>
      ))}
    </div>
  );
};

export default StudySelect;
