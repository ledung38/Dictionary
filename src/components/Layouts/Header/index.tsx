import { colors } from "@/assets/colors";
import { Logo } from "@/assets/icons";
import SearchInput from "@/components/Friend/components/SearchInput";
import StudySelect from "@/components/Study/StudySelect";
import { RootState, store } from "@/store";
import { Button } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DropdownUser from "./DropdownUser";

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const { sidebarOpen } = props;
  const pathname = usePathname();

  const state: RootState = store.getState();
  const admin = state.admin;

  return (
    <header className="sticky top-0 z-[98] flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
      <div
        className={`flex flex-grow items-center justify-between px-4 py-4 shadow-2 ${!pathname.includes("/chat") && admin ? "pr-16" : "pr-4"} `}
      >
        {/* Hiện logo khi ẩn slideBar */}
        <div className="flex items-center gap-4">
          {!sidebarOpen && (
            <div className="flex items-center gap-2">
              <Link className="flex items-end justify-center" href="/">
                <div className="font-bold text-purple-500 text-4xl">Dictionary</div>
              </Link>
            </div>
          )}
          {/* Tìm kiếm bạn bè */}
          {pathname?.includes("friend") && <SearchInput />}

          {/* Học tập */}
          {pathname?.includes("study") && sidebarOpen && <StudySelect />}
        </div>

        <div className="flex items-center gap-3">
          <ul className="flex items-center gap-2">
            {/* <!-- Dark Mode Toggler --> */}
            {/* <DarkModeSwitcher /> */}
            {/* <!-- Dark Mode Toggler --> */}

            {/* <!-- Notification Menu Area --> */}
            {/* <DropdownNotification /> */}
            {/* <!-- Notification Menu Area --> */}

            {/* <!-- Chat Notification Area --> */}
            {/* <DropdownMessage /> */}
            {/* <!-- Chat Notification Area --> */}
          </ul>

          {/* <!-- User Area --> */}
          {admin ? (
            <DropdownUser admin={admin} />
          ) : (
            <div className="flex gap-4">
              <Link href="/register">
                <Button className="border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white">
                  Đăng ký
                </Button>
              </Link>
              <Link href="/login">
                <Button 
                  type="primary"
                  className="bg-purple-500 border-purple-500 hover:bg-purple-600 hover:border-purple-600"
                >
                  Đăng nhập
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
