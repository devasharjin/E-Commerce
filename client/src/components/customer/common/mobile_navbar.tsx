import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { logout } from "@/features/auth/api";
import { useAuthStore } from "@/features/auth/store";
import {
    Heart,
  LogIn,
  LogOut,
  Menu,
  ShoppingBag,
  Store,
  User,
  type LucideIcon,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

type customerMobileNavbarProps = {
  user: {};
};

type NavbarType = {
  href: string;
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
};

function NavTextLink({ href, label, icon: Icon, onClick }: NavbarType) {
  return (
    <Link
      to={href}
      onClick={onClick}   
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted active:scale-[0.98]"
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  );
}

export function CustomerMobileNavbar({ user }: customerMobileNavbarProps) {
  const { clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false); 

  const closeSheet = () => setOpen(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    } finally {
      clearAuth();
      setOpen(false); 
      navigate("/");
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>

      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-72 p-5">
        {/* Header */}
        <SheetHeader className="mb-4">
          <Link
            to="/"
            onClick={closeSheet}
            className="flex items-center gap-3"
          >
            <Store className="h-6 w-6" />
            <p className="text-lg font-bold tracking-tight">E-Shopify</p>
          </Link>
        </SheetHeader>

        <Separator className="my-3" />

        <div className="mb-2 text-xs text-muted-foreground uppercase tracking-wider">
          Shop
        </div>

        <NavTextLink
          href="/collections"
          label="Collections"
          icon={ShoppingBag}
          onClick={closeSheet}
        />

        <NavTextLink
          href="/Wishlist"
          label="Wishlist"
          icon={Heart}
          onClick={closeSheet}
        />

        <Separator className="my-4" />

        <div className="mb-2 text-xs text-muted-foreground uppercase tracking-wider">
          Account
        </div>

        {user ? (
          <div className="flex flex-col gap-1">
            <NavTextLink
              href="/profile"
              label="My Profile"
              icon={User}
              onClick={closeSheet}
            />

            <NavTextLink
              href="/wishlist"
              label="Wishlist"
              icon={User}
              onClick={closeSheet}
            />

            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start gap-3 px-3 mt-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        ) : (
          <NavTextLink
            href="/signin"
            label="Login"
            icon={LogIn}
            onClick={closeSheet}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}