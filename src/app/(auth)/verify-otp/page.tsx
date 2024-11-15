// pages/auth/login.tsx
import { Metadata } from "next";
import LayoutAuth from "..";
import VerifyOtp from "@/components/Auth/VerifyOTP";

export const metadata: Metadata = {
  title: "VerifyOtp - Dictionary",
  description: "VerifyOtp page for We_sign",
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

export default function VerifyPage() {
  return (
    <LayoutAuth>
      <VerifyOtp />
    </LayoutAuth>
  );
}
