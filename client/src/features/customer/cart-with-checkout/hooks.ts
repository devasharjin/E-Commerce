import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { applyPromoApi, createCartApi, createCheckoutSessionApi, deleteCartApi, getCartApi, getPointsApi, payWithPointsApi, syncCartApi, updateCartApi, verifyCheckoutApi } from "./api";
import type { ApplyPromo, CartBody, CreateCheckoutBody, DeleteCartBody, syncItem, verifyCheckoutBody } from "./types";

export function useAllCart() {
  return useQuery({
    queryKey: ["cart"],
    queryFn: getCartApi,
  });
}

export function useCreateCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CartBody) => createCartApi(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });
}

export function useUpdateCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CartBody) => updateCartApi(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });
}

export function useDeleteCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: DeleteCartBody) => deleteCartApi(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });
}

export function useSyncCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: syncItem[]) => syncCartApi(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });
}

export function useCreateCheckout(){
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body : CreateCheckoutBody) => createCheckoutSessionApi(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });
}

export function useVerifyCheckout (){
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: verifyCheckoutBody) => verifyCheckoutApi(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });
}


export function useApplyPromo() {
  return useMutation({
    mutationFn: (body: ApplyPromo) => applyPromoApi(body)
  });
}

export function usePoints() {
  return useQuery({
    queryKey: ["points"],
    queryFn: getPointsApi,
  });
}

export function usePayWithPoinnts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateCheckoutBody) => payWithPointsApi(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });
}



