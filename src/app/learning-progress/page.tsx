// pages/auth/login.tsx
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import LeaningProcess from "@/components/leaning-process";
import Profile from "@/components/Profile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning Process - Dictionary",
  description: "Learning process page for We_sign",
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

export default function LeaningProcessPage() {
  return (
    <DefaultLayout>
      <LeaningProcess />
    </DefaultLayout>
  );
}
