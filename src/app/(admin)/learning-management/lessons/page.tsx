import Chart from "@/components/Charts/page";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import LessonList from "./LessonList";

export const metadata: Metadata = {
  title: "Management-class  - Dictionary",
  description: "Management-class page for We_sign",
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
      <LessonList />
    </DefaultLayout>
  );
};

export default ManagementClassPage;
