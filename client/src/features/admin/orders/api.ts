import { apiGet, apiPut } from "@/lib/api";
import type { AdminOrderResponse, updateAdminOrderBody, updateAdminOrderResponse } from "./types";
import type { OrderStatus } from "@/features/customer/Orders/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


function getAdminOrders (){
  return apiGet<AdminOrderResponse>('/admin/orders')
}

function updateAdminOrder(orderId : string, orderStatus : OrderStatus){
  return apiPut<updateAdminOrderResponse,updateAdminOrderBody>(`/admin/orders/${orderId}`,{orderStatus})
}

export function useGetAdminOrders (){
  return useQuery({
    queryKey : ['adminOrders'],
    queryFn : getAdminOrders
  })
}

export function useUpdateAdminOrdrs(){
  const queryclient = useQueryClient()
  return useMutation({
    mutationFn: ({
      orderId,
      orderStatus,
    }: {
      orderId: string;
      orderStatus: OrderStatus;
    }) => updateAdminOrder(orderId, orderStatus),
    onSuccess: () =>
      queryclient.invalidateQueries({
        queryKey: ["adminOrders"],
      }),
  });
}