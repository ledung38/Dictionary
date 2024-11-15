import Chart from "@/components/Charts/page";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import ChatCard from "@/components/Chat/ChatCard";

export const metadata: Metadata = {
  title: "Chat- Dictionary",
  description: "Chat page for We_sign",
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

const ChatPage: React.FC = () => {
  return (
    <DefaultLayout>
      <ChatCard />
    </DefaultLayout>
  );
};

export default ChatPage;
