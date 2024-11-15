"use client";
import LearnHome from "@/components/Study/LearnHome";
import StudyComponent from "@/components/Study/StudyComponent";
import Learning from "@/model/Learning";
import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import React, { useEffect, useState } from "react";

export interface letter {
  name: string;
  image: string;
}

const numbers = ["All", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const ListAlphanumeric = [] as letter[];

const Alphanumeric: React.FC = () => {
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
      message.warning(`Không có dữ liệu theo số ${alphabet} `);
    },
  });

  useEffect(() => {
    if (alphabet === "All") {
      setLstLetter(ListAlphanumeric);
    } else {
      const newLstAlphabet = ListAlphanumeric.filter(
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
          {numbers.map((item, index) => (
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
      {alphabet === "All" ? (
        <LearnHome />
      ) : (
        <StudyComponent allVocabulary={recordLstAlphabet || []} />
      )}
    </div>
  );
};

export default Alphanumeric;
