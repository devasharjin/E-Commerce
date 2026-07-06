import { Link } from "react-router-dom";
import {
    Heart,
    LogIn,
    LogOut,
    ShoppingBag,
    ShoppingCart,
    Store,
    User,
    type LucideIcon,
} from "lucide-react";
import { useAuthStore } from "@/features/auth/store";
import {
    DropdownMenuTrigger,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { logout } from "@/features/auth/api";
import { CustomerMobileNavbar } from "./mobile_navbar";

function NavTextLink({
    href,
    label,
    icon: Icon,
}: {
    href: string;
    label: string;
    icon: LucideIcon;
}) {
    return (
        <Link
            to={href}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
        >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
        </Link>
    );
}

export function CustomerNavbar() {
    const { user, clearAuth } = useAuthStore();

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
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

                <Link to={"/"} className="flex items-center gap-3">
                    <Store className="h-6 w-6" />
                    <p className="text-xl font-bold tracking-tight">E-Shopify</p>
                </Link>

                <div className="hidden md:flex">
                    <NavTextLink
                        href="/collections"
                        label="Collections"
                        icon={ShoppingBag}
                    />
                </div>

                <div className="flex items-center gap-3">

                    <nav className="hidden md:flex">
                        <NavTextLink
                            href="/wishlist"
                            label="Wishlist"
                            icon={Heart}
                        />
                    </nav>

                    {user ? (
                        <div className="hidden md:flex">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Account
                                    </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end" className="w-52">
                                    <DropdownMenuItem asChild>
                                        <Link to={"/profile"} className="flex items-center gap-2">
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
                                    {
                                        user.role==='admin' && 
                                        <DropdownMenuItem asChild>
                                        <Link to={"/admin"} className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            <span>Admin Panel</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    }

                                    <DropdownMenuItem onClick={handleLogout}>
                                        <LogOut className="h-4 w-4" />
                                        <span>Logout</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : (
                        <div className="hidden md:flex">
                            <NavTextLink href="/signin" label="Login" icon={LogIn} />
                        </div>
                    )}

                    <Link
                        to={"/orders"}
                        className="relative flex items-center justify-center rounded-lg p-2 transition-all hover:bg-muted"
                    >
                        <ShoppingCart className="h-5 w-5" />

                        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                            {0}
                        </span>
                    </Link>

                    <div className="md:hidden">
                        <CustomerMobileNavbar user={!!user} />
                    </div>
                </div>
            </div>
        </header>
    );
}