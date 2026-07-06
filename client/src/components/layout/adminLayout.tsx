import { Link, Outlet } from "react-router-dom";
import AdminSideBar from "../admin/common/SideBar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { Button } from "../ui/button";
import { LogOut, User } from "lucide-react";
import { logout } from "@/features/auth/api";
import { useAuthStore } from "@/features/auth/store";

export const AdminLayout = () => {
  const { clearAuth } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    } finally {
      clearAuth();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSideBar />

      {/* Main content */}
      <div className="flex flex-col flex-1">
        
        {/* Topbar */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-end px-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-gray-700 hover:bg-gray-100"
              >
                <User className="h-4 w-4" />
                Account
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>My Profile</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link to={"/orders"} className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>My Orders</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link to="/" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>User Panel</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 focus:text-red-600"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;