

export type ProductImage = {
  url: string;
  publicId: string;
  isCover: boolean;
};

export type ProductCategory = {
  _id: string;
  name: string;
};

export type Product = {
  _id: string;
  title: string;
  description: string;
  category: ProductCategory;
  brand: string;
  stock: number;
  images: ProductImage[];
  colors: string[];
  sizes: ("S" | "M" | "L" | "XL")[];
  price: number;
  salesPercentage: number;
  status: "active" | "inactive";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type ProductSort = "recent" | "price-low" | "price-high";

export type ProductAppliedFilterListQuery = {
  category?: string;
  brand?: string;
  color?: string;
  size?: "S" | "M" | "L" | "XL";
  sort?: ProductSort;
};



export type ProductDetails = {
  product: Product;
  relatedProducts: Product[];
};
