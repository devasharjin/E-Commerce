import { create } from "zustand"
import type {  Product, ProductImage } from "../types"
import { getCover } from "../collections.shared"

type ProductDetailsStoreTypes = {
    
    selectedImage : string,
    selectedColor : string,
    selectedSize : string,
    initialize : (product :Product )=>void,
    setSelectedImage : (value : string)=>void,
    setSelectedColor : (value : string)=>void,
    setSelectedSize : (Value : string)=>void,
    clear : ()=> void
}

export const useProductDetailsStore = create<ProductDetailsStoreTypes>((set,get)=>({
  selectedColor : "",
  selectedImage : "",
  selectedSize : "",
  initialize : (product)=>set({
    selectedImage : getCover(product.images),
    selectedColor : product.colors[0] || "",
    selectedSize : product.sizes[0] || ''
  }),
  setSelectedColor : (value : string)=> set({
    selectedColor : value
  }),
  setSelectedSize : (value : string)=>set({
    selectedSize : value
  }),
  setSelectedImage : (value : string)=>set({
    selectedImage : value
  }),
  clear : ()=> set({
    selectedColor : "",
    selectedImage : "",
    selectedSize : ""
  })

}))