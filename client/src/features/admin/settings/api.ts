import { apiGet, apiPost } from "@/lib/api";
import type { Banner } from "./types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function getAllBannersApi() {
  return apiGet<Banner[]>("/admin/settings");
}

function createBannersApi(formData: FormData) {
  return apiPost<Banner[], FormData>("/admin/settings", formData);
}

export function useAllBanners() {
  return useQuery({
    queryKey: ["banners"],
    queryFn: getAllBannersApi,
  });
}

export function useCreateBanners() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => createBannersApi(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["banners"],
      });
    },
  });
}
