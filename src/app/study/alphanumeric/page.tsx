import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Metadata } from "next";
import Alphanumeric from "./Alphanumeric";

export const metadata: Metadata = {
  title: "LearnAlphanumeric- Dictionary",
  description: "LearnAlphanumeric page for We_sign",
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
      <Alphanumeric />
    </DefaultLayout>
  );
};

export default LearnAlphabet;
