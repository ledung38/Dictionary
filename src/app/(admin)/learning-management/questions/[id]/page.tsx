import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Metadata } from "next";
import React from "react";
import QuestionEdit from "./QuestionEdit";

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

const ManagementAddQuestions: React.FC = () => {
  return (
    <DefaultLayout>
      <QuestionEdit />
    </DefaultLayout>
  );
};

export default ManagementAddQuestions;