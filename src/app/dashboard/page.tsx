import DashboardApp from "@/components/Dashboard/DashboardApp";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Dictionary",
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
      <DashboardApp />
    </DefaultLayout>
  );
};

export default Dashboard;
