import Chart from "@/components/Charts/page";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import TopicList from "../TopicList";

export const metadata: Metadata = {
  title: "Management-topics  - Dictionary",
  description: "Management-topics page for We_sign",
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

const ManagementTopicsPage: React.FC = () => {
  return (
    <DefaultLayout>
      <TopicList isPrivate />
    </DefaultLayout>
  );
};

export default ManagementTopicsPage;
