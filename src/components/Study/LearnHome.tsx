"use client";
import StudySelect from "@/components/Study/StudySelect";
import { RootState } from "@/store";
import { Image } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function LearnHome({ isAlphabet }: any) {
  const slides = isAlphabet
    ? Array.from({ length: 26 }).map((_, index) => ({
        url: `/images/study/${String.fromCharCode(65 + index)}.webp`,
      }))
    : Array.from({ length: 9 }).map((_, index) => ({
        url: `/1-9/${index + 1}.webp`,
      }));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const setting = useSelector((state: RootState) => state.setting);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (autoplay) {
        const newIndex = (currentIndex + 1) % slides.length;
        setCurrentIndex(newIndex);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [currentIndex, autoplay, slides.length]);
  const goToSlide = (slideIndex: React.SetStateAction<number>) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <>
      {/* Lựa chọn hình thức học tập */}
      {!setting.openSideBar && <StudySelect />}

      <div className="flex w-full flex-col items-center justify-center">
        <h1 className="mb-4 pt-12 text-center text-2xl font-bold">
          Bảng chữ cái ngôn ngữ ký hiệu tiếng Việt
        </h1>
        <div className="group relative m-auto flex w-full justify-center gap-4 px-4">
          {slides
            ?.slice(currentIndex, currentIndex + 3)
            .map((item, index) => (
              <Image
                key={index}
                src={item.url}
                alt=""
                className="rounded-2xl bg-cover bg-center object-contain duration-500"
                preview={false}
              />
            ))}
          <div className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 transform space-x-2">
            {slides.map((slide, index) => (
              <div
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 w-2 cursor-pointer rounded-full ${
                  currentIndex === index ? "bg-slate-300" : "bg-slate-500"
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default LearnHome;
