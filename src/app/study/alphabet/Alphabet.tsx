"use client";
import LearnHome from "@/components/Study/LearnHome";
import StudyComponent from "@/components/Study/StudyComponent";
import Learning from "@/model/Learning";
import { useMutation } from "@tanstack/react-query";
import { Empty, Image, message } from "antd";
import React, { useEffect, useState } from "react";
import { A_Z } from "../../../../public/A-Z";

export interface letter {
  name: string;
  image: string;
}

const letters = [
  "All",
  ...(function (start, end) {
    const arr = [];
    for (let i = start.charCodeAt(0); i <= end.charCodeAt(0); i++) {
      arr.push(String.fromCharCode(i));
    }
    return arr;
  })("A", "Z"),
];

const ListAlphabet = Array.from({ length: 26 }).map((_, index) => ({
  name: String.fromCharCode(65 + index),
  image: `/images/study/${String.fromCharCode(65 + index)}.webp`,
})) as letter[];

const ProjectItems = ({ item }: { item: letter }) => {
  return (
    <div className="flex justify-center">
      <Image
        style={{ width: 120 }}
        className="mb-2  rounded-lg "
        src={item.image}
        alt=""
      />
    </div>
  );
};

const Projects: React.FC = () => {
  const [alphabet, setAlphabet] = useState<string>("All");
  const [lstLetter, setLstLetter] = useState<letter[]>([]);
  const [active, setActive] = useState<number>(0);
  const [recordLstAlphabet, setRecordLstAlphabet] = useState([]);

  const mutation = useMutation({
    mutationFn: Learning.getAlphabet,
    onSuccess: (res) => {
      setRecordLstAlphabet(res.data);
    },
    onError: () => {
      setRecordLstAlphabet([]);
      message.warning(`Không có dữ liệu theo từ ${alphabet} `);
    },
  });

  useEffect(() => {
    if (alphabet === "All") {
      setLstLetter(ListAlphabet);
    } else {
      const newLstAlphabet = ListAlphabet.filter(
        (item) => item.name === alphabet,
      );
      setLstLetter(newLstAlphabet);
    }
  }, [alphabet]);

  const handleClick = (e: any, index: number) => {
    setAlphabet(e);
    mutation.mutate({ content: e });
    setActive(index);
  };

  return (
    <div className="">
      <div className="flex w-full justify-center">
        <div className="mb-8 flex w-[800px] flex-wrap items-center justify-center space-x-2">
          {letters.map((item, index) => (
            <span
              onClick={(e) => handleClick(item, index)}
              key={index}
              className={`${active === index ? "bg-gray-800 text-primary" : ""} cursor-pointer rounded px-2 py-1 text-2xl capitalize hover:bg-slate-800 hover:text-white`}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
      {alphabet === "All" && <LearnHome isAlphabet />}
      {/* {alphabet === "All" ? (
        <LearnHome isAlphabet />
      ) : (
        <div className="grid justify-center gap-8 ">
          {lstLetter?.length ? (
            lstLetter.map((item) => (
              <ProjectItems item={item} key={item.name} />
            ))
          ) : (
            <Empty description="Không có dữ liệu" />
          )}
        </div>
      )} */}

      {/* API trả ra kết quả */}
      {recordLstAlphabet?.length ? (
        <StudyComponent allVocabulary={recordLstAlphabet} />
      ) : null}
    </div>
  );
};

export default Projects;
