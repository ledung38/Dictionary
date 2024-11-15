import Chart from "@/components/Charts/page";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import IntroductionPage from "./IntroductionPage";

export const metadata: Metadata = {
  title: "IntroductionManagement - Dictionary",
  description: "IntroductionManagement page for We_sign",
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

const IntroductionManagement: React.FC = () => {
  return (
    <DefaultLayout>
      <IntroductionPage />
    </DefaultLayout>
  );
};

export default IntroductionManagement;
