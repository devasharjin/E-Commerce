import { apiGet } from "@/lib/api";
import type { AdminDashboard } from "./types";
import { useQuery } from "@tanstack/react-query";


function getAdminDashboard(){
  return apiGet<AdminDashboard>('/admin/dashboard')
}

export function useAdminDashboard (){
  return useQuery({
    queryKey : ['dashboard'],
    queryFn : getAdminDashboard
  })
}