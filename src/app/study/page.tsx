import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Metadata } from "next";
import LearnHome from "../../components/Study/LearnHome";

export const metadata: Metadata = {
  title: "Learn - Dictionary",
  description: "Learn page for We_sign",
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

const LearnAlphabet = () => {
  return (
    <DefaultLayout>
      <LearnHome />
    </DefaultLayout>
  );
};

export default LearnAlphabet;
