// pages/index.tsx
import HomePage from "@/components/Home/Home";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home - Dictionary",
  description: "Home page for Dictionary",
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
export default function Home() {
  return (
    <DefaultLayout>
      <HomePage />
    </DefaultLayout>
  );
}
