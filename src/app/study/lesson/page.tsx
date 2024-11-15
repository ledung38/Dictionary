import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Metadata } from "next";
import React from "react";
import Lesson from "./Lesson";

export const metadata: Metadata = {
  title: "Lesson - Dictionary",
  description: "Lesson page for We_sign",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/favicon.ico",
        href: "/favicon.ico",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/favicon.ico",
        href: "/favicon.ico",
      },
    ],
  },
};

const LearnVocabulary = () => {
  return (
    <DefaultLayout>
      <Lesson />
    </DefaultLayout>
  );
};

export default LearnVocabulary;
