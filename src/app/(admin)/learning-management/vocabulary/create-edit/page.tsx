import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Metadata } from "next";
import React from "react";
import VocabularyCreateUpdate from "./VocabularyCreateUpdate";

export const metadata: Metadata = {
  title: "create-update-vocabulary- Dictionary",
  description: "createUpdate-vocabulary page for We_sign",
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

const CreateVocabularyPage: React.FC = () => {
  return (
    <DefaultLayout>
      <VocabularyCreateUpdate />
    </DefaultLayout>
  );
};

export default CreateVocabularyPage;
