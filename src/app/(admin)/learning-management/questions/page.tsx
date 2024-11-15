import Chart from "@/components/Charts/page";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import QuestionList from "./QuestionList";

export const metadata: Metadata = {
  title: "Questions-management - Dictionary",
  description: "Questions-management page for We_sign",
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

const ManagementQuestions: React.FC = () => {
  return (
    <DefaultLayout>
      <QuestionList />
    </DefaultLayout>
  );
};

export default ManagementQuestions;
