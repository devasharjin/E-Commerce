import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api";
import type { Address, AddressBodyForm } from "./types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function getAddress() {
  return apiGet<Address[]>("/customer/address");
}

function createAddress(body: AddressBodyForm) {
  return apiPost<Address[], AddressBodyForm>("/customer/address", body);
}

function updateAddress(body: AddressBodyForm, id: string) {
  return apiPut<Address[], AddressBodyForm>(`/customer/address/${id}`, body);
}

function deleteAddress(id: string) {
  return apiDelete<Address[]>(`/customer/address/${id}`);
}

export function useAddresses() {
  return useQuery({
    queryKey: ["address"],
    queryFn: getAddress,
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: AddressBodyForm) => createAddress(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["address"],
      });
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ body, id }: { body: AddressBodyForm; id: string }) =>
      updateAddress(body, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["address"],
      });
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["address"],
      });
    },
  });
}
