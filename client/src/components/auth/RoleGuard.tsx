import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store";
import Loader from "../common/Loader";

type Role = "admin" | "user";

type RoleGuardLayoutProps = {
  allow: Role[];
};

export const RoleGuardLayout = ({
  allow,
}: RoleGuardLayoutProps) => {
  const { user, isBootstrapped } = useAuthStore();

  if (!isBootstrapped) {
    return <Loader/>
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (!allow.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};