import { Outlet, Navigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store";

export const ProtectedLayout = () => {
  const { user, isBootstrapped } = useAuthStore();

  if (!isBootstrapped) {
    return null; // or a loading spinner
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};