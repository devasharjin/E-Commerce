export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type OrderStatus = "placed" | "shipped" | "delivered" | "returned";

export type Order = {
  orders:[ {
    _id: string;
    code: string;
    totalItems: number;
    totalAmount: number;
    orderStatus: OrderStatus;
    paymentStatus: PaymentStatus;
    returnedAt: Date;
    deliveredAt: Date;
    createdAt: Date;
    paidAt: Date;
  }]
};

export type singleOrder = {
  _id: string;
  code: string;
  totalItems: number;
  totalAmount: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  returnedAt: Date;
  deliveredAt: Date;
  createdAt: Date;
  paidAt: Date;
};

export type OrderReturnStatus = {
  id: string;
  orderStatus: OrderStatus;
  returnedAt: Date;
};
