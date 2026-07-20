import type {
  OrderStatus,
  PaymentStatus,
} from "@/features/customer/Orders/types";

export type AdminOrderResponse = {
  orders: [
    {
      id: string;
      code: string;
      customerName: string;
      customerEmail: string;
      totalItems: number;
      totalAmount: number;
      orderStatus: OrderStatus;
      paymentStatus: PaymentStatus;
      returnedAt: Date;
      deliveredAt: Date;
      createdAt: Date;
      paidAt: Date;
    },
  ];
};


export type updateAdminOrderResponse = {
  id: string;
  orderStatus: OrderStatus;
  deliveredAt: Date;
  returnedAt: Date;
};

export type updateAdminOrderBody = {
  orderStatus : OrderStatus
};
