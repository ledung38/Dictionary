import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Metadata } from "next";
import Rooms from "./Room";

export const metadata: Metadata = {
  title: "LearnRoom- Dictionary",
  description: "LearnRoom page for We_sign",
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
      <Rooms />
    </DefaultLayout>
  );
};

export default LearnAlphabet;
