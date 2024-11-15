import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Metadata } from "next";
import React from "react";
import LearnHome from "../../../components/Study/LearnHome";
import Projects from "./Alphabet";

export const metadata: Metadata = {
  title: "LearnAlphabet - Dictionary",
  description: "LearnAlphabet page for We_sign",
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
const LearnAlphabet = () => {
  return (
    <DefaultLayout>
      <Projects />
    </DefaultLayout>
  );
};

export default LearnAlphabet;
