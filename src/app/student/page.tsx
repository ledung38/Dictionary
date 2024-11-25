import Student from "@/components/Student/Student";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student - Dictionary",
  description: "Dashboard page for We_sign",
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
const Dashboard = () => {
  return (
    <DefaultLayout>
      <Student />
    </DefaultLayout>
  );
};

export default Dashboard;
