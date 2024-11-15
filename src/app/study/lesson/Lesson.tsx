"use client";
import { SearchIcon } from "@/assets/icons";
import InputPrimary from "@/components/UI/Input/InputPrimary";
import Learning from "@/model/Learning";
import { RootState } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { Spin, message, Modal, Image, Button, Carousel } from "antd";
import { FC, useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import styled from "styled-components";

export interface SectionHero2Props {
  className?: string;
}

const CustomSlider = styled(Carousel)`
  &.ant-carousel {
    width: 100%;
  }
  .slick-slide.slick-active.slick-current {
    display: flex;
    justify-content: center;
  }
`;

const Lesson: FC<SectionHero2Props> = ({ className = "" }) => {
  const user: User = useSelector((state: RootState) => state.admin);
  const [filterParams, setFilerParams] = useState<{
    topicId?: number;
    isPrivate?: boolean;
    contentSearch?: string;
  }>({});
  const [showFileDetail, setShowFileDetail] = useState(false);
  const [fileIndex, setFileIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videoCurrent, setVideoCurrent] = useState<any>();
  const videoRef = useRef<any>(null);
  const slider = useRef<any>(null);
  const [autoplayEnabled, setAutoplay] = useState(false);

  // Fetching the list of lessons
  const { data: allLessons, isFetching } = useQuery({
    queryKey: ["getListLessons", filterParams],
    queryFn: async () => {
      const res = await Learning.getListLessons({
        ...filterParams,
        isPrivate: user.role === "USER" && "false",
      });
      if (!res?.data?.length) {
        message.warning("Không có kết quả tìm kiếm");
        return;
      }
      return res.data as Lesson[];
    },
  });

  useEffect(() => {
    if (showFileDetail) {
      setAutoplay(true);
      const firstVideo = allLessons?.[fileIndex]?.video?.[0]?.videoLocation;
      setVideoCurrent(firstVideo || null);
      setCurrentVideoIndex(0);
    }
  }, [showFileDetail, fileIndex, allLessons]);

  const handleNextVideo = () => {
    const nextIndex = currentVideoIndex + 1;
    if (allLessons?.[fileIndex]?.video && nextIndex < allLessons[fileIndex].video.length) {
      setCurrentVideoIndex(nextIndex);
      setAutoplay(true);
      setVideoCurrent(allLessons[fileIndex].video[nextIndex].videoLocation);
    }
  };

  const handlePreviousVideo = () => {
    const previousIndex = currentVideoIndex - 1;
    if (allLessons?.[fileIndex]?.video && previousIndex >= 0) {
      setCurrentVideoIndex(previousIndex);
      setAutoplay(true);
      setVideoCurrent(allLessons[fileIndex].video[previousIndex].videoLocation);
    }
  };

  const handleViewDetail = (index: number) => {
    setFileIndex(index);
    setShowFileDetail(true);
  };

  const onCloseDetail = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setAutoplay(false);
    setVideoCurrent(null);
    setShowFileDetail(false);
  };

  return (
    <Spin spinning={isFetching}>
      <div className="flex w-full gap-4">
        <InputPrimary
          allowClear
          className="relative mb-4"
          style={{ width: 400 }}
          placeholder="Tìm kiếm bài học"
          value={filterParams?.contentSearch}
          onChange={(e) => {
            setFilerParams({
              ...filterParams,
              contentSearch: e.target.value,
            });
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setFilerParams({
                ...filterParams,
                contentSearch: e.currentTarget.value,
              });
            }
          }}
          suffixIcon={<SearchIcon size={24} />}
          onSuffixClick={(value) => {
            setFilerParams({ ...filterParams, contentSearch: value });
          }}
          onClear={() => {
            setFilerParams({ ...filterParams, contentSearch: "" });
          }}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {allLessons &&
          allLessons?.length > 0 &&
          allLessons?.map((item: any, i: number) => {
            return (
              <div key={i} style={{ height: "max-content" }}>
                <div
                  key={i}
                  className=" border-gray-300 group relative flex h-40 items-center  overflow-hidden rounded-lg border bg-cover bg-center bg-no-repeat object-contain  hover:shadow-3"
                  style={{
                    backgroundImage: `url(${
                      item?.image?.[0]?.imageLocation !== ""
                        ? item?.image?.[0]?.imageLocation
                        : "/images/study/defaultvideo.png"
                    })`,
                    backgroundSize: "contain",
                    backgroundPosition: "center center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <div className="absolute right-0 top-0 h-full w-full translate-x-0 transform bg-neutral-50 bg-opacity-75 transition-transform duration-500 hover:translate-x-30 group-hover:-translate-x-[100%]">
                    <p className="ml-2 line-clamp-2 py-2 text-2xl font-semibold text-black">
                      {item?.content}
                    </p>
                  </div>
                  <button
                    className="absolute right-0 flex h-full w-full translate-x-[100%] items-center justify-center bg-black bg-opacity-50 text-white  duration-500 group-hover:translate-x-0"
                    onClick={() => handleViewDetail(i)}
                  >
                    Bấm để xem!!!
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      {/* modal hiển thị thông tin bài học */}
      <Modal
        open={showFileDetail}
        footer={null}
        onCancel={onCloseDetail}
        title={
          <div className="line-clamp-1 text-[32px] font-bold">
            {allLessons?.[fileIndex]?.content}
          </div>
        }
        width={1420}
        key={allLessons?.[fileIndex]?.content}
        centered
      >
        <div className="w-full px-4  ">
          <div className="w-full ">
            <div className="grid grid-cols-3 items-center gap-3">
              {/* image */}
              <CustomSlider
                ref={slider}
                className=" flex w-full items-center justify-center"
                dots={false}
              >
                {allLessons &&
                  allLessons[fileIndex]?.image?.map(
                    (
                      item: { imageLocation: string | undefined },
                      index: React.Key | null | undefined,
                    ) => (
                      <div key={index}>
                        {item.imageLocation ? (
                          <div className="text-center">
                            <Image
                              preview={false}
                              src={item.imageLocation}
                              alt="imageLocation"
                              className="flex max-h-[400px] w-[400px] items-center justify-center object-scale-down "
                            />
                          </div>
                        ) : (
                          <div className="text-center text-xl">
                            Chưa có hình ảnh minh hoạ
                          </div>
                        )}
                      </div>
                    ),
                  )}
              </CustomSlider>

              {/* video */}
              <div className="col-span-2">
                {videoCurrent ? (
                  <video
                    key={videoCurrent}
                    controls
                    ref={videoRef}
                    autoPlay={autoplayEnabled}
                    style={{ width: "100%", height: 550 }}
                    onEnded={() => setAutoplay(false)}
                  >
                    <source src={videoCurrent} type="video/mp4" />
                  </video>
                ) : (
                  <div className="text-center text-xl">
                    Chưa có video minh hoạ
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between px-4">
          <div className="flex w-1/3 justify-center">
            <Button
              style={{
                display:
                  allLessons?.[fileIndex]?.image?.length < 2
                    ? "none"
                    : "block",
              }}
              icon={<LeftOutlined />}
              onClick={() => slider.current.prev()}
            />
            <Button
              style={{
                display:
                  allLessons?.[fileIndex]?.image?.length < 2
                    ? "none"
                    : "block",
              }}
              icon={<RightOutlined />}
              onClick={() => slider.current.next()}
            />
          </div>
          <div className="mt-4 flex w-2/3 justify-center">
            <Button
              style={{ display: currentVideoIndex === 0 ? "none" : "block" }}
              icon={<LeftOutlined />}
              onClick={handlePreviousVideo}
            />
            <Button
              style={{
                display:
                  currentVideoIndex ===
                  allLessons?.[fileIndex]?.video?.length - 1
                    ? "none"
                    : "block",
              }}
              icon={<RightOutlined />}
              onClick={handleNextVideo}
            />
          </div>
        </div>
      </Modal>
    </Spin>
  );
};

export default Lesson;