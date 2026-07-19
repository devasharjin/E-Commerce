import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { useCartAndCheckoutStore } from "@/features/customer/cart-with-checkout/store"
import { useAddresses } from "@/features/customer/Address/api"
import { useAuthStore } from "@/features/auth/store"
import {
  useAllCart,
  useApplyPromo,
  usePoints,
} from "@/features/customer/cart-with-checkout/hooks"

import CustomerCartListing from "./cart-listing"
import { formatMoney } from "@/lib/utils"
import { usePayWithRazorpay } from "./payment-helper"

const CartAndCheckoutDrawer = () => {
  const {
    isOpen,
    setOpen,
    AppliedPromo,
    setAppliedPromo,
    getCartQuantity,
    cart: guestCart,
  } = useCartAndCheckoutStore()

  const { data: addresses } = useAddresses()
  const { data: Promo, mutate: promoMutate } = useApplyPromo()
  const { data: serverCart } = useAllCart()
  const { data: points } = usePoints()
  const { user } = useAuthStore()

  const defaultAddress = addresses?.find(
    (address) => address.isDefault
  )

  const cartQuantity = getCartQuantity()

  const subtotal = user
    ? serverCart?.items?.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    : guestCart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )

  const discount = Promo
    ? ((subtotal ?? 0) * Promo.percentage) / 100
    : 0

  const total = Math.max(
    (subtotal ?? 0) - discount,
    0
  )

  function handleApplyPromo() {
    promoMutate({
      code: AppliedPromo,
      orderValue: subtotal ?? 0,
    })
    setAppliedPromo("")
  }

  function handleClearPromo() {
    setAppliedPromo("")
    promoMutate({
      code: "",
      orderValue: subtotal ?? 0,
    })
  }

  function CartSummary({
    field,
    value,
  }: {
    field: string
    value?: string | number
  }) {
    return (
      <div className="flex items-center justify-between py-2 text-sm">
        <p className="text-muted-foreground">{field}</p>
        <p className="font-medium">{value ?? "-"}</p>
      </div>
    )
  }


  const { PayRazorpay,PayWithPoints} = usePayWithRazorpay()

  return (
    <Drawer open={isOpen} onOpenChange={setOpen}>
      <DrawerContent className="h-[92vh] overflow-hidden rounded-t-3xl p-0">
        <div className="grid h-full min-h-0 lg:grid-cols-[1fr_420px]">

          <section className="flex min-h-0 flex-col border-r">
            <div className="border-b px-8 py-6">
              <h2 className="text-2xl font-bold">
                Shopping Cart
              </h2>
            </div>

            <ScrollArea className="flex-1 min-h-0 px-8">
              <div className="py-6">
                <CustomerCartListing />
              </div>
            </ScrollArea>
          </section>

          <aside className="flex min-h-0 flex-col bg-muted/30">
            <div className="border-b px-6 py-5">
              <h3 className="text-xl font-semibold">
                Order Summary
              </h3>
            </div>

            <ScrollArea className="flex-1 min-h-0">
              <div className="space-y-6 p-6 pb-2">

                {!user ? (
                  <div className="rounded-xl border bg-background p-6 text-center">
                    <p className="text-muted-foreground">
                      Login to continue checkout
                    </p>

                    <Button className="mt-4 w-full">
                      Login
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="rounded-xl border bg-background p-4 space-y-2">
                      <h4 className="font-semibold">
                        Delivery Address
                      </h4>

                      {defaultAddress ? (
                        <>
                          <p className="font-medium">
                            {defaultAddress.fullName}
                          </p>

                          <p className="text-sm text-muted-foreground">
                            {defaultAddress.address}
                          </p>

                          <p className="text-sm text-muted-foreground">
                            {defaultAddress.city},{" "}
                            {defaultAddress.pinCode}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No default address selected.
                        </p>
                      )}
                    </div>

                    <div className="rounded-xl border bg-background p-4 space-y-4">
                      <h4 className="font-semibold">
                        Promo Code
                      </h4>

                      {Promo ? (
                        <div className="flex items-center justify-between rounded-lg border bg-muted p-3">
                          <span className="font-medium">
                            {Promo.code}
                          </span>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleClearPromo}
                          >
                            Clear
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter promo code"
                            value={AppliedPromo}
                            onChange={(e) =>
                              setAppliedPromo(e.target.value)
                            }
                          />

                          <Button onClick={handleApplyPromo}>
                            Apply
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="rounded-xl border bg-background p-4">
                      <h4 className="mb-3 font-semibold">
                        Price Details
                      </h4>

                      <CartSummary
                        field="Items"
                        value={
                          user
                            ? serverCart?.totalQuantity
                            : cartQuantity
                        }
                      />

                      <CartSummary
                        field="Subtotal"
                        value={formatMoney(subtotal ?? 0)}
                      />

                      <CartSummary
                        field="Discount"
                        value={formatMoney(discount)}
                      />

                      <CartSummary
                        field="Reward Points"
                        value={points?.points ?? 0}
                      />

                      <div className="my-3 border-t" />

                      <CartSummary
                        field="Total"
                        value={formatMoney(total)}
                      />
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>

            {user && (
              <div className="border-t bg-background p-6 space-y-3">
                <Button
                  onClick={() => PayWithPoints(defaultAddress?._id, AppliedPromo)}
                  className="w-full"
                  variant="outline"
                >
                  Pay With Points
                </Button>

                <Button 
                onClick={()=>{
                    PayRazorpay(defaultAddress?._id, AppliedPromo)
                  setOpen(false)
                }}
                className="w-full">
                  Pay with Razorpay
                </Button>
              </div>
            )}
          </aside>

        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default CartAndCheckoutDrawer