import { apiDelete, apiGet, apiPost, apiPut } from "@/lib/api";
import type { FormPromo, Promo } from "./type";

type PromoResponse = {
  promos: Promo[];
};

export function getAllPromosApi(search?: string) {
  const query = search?.trim()
    ? `/admin/promos?search=${encodeURIComponent(search.trim())}`
    : "/admin/promos";

  return apiGet<PromoResponse>(query);
}
export function createPromoApi(body : FormPromo){

    return apiPost<Promo[],FormPromo>('/admin/promos',body)
}

export function updatePromoApi(id : string , body : FormPromo ){

    return apiPut<Promo[],FormPromo>(`/admin/promos/${id}`,body)
}

export function deletePromoApi(id : string ){

    return apiDelete<Promo[]>(`/admin/promos/${id}`)
}
