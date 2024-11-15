// components/ClientLoader.tsx
import Loader from "@/components/UI/Loader";
import { logout } from "@/store/slices/adminSlice";
import { resetChat } from "@/store/slices/chatSlice";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const ClientLoader = ({ children }: any) => {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch();
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  useEffect(() => {
    if (!token && pathname?.includes("/profile")) {
      router.push("/");
    }
    if (
      token &&
      (pathname === "/login" ||
        pathname === "/register" ||
        pathname === "/verify-otp")
    ) {
      router.push("/");
      dispatch(logout());
    }
  }, [pathname, router]);

  useEffect(() => {
    dispatch(resetChat());
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }

  return <>{children}</>;
};

export default ClientLoader;
