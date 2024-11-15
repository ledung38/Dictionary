// pages/auth/login.tsx
import { Metadata } from "next";
import LayoutAuth from "..";
import Login from "@/components/Auth/Login";

export const metadata: Metadata = {
  title: "Login - Dictionary",
  description: "Login page for We_sign",
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

export default function LoginPage() {
  return (
    <LayoutAuth>
      <Login />
    </LayoutAuth>
  );
}
