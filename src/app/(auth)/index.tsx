import { colors } from "@/assets/colors";
import { LoginBg, Logo } from "@/assets/icons";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Auth - Dictionary",
  description: "Auth page for Dictionary",
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

export default function LayoutAuth({ children }: any) {
  return (
    <div className="flex h-screen overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mobile:block ">
      <div className="w-1/2 mobile:w-full  ">
        <div className="px-26 py-17.5 text-center mobile:px-4 mobile:pb-12 mobile:pt-6">
          <Link href="/" className="mb-5.5 inline-flex justify-center w-full">
            <div className="text-3xl font-bold text-purple-400">Dictionary</div>
          </Link>

          <p className="space-x-1 text-xl uppercase mobile:w-full mobile:text-sm">
            Từ điển ngôn ngữ ký hiệu thân thiện, dễ sử dụng
          </p>

          <span className="mt-15 flex items-center justify-center mobile:hidden">
            <LoginBg />
          </span>
        </div>
      </div>

      <div className="w-1.2 flex h-full items-center justify-center border-stroke dark:border-strokedark mobile:block mobile:w-full xl:w-1/2 xl:border-l-2">
        {children}
      </div>
    </div>
  );
}
