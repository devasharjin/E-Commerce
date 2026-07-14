export type CartItem = {
  quantity: number;
  size: "S" | "M" | "L" | "XL" | undefined;
  color: string | undefined;
  id: string;
  title: string;
  Category: string;
  brand: string;
  image: string;
  price: number;
};

export type Cart = {
  items: CartItem[];
  totalQuantity: number;
};

export type CartProduct = {
  id: string;
  title: string;
  Category: string;
  brand: string;
  image: string;
  price: number;
};

export type CartBody = {
  id: string;
  quantity: number;
  color?: string;
  size?: "S" | "M" | "L" | "XL";
};

export type DeleteCartBody = {
  id: string;
  color?: string;
  size?: "S" | "M" | "L" | "XL";
};

export type syncItem = {
  product: string;
  quantity: number;
  color?: string;
  size?: "S" | "M" | "L" | "XL";
};

export type syncCart = {
  items: syncItem[];
};

export type CreateCheckoutResponse = {
  razorpay: {
    keyId: string | undefined;
    orderId: string;
    amount: string | number;
    currency: string;
  };
  order: {
    _id: string;
    totalItems: number;
    discountAmount: number;
    totalAmount: number;
  };
};

export type CreateCheckoutBody = {
  addressid: string;
  promoCode: string;
};

export type verifyCheckoutResponse = {
  order: string;
};

export type verifyCheckoutBody = {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
};

export type ApplyPromo = {
  code: string;
  orderValue: number;
};

export type ApplyPromoResponse = {
  code: string;
  percentage: number;
  count: number;
  minimumOrderValue: number;
};

export type PointsResponse = {
  points: number;
};
