import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Metadata } from "next";
import Topics from "./Topics";

export const metadata: Metadata = {
  title: "LearnTopics - Dictionary",
  description: "LearnTopics page for We_sign",
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

const LearnTopics = () => {
  return (
    <DefaultLayout>
      <Topics />
      {/* <StudyComponent /> */}
    </DefaultLayout>
  );
};

export default LearnTopics;
