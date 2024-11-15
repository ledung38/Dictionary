"use client";
import React, { FC, useState } from "react";
import Image from "next/image";
import Prev from "../UI/NextPrev/Prev";
import Next from "../UI/NextPrev/Next";
import useInterval from "react-use/lib/useInterval";
import useBoolean from "react-use/lib/useBoolean";
import ButtonPrimary from "../UI/Button/ButtonPrimary";

export interface SectionHero2Props {
  className?: string;
}

interface Hero2DataType {
  headingImg?: string;
  image: string;
  heading: string;
  subHeading: string;
  btnText: string;
  btnLink?: string;
}

let TIME_OUT: NodeJS.Timeout | null = null;

export const HERO2_DEMO_DATA: Hero2DataType[] = [
  {
    headingImg: "/images/study/heading-study-school.svg",
    image: "/images/study/heading-study-school.svg",
    subHeading: "Học tập",
    heading: "Học tập theo lớp học",
    btnText: "Lớp học",
    btnLink: "/study/room",
  },
  {
    headingImg: "/images/study/heading-study-topic.svg",
    image: "/images/study/study-topics.svg",
    subHeading: "Học tập",
    heading: "Học tập theo chủ đề",
    btnText: "Chủ đề",
    btnLink: "/study/topics",
  },
  {
    image: "/images/study/study-vocabulary.svg",
    subHeading: "Học tập",
    heading: "Học tập theo từ vựng",
    btnText: "Từ điển học liệu",
    btnLink: "/study/vocabulary",
  },
  {
    image: "/images/study/heading-study-alphabet.svg",
    subHeading: "Học tập",
    heading: "Học tập theo bảng chữ cái",
    btnText: "Chữ cái",
    btnLink: "/study/alphabet",
  },
  {
    image: "/images/study/heading-study-alphanumeric.svg",
    subHeading: "Học tập",
    heading: "Học tập theo bảng chữ số",
    btnText: "Chữ số",
    btnLink: "/study/alphanumeric",
  },
];

const HomePage: FC<SectionHero2Props> = ({ className = "" }) => {
  // =================
  const [indexActive, setIndexActive] = useState(0);
  const [isRunning, toggleIsRunning] = useBoolean(true);

  useInterval(
    () => {
      handleAutoNext();
    },
    isRunning ? 5500 : null,
  );
  //

  const handleAutoNext = () => {
    setIndexActive((state) => {
      if (state >= HERO2_DEMO_DATA.length - 1) {
        return 0;
      }
      return state + 1;
    });
  };

  const handleClickNext = () => {
    setIndexActive((state) => {
      if (state >= HERO2_DEMO_DATA.length - 1) {
        return 0;
      }
      return state + 1;
    });
    handleAfterClick();
  };

  const handleClickPrev = () => {
    setIndexActive((state) => {
      if (state === 0) {
        return HERO2_DEMO_DATA.length - 1;
      }
      return state - 1;
    });
    handleAfterClick();
  };

  const handleAfterClick = () => {
    toggleIsRunning(false);
    if (TIME_OUT) {
      clearTimeout(TIME_OUT);
    }
    TIME_OUT = setTimeout(() => {
      toggleIsRunning(true);
    }, 1000);
  };
  // =================

  const renderItem = (index: number) => {
    const isActive = indexActive === index;
    const item = HERO2_DEMO_DATA[index];
    if (!isActive) {
      return null;
    }
    return (
      <div
        className={`nc-SectionHero2Item nc-SectionHero2Item--animation relative flex flex-col-reverse overflow-hidden lg:flex-col ${className}`}
        key={index}
      >
        <div className="absolute bottom-4 start-1/2 z-20 flex -translate-x-1/2 justify-center rtl:translate-x-1/2">
          {HERO2_DEMO_DATA.map((_, index) => {
            const isActive = indexActive === index;
            return (
              <div
                key={index}
                onClick={() => {
                  setIndexActive(index);
                  handleAfterClick();
                }}
                className={`relative cursor-pointer px-1 py-1.5`}
              >
                <div
                  className={`relative h-1 w-20 rounded-md bg-white shadow-sm`}
                >
                  {isActive && (
                    <div
                      className={`nc-SectionHero2Item__dot absolute inset-0 rounded-md bg-slate-900 ${
                        isActive ? " " : " "
                      }`}
                    ></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <Prev
          className="absolute start-1 top-3/4 z-10 !text-slate-700 sm:start-5 sm:top-1/2 sm:-translate-y-1/2"
          btnClassName="w-12 h-12 hover:border-slate-400 dark:hover:border-slate-400"
          svgSize="w-6 h-6"
          onClickPrev={handleClickPrev}
        />
        <Next
          className="absolute end-1 top-3/4 z-10 !text-slate-700 sm:end-5 sm:top-1/2 sm:-translate-y-1/2"
          btnClassName="w-12 h-12 hover:border-slate-400 dark:hover:border-slate-400"
          svgSize="w-6 h-6"
          onClickNext={handleClickNext}
        />

        {/* BG */}
        <div className="absolute inset-0 bg-[#E3FFE6]">
          <Image
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="absolute h-full w-full object-contain"
            src="/images/study/Moon.svg"
            alt="hero"
          />
        </div>

        <div className="container relative px-16 pb-0 pt-14 sm:pt-20 lg:py-44">
          <div
            className={`nc-SectionHero2Item__left relative z-[1] w-full max-w-3xl space-y-8 sm:space-y-14`}
          >
            <div className="space-y-5 sm:space-y-6">
              <span className="nc-SectionHero2Item__subheading block text-base font-medium text-slate-700 md:text-xl">
                {item.subHeading}
              </span>
              <h2 className="nc-SectionHero2Item__heading text-4xl font-semibold !leading-[114%] text-slate-900 ">
                {item.heading}
              </h2>
            </div>

            <ButtonPrimary
              className="nc-SectionHero2Item__button dark:bg-slate-900"
              sizeClass="py-3 px-6 sm:py-5 sm:px-9"
              href={item.btnLink}
            >
              <span className="text-xl">{item.btnText}</span>
              <span className="pl-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="2em"
                  height="2em"
                  viewBox="0 0 48 48"
                >
                  <defs>
                    <mask id="ipTNext0">
                      <path
                        fill="#555"
                        fillRule="evenodd"
                        stroke="#fff"
                        stroke-linejoin="round"
                        d="M4 40.836c4.893-5.973 9.238-9.362 13.036-10.168c3.797-.805 7.412-.927 10.846-.365V41L44 23.545L27.882 7v10.167c-6.349.05-11.746 2.328-16.192 6.833C7.246 28.505 4.682 34.117 4 40.836Z"
                        clip-rule="evenodd"
                      />
                    </mask>
                  </defs>
                  <path
                    fill="currentColor"
                    d="M0 0h48v48H0z"
                    mask="url(#ipTNext0)"
                  />
                </svg>
              </span>
            </ButtonPrimary>
          </div>
          <div className="bottom-0 end-0 top-0 mt-10 w-full max-w-2xl lg:absolute lg:mt-0 xl:max-w-3xl 2xl:max-w-4xl rtl:-end-28">
            <Image
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="nc-SectionHero2Item__image h-full w-[90%] object-contain object-right-bottom"
              src={item.image}
              alt={item.heading}
              priority
            />
          </div>
        </div>
      </div>
    );
  };

  return <>{HERO2_DEMO_DATA.map((_, index) => renderItem(index))}</>;
};

export default HomePage;
