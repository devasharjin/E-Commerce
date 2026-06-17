import { use, useCallback, useEffect, useState } from "react";
import type { Category, Product } from "./type";
import { getAdminCategory, getAdminProducts } from "./api";


export function useAdminProducts() {
    const [search, setSearch] = useState("")
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(false)
    const [productDialogOpen, setProductDialogOpen] = useState(false)
    const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
    const [editingProducts, setEditingProduct] = useState<Product | null>(null)

   function openCreateDialog() {
    setEditingProduct(null);
    setProductDialogOpen(true);
  }

  function openEditDialog (product : Product){
    setEditingProduct(product)
    setProductDialogOpen(true)
  }

    function closeProductDialog() {
    setProductDialogOpen(false);
    setEditingProduct(null);
  }
    const loadCategories = useCallback(async()=>{
        const data = await getAdminCategory()
        setCategories(data)
    },[])

    const loadProducts = useCallback(async(searchValue : string = '')=>{
        setLoading(true)
        try {
            const data = await getAdminProducts(searchValue)
            setProducts(data)
        } catch (error) {
            console.log('fetch failed')
        } finally{
            setLoading(false)
        }
    },[])

    const refreshAll = useCallback(async () => {
  await Promise.all([
    loadCategories(),
    loadProducts(search),
  ]);
}, [loadCategories, loadProducts, search]);

    useEffect(()=>{
        void loadCategories()
    },[loadCategories])


    useEffect(()=>{
        const timer = setTimeout(() => {
            void loadProducts(search)
        }, 250);
        
        
        return ()=>clearTimeout(timer)
    },[search,loadProducts])

    return {
        search,
        setSearch,
        categories,
        setCategories,
        products,
        setProducts,
        loading, 
        setLoading,
        categoryDialogOpen,
        setCategoryDialogOpen,
        productDialogOpen,
        openCreateDialog,
        setProductDialogOpen,
        editingProducts,
        refreshAll,
        closeProductDialog,
        openEditDialog

    }
}

