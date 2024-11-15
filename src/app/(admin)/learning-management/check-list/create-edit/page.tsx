import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Metadata } from "next";
import React from "react";
import CreateAndEditExamPage from "./ExamCreate";

export const metadata: Metadata = {
  title: "create-update-exam- Dictionary",
  description: "createUpdate-exam page for We_sign",
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

const CreateExamPage: React.FC = () => {
  return (
    <DefaultLayout>
      <CreateAndEditExamPage />
    </DefaultLayout>
  );
};

export default CreateExamPage;
