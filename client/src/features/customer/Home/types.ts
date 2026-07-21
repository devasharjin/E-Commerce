import type { Banner } from "@/features/admin/settings/types";
import type { Product, ProductCategory } from "../collections/types";
import type { Promo } from "@/features/admin/promo/type";

export type HomeResponse = {
  banner: Banner[];
  categories: ProductCategory[];
  products: Product[];
  coupons: Promo[];
};
