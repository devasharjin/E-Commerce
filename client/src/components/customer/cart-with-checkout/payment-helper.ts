import { useAuthStore } from "@/features/auth/store";
import {
  useAllCart,
  useCreateCheckout,
  usePayWithPoinnts,
  usePoints,
  useVerifyCheckout,
} from "@/features/customer/cart-with-checkout/hooks";
import { useCartAndCheckoutStore } from "@/features/customer/cart-with-checkout/store";
import { env } from "@/lib/env";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function usePayWithRazorpay() {
  const { user } = useAuthStore();
  const { data: cart } = useAllCart();
  const { data: points } = usePoints();
  const { setOpen} = useCartAndCheckoutStore()

  const { mutateAsync: PayWithPointsMutation } = usePayWithPoinnts();
  const { mutateAsync: checkoutMutate } = useCreateCheckout();
  const { mutateAsync: verifyCheckout } = useVerifyCheckout();
  const navigate = useNavigate()

  async function PayRazorpay(addressId?: string, promoCode?: string) {    
    if (!user) {
      return toast.error("Login to Continue");
    }

    if (!addressId) {
      return toast.error("Add Default address in the profile");
    }

    if (!cart?.items.length) {
      return toast.error("Cart is Empty.");
    }

    try {
      const checkout = await checkoutMutate({
        addressid: addressId,
        promoCode: promoCode || "",
      });

      if (!checkout) {
        return toast.error("Failed to create checkout");
      }

      const razorpay = new window.Razorpay({
        key: env.razorpay_key,
        amount: checkout.razorpay.amount as number,
        currency: checkout.razorpay.currency,
        order_id: checkout.razorpay.orderId,

        handler: async (response: any) => {
          try {
            await verifyCheckout({
              orderId: checkout.order._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            navigate("/order-success");

            toast.success("Payment Successful");
          } catch {
            toast.error("Payment verification failed");
          }
        },
      });

      razorpay.open();
    } catch {
      toast.error("Payment Checkout failed");
    }
  }

 async function PayWithPoints(addressId?: string, promoCode?: string) {
   if (!user) {
     return toast.error("Login to Continue");
   }

   if (!addressId) {
     return toast.error("Add Default address in the profile");
   }

   if (!cart?.items.length) {
     return toast.error("Cart is Empty.");
   }

   const finalPrice = cart.items.reduce((sum, item) => {
     return sum + item.price;
   }, 0);

   if (!points) {
     return toast.error("Not Enough points");
   }

   if (finalPrice > points.points) {
     return toast.error("Not Enough Points");
   }

   try {
    setOpen(false)
     await PayWithPointsMutation({
       addressid: addressId,
       promoCode: promoCode || "",
     });

     navigate("/order-success");

     toast.success("Order placed Successfully");
   } catch (error) {
     console.error(error);
     toast.error("Order Failed");
   }
 }

  return {
    PayRazorpay,
    PayWithPoints
  };
}
