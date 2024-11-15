// pages/auth/login.tsx
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Metadata } from "next";
import PracticeData from "./PracticeData";

export const metadata: Metadata = {
  title: "Practice-data - Dictionary",
  description: "Practice-data page for We_sign",
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

export default function CollectDataPage() {
  return (
    <DefaultLayout>
      <div className="mb-2 text-xl font-bold">Luyện tập ký hiệu</div>
      <PracticeData />
    </DefaultLayout>
  );
}
