import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import StudentList from "./StudentList";

export const metadata: Metadata = {
  title: "Management-student  - Dictionary",
  description: "Management-student page for Dictionary",
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
      <StudentList />
    </DefaultLayout>
  );
};

export default ManagementClassPage;
