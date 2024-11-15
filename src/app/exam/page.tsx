import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Metadata } from "next";
import React from "react";
import ExamListPage from "./ExamListPage";

export const metadata: Metadata = {
  title: "Exam - Dictionary",
  description: "Exam page for We_sign",
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

const ExamPage: React.FC = () => {
  return (
    <DefaultLayout>
      <ExamListPage />
    </DefaultLayout>
  );
};

export default ExamPage;
