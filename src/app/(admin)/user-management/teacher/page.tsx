import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import TeacherList from "./TeacherList";

export const metadata: Metadata = {
  title: "Management-teacher  - Dictionary",
  description: "Management-teacher page for Dictionary",
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

const ManagementClassPage: React.FC = () => {
  return (
    <DefaultLayout>
      <TeacherList />
    </DefaultLayout>
  );
};

export default ManagementClassPage;
