import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store";

export const PublicOnlyLayout = () => {
  const { user, isBootstrapped } = useAuthStore();

  if (!isBootstrapped) {
    return null; 
  }

  if (user) {
    return <Navigate to="/profile" replace />;
  }

  return <Outlet />;
};