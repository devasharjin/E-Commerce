import { apiGet } from "@/lib/api";
import type { HomeResponse } from "./types";
import { useQuery } from "@tanstack/react-query";


function getHome (){
  return apiGet<HomeResponse>('/customer/home')
}

export function useHome (){
  return useQuery({
    queryKey : ['home'],
    queryFn : getHome
  })
}