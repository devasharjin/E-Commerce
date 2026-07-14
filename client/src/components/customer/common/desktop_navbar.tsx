import { Link } from "react-router-dom";
import {
    Heart,
    LogIn,
    LogOut,
    ShoppingBag,
    ShoppingBasketIcon,
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
import { wishlistStore } from "@/features/customer/wishlist/store";
import { useGetCustomerWishlist } from "@/features/customer/wishlist/api";
import WishlistDialog from "../wishlist/wishlist-dialog";
import { ProfileStore } from "@/features/customer/Address/store";
import ProfileDialog from "../profile/profile-dialog";
import { useCartAndCheckoutStore } from "@/features/customer/cart-with-checkout/store";
import CartAndCheckoutDrawer from "../cart-with-checkout/cart-and-checkout-drawer";
import { useAllCart, useSyncCart } from "@/features/customer/cart-with-checkout/hooks";
import { useEffect } from "react";

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
    const setOpenProfile = ProfileStore((state) => state.setOpen);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error(error);
        } finally {
            clearAuth();
        }
    };

    const { setOpen } = wishlistStore()
    const { data: wishlist } = useGetCustomerWishlist()

    const wishlistCount = wishlist?.length
    console.log(wishlistCount);

    const { setOpen: SetCartOpen } = useCartAndCheckoutStore()
    const {cart : guestCart,clearCart,getCartQuantity} = useCartAndCheckoutStore()

    const cartSyncmutation = useSyncCart()
    const { data : serverCart} = useAllCart()

    const syncCart = guestCart.map(item => {
        return {
            product: item.id,
            quantity : item.quantity,
            color : item.color,
            size : item.size
        }
    })

    const CartQuantity = getCartQuantity()

    useEffect(()=>{
        if(user){
            cartSyncmutation.mutate(syncCart)
            clearCart()
        }
    },[user])


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



                <div className="flex items-center gap-3 ">
                    {
                        user ?
                            <nav
                                onClick={() => setOpen(true)}
                                className="hidden md:flex relative">
                                <div
                                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                                >
                                    <Heart className="h-4 w-4" />
                                    <p>Wishlist</p>
                                </div>
                                <span className="absolute right-16 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                                    {wishlistCount}
                                </span>
                            </nav>
                            : null
                    }


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
                                        <button
                                            onClick={() => setOpenProfile(true)}
                                            className="flex items-center gap-2 w-full">
                                            <User className="h-4 w-4" />
                                            <span>My Profile</span>
                                        </button>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link to={"/orders"} className="flex items-center gap-2">
                                            <ShoppingBasketIcon className="h-4 w-4" />
                                            <span>My Orders</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    {
                                        user.role === 'admin' &&
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

                    <div
                        onClick={() => SetCartOpen(true)}
                        className="relative flex items-center justify-center rounded-lg p-2 transition-all hover:bg-muted"
                    >
                        <ShoppingCart className="h-5 w-5" />

                        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                            {user ? serverCart?.totalQuantity : CartQuantity}
                        </span>
                    </div>

                    <div className="md:hidden">
                        <CustomerMobileNavbar user={!!user} />
                    </div>
                </div>
            </div>
            <WishlistDialog />
            <ProfileDialog />
            <CartAndCheckoutDrawer />
        </header>
    );
}