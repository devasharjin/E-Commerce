
import { apiGet } from "@/lib/api";
import {  type Product, type ProductAppliedFilterListQuery, type ProductCategory, type ProductDetails } from "./types";
import { useQuery } from "@tanstack/react-query";


function getCategoriesApi(){
    return apiGet<ProductCategory[]>('/customer/categories')
}

function getAllProductsApi(params : ProductAppliedFilterListQuery){
    const searchParams = new URLSearchParams()

    if(params.category){
        searchParams.set('category',params.category)
    }
    if(params.brand){
        searchParams.set('brand',params.brand)
    }
    if(params.color){
        searchParams.set('color',params.color)
    }
    if(params.size){
        searchParams.set('size',params.size)
    }
    if(params.sort){
        searchParams.set('sort',params.sort)
    }

    const query = searchParams.toString()
    const url = query ? `/customer/products?${query}` : '/customer/products'

    return apiGet<Product[]>(url)
}


function getSingleProductApi(productId : string){
    return apiGet<ProductDetails>(`/customer/products/${productId}`)
}



export function useCategories(){
    return useQuery({
        queryKey : ['categories'],
        queryFn : getCategoriesApi
    })
}

export function useAllProducts(params : ProductAppliedFilterListQuery){
    return useQuery({
        queryKey : ['products',params],
        queryFn : ()=>getAllProductsApi(params)
    })
}

export function useSingleProduct(productId : string){
    return useQuery({
        queryKey : ['product',productId],
        queryFn : ()=>getSingleProductApi(productId),
        enabled : !!productId
    })
}