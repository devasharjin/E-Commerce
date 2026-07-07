import { apiDelete, apiGet, apiPost } from "@/lib/api";
import type { CustomerWishlist, CustomerWishlistBody } from "./types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function getCustomerWishlistApi() {
  return apiGet<CustomerWishlist[]>("/customer/wishlist");
}

function createCustomerWishlistApi(productId: string) {
  return apiPost<CustomerWishlist[], CustomerWishlistBody>(
    "/customer/wishlist",
    { productId },
  );
}

function deleteCustomerWishlistApi(productId: string) {
  return apiDelete<CustomerWishlist[]>(`customer/wishlist/${productId}`);
}

export function useGetCustomerWishlist() {
  return useQuery({
    queryKey: ["wishlists"],
    queryFn: getCustomerWishlistApi,
  });
}

export function useUpdateCustomerWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => createCustomerWishlistApi(productId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["wishlists"],
      });
    },
  });
}

export function useDeleteCustomerWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => deleteCustomerWishlistApi(productId),
    onSuccess: async() => {
      await queryClient.invalidateQueries({
        queryKey: ["wishlists"],
      });
    },
  });
}
