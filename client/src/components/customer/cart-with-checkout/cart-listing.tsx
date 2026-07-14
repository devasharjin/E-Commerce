import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/features/auth/store";
import { useAllCart, useDeleteCart, useUpdateCart } from "@/features/customer/cart-with-checkout/hooks";
import { useCartAndCheckoutStore } from "@/features/customer/cart-with-checkout/store";
import type { CartItem } from "@/features/customer/cart-with-checkout/types";
import { formatMoney } from "@/lib/utils";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

const CustomerCartListing = () => {
  const { cart: unLoggedCart, onChangeQuantity,onRemove } = useCartAndCheckoutStore();
  const { user } = useAuthStore();
  const { data: LoggedCart } = useAllCart();

  const updateQuantityMutation = useUpdateCart()
  const RemoveFromCartMutation = useDeleteCart()

  const cart = user ? LoggedCart?.items : unLoggedCart;

  function decreaseQuantity(item: CartItem) {
    if (user) {
      updateQuantityMutation.mutate({
        id: item.id,
        quantity: item.quantity - 1,
        color: item.color,
        size: item.size as "S" | "M" | "L" | "XL",
      })
    } else {
      onChangeQuantity(
        item.id,
        item.quantity - 1,
        item.color,
        item.size as "S" | "M" | "L" | "XL",
      )
    }
  }

  function increaseQuantity(item: CartItem) {
    if (user) {
      updateQuantityMutation.mutate({
        id: item.id,
        quantity: item.quantity + 1,
        color: item.color,
        size: item.size as "S" | "M" | "L" | "XL",
      })
    } else {
      onChangeQuantity(
        item.id,
        item.quantity + 1,
        item.color,
        item.size as "S" | "M" | "L" | "XL",
      )
    }
  }

  function handleRemove(item :CartItem){
    if(user){
      RemoveFromCartMutation.mutate({
        id: item.id, color: item.color,
        size: item.size as "S" | "M" | "L" | "XL"
      })
    }else{
      onRemove(item.id, item.color, item.color as "S" | "M" | "L" | "XL");
    }
  }

  return (
    <ScrollArea className="h-[60vh]">
      <div className="space-y-4 p-4">
        {!cart?.length ? (
          <div className="flex h-80 flex-col items-center justify-center rounded-xl border border-dashed">
            <ShoppingCart className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Your cart is empty</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Add some products to get started.
            </p>
          </div>
        ) : (
          cart.map((item, index) => (
            <div key={`${item.id}-${item.color}-${item.size}`}>
              <div className="flex gap-4 rounded-xl border p-4 transition-colors hover:bg-muted/40">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-28 w-28 rounded-lg border object-cover"
                />

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {item.brand}
                    </p>

                    <h3 className="mt-1 line-clamp-2 text-base font-semibold">
                      {item.title}
                    </h3>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.size && (
                        <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium">
                          Size: {item.size}
                        </span>
                      )}

                      {item.color && (
                        <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium">
                          Color: {item.color}
                        </span>
                      )}
                    </div>

                    <p className="mt-3 text-lg font-bold">
                      {formatMoney(item.price)}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center rounded-lg border">
                      <Button
                        onClick={() => decreaseQuantity(item)}
                        variant="ghost"
                        size="icon"
                        className="rounded-r-none"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>

                      <span className="min-w-10 text-center font-medium">
                        {item.quantity}
                      </span>

                      <Button
                        onClick={() => increaseQuantity(item)}
                        variant="ghost"
                        size="icon"
                        className="rounded-l-none"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button
                    onClick={()=>handleRemove(item)}
                    variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {index !== cart.length - 1 && <Separator className="my-4" />}
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  );
};

export default CustomerCartListing;