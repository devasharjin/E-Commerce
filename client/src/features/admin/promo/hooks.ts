import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPromoApi,
  deletePromoApi,
  getAllPromosApi,
  updatePromoApi,
} from "./api";
import type { FormPromo } from "./type";

export function usePromosData(search?: string) {
  return useQuery({
    queryKey: ["promos", search],
    queryFn: () => getAllPromosApi(search),
  });
}

export function useCreateMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: FormPromo) => createPromoApi(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["promos"],
      });
    },
  });
}

type UpdatePromoPayload = {
  id: string;
  body: FormPromo;
};

export function useUpdateMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: UpdatePromoPayload) => updatePromoApi(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["promos"],
      });
    },
  });
}

export function useDeleteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePromoApi(id),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["promos"],
      }),
  });
}
