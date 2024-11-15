// pages/auth/login.tsx
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Metadata } from "next";
import IntroductionWeb from "./IntroductionWeb";

export const metadata: Metadata = {
  title: "Introduction - WeSign",
  description: "Introduction page for WeSign",
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

export default function Introduction() {
  return (
    <DefaultLayout>
      <IntroductionWeb />
    </DefaultLayout>
  );
}
