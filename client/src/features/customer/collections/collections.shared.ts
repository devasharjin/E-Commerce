import type { Product, ProductImage } from "./types";

export const BRANDS = [
  "Nike",
  "Adidas",
  "Puma",
  "Reebok",
  "Sparx",
  "Sony",
  "Woodland",
  "Red Tape",
  "Levi's",
  "Zara",
] as const;

export const SIZE_OPTIONS = ["S", "M", "L", "XL"] as const;

export function getCover(image : ProductImage[]){
  return image.find((item)=>item.isCover)?.url || image[0].url || ""
}

export function getSalePrice(product : Product){
  if( !product.salesPercentage)
   return product.price
  else
    return Math.round(product.price - (product.salesPercentage*product.price)/100)
}
