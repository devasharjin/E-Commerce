import { apiGet, apiPost } from "@/lib/api";
import type { Order, OrderReturnStatus } from "./types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export function getOrderApi (){
  return apiGet<Order>('/customer/orders')
}

export function updateOrdeApi (orderId : string){
  return apiPost<OrderReturnStatus>(`/customer/orders/return/${orderId}`)
}

export function useAllOrder (){
  return useQuery({
    queryKey : ['orders'],
    queryFn : getOrderApi
  })
}

export function useOrderReturn (){
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn : (orderid : string)=>updateOrdeApi(orderid),
    onSuccess : ()=>queryClient.invalidateQueries({
      queryKey : ['orders']
    })
  })
}