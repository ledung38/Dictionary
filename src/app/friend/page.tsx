import Chart from "@/components/Charts/page";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import Friend from "@/components/Friend";

export const metadata: Metadata = {
  title: "Friend - Dictionary",
  description: "Friend page for We_sign",
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
const BasicChartPage: React.FC = () => {
  return (
    <DefaultLayout>
      <Friend />
    </DefaultLayout>
  );
};

export default BasicChartPage;
