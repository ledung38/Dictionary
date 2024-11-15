import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Metadata } from "next";
import React from "react";
import ExamListPage from "../ExamList";

export const metadata: Metadata = {
  title: "Management-exam - Dictionary",
  description: "Management-exam page for We_sign",
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

const ManagementExamPage: React.FC = () => {
  return (
    <DefaultLayout>
      <ExamListPage isPrivate={false} />
    </DefaultLayout>
  );
};

export default ManagementExamPage;
