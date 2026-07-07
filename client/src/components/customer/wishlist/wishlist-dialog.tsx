import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    useDeleteCustomerWishlist,
    useGetCustomerWishlist,
} from "@/features/customer/wishlist/api";
import { wishlistStore } from "@/features/customer/wishlist/store";
import { formatMoney } from "@/lib/utils";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const WishlistDialog = () => {
    const { isOpen, setOpen } = wishlistStore();

    const { data: wishlists } = useGetCustomerWishlist();
    const deleteWishlistMutation = useDeleteCustomerWishlist();

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl overflow-hidden rounded-2xl p-0">
                {/* Header */}
                <DialogHeader className="border-b px-6 py-5">
                    <DialogTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                            <span className="text-lg font-semibold">Wishlist</span>
                        </div>

                        <span className="text-sm font-normal text-muted-foreground">
                            {wishlists?.length ?? 0} item
                            {(wishlists?.length ?? 0) !== 1 && "s"}
                        </span>
                    </DialogTitle>
                </DialogHeader>

                {/* Body */}
                <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
                    {!wishlists?.length ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="rounded-full bg-muted p-5">
                                <Heart className="h-10 w-10 text-muted-foreground" />
                            </div>

                            <h3 className="mt-5 text-xl font-semibold">
                                Your wishlist is empty
                            </h3>

                            <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
                                Save your favorite products and they'll appear here for quick
                                access later.
                            </p>

                            <Button className="mt-6" onClick={() => setOpen(false)}>
                                Continue Shopping
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {wishlists.map((wishlist) => (
                                <div
                                    key={wishlist.id}
                                    className="group rounded-xl border bg-card p-4 transition-all duration-200 hover:border-primary/30 hover:shadow-md"
                                >
                                    <div className="flex gap-5">
                                        {/* Product Image */}
                                        <Link
                                            to={`/collection/${wishlist.id}`}
                                            onClick={() => setOpen(false)}
                                            className="shrink-0"
                                        >
                                            <img
                                                src={wishlist.image}
                                                alt={wishlist.title}
                                                className="h-28 w-28 rounded-xl border object-cover"
                                            />
                                        </Link>

                                        {/* Details */}
                                        <div className="flex flex-1 flex-col justify-between">
                                            <div>
                                                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                                                    {wishlist.brand}
                                                </p>

                                                <Link
                                                    to={`/collection/${wishlist.id}`}
                                                    onClick={() => setOpen(false)}
                                                >
                                                    <h3 className="mt-1 line-clamp-2 text-lg font-medium transition group-hover:text-primary">
                                                        {wishlist.title}
                                                    </h3>
                                                </Link>

                                                <p className="mt-3 text-xl font-bold">
                                                    {formatMoney(wishlist.price)}
                                                </p>
                                            </div>

                                            {/* Actions */}
                                            <div className="mt-5 flex items-center justify-between">
                                                <Link
                                                    to={`/collection/${wishlist.id}`}
                                                    onClick={() => setOpen(false)}
                                                >
                                                    <Button className="gap-2">
                                                        <ShoppingBag className="h-4 w-4" />
                                                        View Product
                                                    </Button>
                                                </Link>

                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                                                    disabled={
                                                        deleteWishlistMutation.isPending &&
                                                        deleteWishlistMutation.variables === wishlist.id
                                                    }
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        deleteWishlistMutation.mutate(wishlist.id);
                                                    }}
                                                >
                                                    {deleteWishlistMutation.isPending &&
                                                        deleteWishlistMutation.variables === wishlist.id ? (
                                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
                                                    ) : (
                                                        <Trash2 className="h-5 w-5" />
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default WishlistDialog;