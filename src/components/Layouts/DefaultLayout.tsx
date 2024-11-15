"use client";
import Header from "@/components/Layouts/Header";
import Sidebar from "@/components/Layouts/Sidebar";
import { RootState } from "@/store";
import { updateSetting } from "@/store/slices/SettingSlice";
import { DoubleLeftOutlined, DoubleRightOutlined } from "@ant-design/icons";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.admin);

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
    const savedState = localStorage.getItem("sidebarOpen");
    return savedState !== null ? JSON.parse(savedState) : false;
  });

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    dispatch(
      updateSetting({
        openSideBar: !sidebarOpen,
      }),
    );
  };

  return (
    <>
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex h-screen overflow-hidden ">
        {/* <!-- ===== Sidebar Start ===== --> */}
        {sidebarOpen && (
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        )}

        {/* <!-- ===== Sidebar End ===== --> */}
        <button
          className="rounded-full bg-white p-2 focus:outline-none dark:bg-boxdark md:px-1"
          onClick={toggleSidebar}
        >
          {sidebarOpen ? (
            <DoubleLeftOutlined size={24} />
          ) : (
            <DoubleRightOutlined size={24} />
          )}
        </button>
        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div className="mx-auto mr-14 max-w-full p-4 ">{children}</div>
          </main>
        </div>
      </div>
    </>
  );
}
