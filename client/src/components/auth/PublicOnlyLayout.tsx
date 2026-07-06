import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store";
import Loader from "../common/Loader";

export const PublicOnlyLayout = () => {
  const location = useLocation()
  const { user, isBootstrapped } = useAuthStore();

  if (!isBootstrapped) {
    return <Loader/>
  }

  if (user && location.pathname=='/signin') {
    return <Navigate to="/profile" replace />;
  }

  return <Outlet />;
};