import { AdminSystem } from "@/config/adminNavigation";
import { MenuSystem } from "@/config/userNavigation";
import { RootState, store } from "@/store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import SidebarLinkGroup from "./SidebarLinkGroup";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const state: RootState = store.getState();
  const admin = state.admin;

  const sidebar = useRef(null);

  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  useEffect(() => {
    const storedSidebarExpanded = localStorage.getItem("sidebarExpanded");
    if (storedSidebarExpanded !== null) {
      setSidebarExpanded(storedSidebarExpanded === "true");
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarExpanded((prevExpanded) => !prevExpanded);
    localStorage.setItem("sidebarExpanded", `${!sidebarExpanded}`);
  };

  const renderChildItems = (items: any[], level = 0) => (
    <ul className={`pl-${level * 4}`}>
      {items.map((item) => (
        <SidebarLinkGroup
          key={item.key}
          activeCondition={pathname.includes(item.path)}
        >
          {(handleClick, open) => {
            const hasChildren = item.children?.length > 0;
            return (
              <>
                <Link
                  href={item.path}
                  className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 text-sm font-medium text-white duration-300 ease-in-out hover:bg-purple-600 dark:hover:bg-purple-800 ${
                    pathname === item.path ? "bg-purple-600 dark:bg-purple-800" : ""
                  }`}
                  onClick={(e) => {
                    if (hasChildren) {
                      e.preventDefault();
                      sidebarExpanded ? handleClick() : toggleSidebar();
                    }
                  }}
                  style={{ paddingLeft: `${level * 1}rem` }}
                >
                  {item.icon}
                  {item.label}
                  {hasChildren && (
                    <svg
                      className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current text-white ${
                        open ? "rotate-180" : ""
                      }`}
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                        fill=""
                      />
                    </svg>
                  )}
                </Link>
                {hasChildren &&
                  open &&
                  renderChildItems(item.children, level + 1)}
              </>
            );
          }}
        </SidebarLinkGroup>
      ))}
    </ul>
  );

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-99 flex h-screen w-70 flex-col overflow-y-hidden bg-purple-500 duration-300 ease-linear dark:bg-purple-700 lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* SIDEBAR HEADER */}
      <div className="flex items-center justify-center gap-2 px-6 py-4">
        <Link href="/" className="flex items-end justify-center">
          <div className="text-4xl font-bold text-white">Dictionary</div>
        </Link>
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* Sidebar Menu */}
        <nav className="mt-2 py-2 pl-4 pr-2">
          <div>
            <h3 className="mb-2 ml-4 text-sm font-semibold text-purple-200">
              MENU
            </h3>

            <ul className="mb-4 flex flex-col gap-1">
              {MenuSystem()?.map((item: any) => (
                <React.Fragment key={item.label}>
                  {renderChildItems([item])}
                </React.Fragment>
              ))}
            </ul>

            {admin && (admin?.role === "ADMIN" || admin?.role === "TEACHER") ? (
              <>
                <h3 className="mb-2 ml-4 text-xl font-bold text-white">
                  ADMIN
                </h3>

                <ul className="mb-4 flex flex-col gap-1">
                  {AdminSystem(admin)?.map((item: any) => (
                    <React.Fragment key={item.label}>
                      {renderChildItems([item])}
                    </React.Fragment>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
