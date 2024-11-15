import Chart from "@/components/Charts/page";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import FileMobile from "./FileMobile";

export const metadata: Metadata = {
  title: "FIle Mobile - Dictionary",
  description: "FIle Mobile page for We_sign",
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

const Request: React.FC = () => {
  return (
    <DefaultLayout>
      <FileMobile />
    </DefaultLayout>
  );
};

export default Request;
