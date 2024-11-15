// pages/auth/login.tsx
import { Metadata } from "next";
import LayoutAuth from "..";
import Register from "@/components/Auth/Register";

export const metadata: Metadata = {
  title: "Register - Dictionary",
  description: "Register page for We_sign",
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

export default function RegisterPage() {
  return (
    <LayoutAuth>
      <Register />
    </LayoutAuth>
  );
}
