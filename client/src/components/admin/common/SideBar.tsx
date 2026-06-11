import { Separator } from "@/components/ui/separator";
import {
  Store,
  LayoutDashboard,
  Box,
  ShoppingCart,
  Ticket,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

type NavbarType = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const items: NavbarType[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Box },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/coupons", label: "Coupons", icon: Ticket },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function NavItems() {
  const location = useLocation();

  return (
    <nav className="mt-4 flex flex-col gap-1">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;

        return (
          <Link
            key={item.label}
            to={item.href}
            className={`
              group flex items-center gap-5 px-4 py-2 rounded-xl text-sm font-medium
              transition-all duration-200 ease-in-out
              relative overflow-hidden
              ${
                isActive
                  ? "bg-pink-50 text-pink-600 shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }
            `}
          >
            {/* Active left indicator */}
            <span
              className={`
                absolute left-0 top-0 h-full w-1 rounded-r-full transition-all
                ${isActive ? "bg-pink-500" : "bg-transparent"}
              `}
            />

            <Icon
              className={`h-5 w-5 transition-colors ${
                isActive ? "text-pink-500" : "text-gray-500 group-hover:text-gray-700"
              }`}
            />

            <span className="tracking-wide">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

const AdminSideBar = () => {
  return (
    <div className="min-h-screen w-64 bg-white border-r border-gray-100 p-4">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 px-2 py-3">
        <Store className="h-6 w-6 text-pink-500" />
        <p className="text-lg font-bold text-gray-900">E-Shopify</p>
      </Link>

      <Separator className="my-2" />

      <NavItems />
    </div>
  );
};

export default AdminSideBar;