import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getSalePrice } from "@/features/customer/collections/collections.shared";
import type { Product } from "@/features/customer/collections/types";
import { formatMoney } from "@/lib/utils";
import { Heart, ShoppingCart } from "lucide-react";
import ProductOptionsGroup from "./product-options-group";

type ProductDetailsSummaryProps = {
  product: Product;
  selectedColor: string;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  setSelectedColor: (color: string) => void;
};

const ProductDetailsSummary = ({
  product,
  selectedColor,
  selectedSize,
  setSelectedColor,
  setSelectedSize,
}: ProductDetailsSummaryProps) => {
  const salePrice = getSalePrice(product);
  const hasSale = !!product.salesPercentage;

  return (
    <div className="space-y-8">

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        <Badge>{product.category.name}</Badge>

        <Badge variant={product.stock < 5 ? "destructive" : "secondary"}>
          {product.stock < 5
            ? `Only ${product.stock} left`
            : "In Stock"}
        </Badge>

        {hasSale && (
          <Badge className="bg-red-600">
            {product.salesPercentage}% OFF
          </Badge>
        )}
      </div>

      {/* Title */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground uppercase tracking-wide">
          {product.brand}
        </p>

        <h1 className="text-4xl font-bold leading-tight">
          {product.title}
        </h1>

        <p className="text-muted-foreground leading-7">
          {product.description}
        </p>
      </div>

      {/* Price */}
      <div className="flex items-center gap-4">
        <h2 className="text-4xl font-bold">
          {formatMoney(salePrice)}
        </h2>

        {hasSale && (
          <span className="text-xl text-muted-foreground line-through">
            {formatMoney(product.price)}
          </span>
        )}
      </div>

      <Separator />

      {/* Color */}
      {product.colors.length > 0 && (
        <div className="space-y-3">
          <p className="font-semibold">
            Color:
            <span className="ml-2 font-normal text-muted-foreground">
              {selectedColor}
            </span>
          </p>

          <ProductOptionsGroup
            value={product.colors}
            variant="color"
            selectedValue={selectedColor}
            onSelect={setSelectedColor}
          />
        </div>
      )}

      {/* Size */}
      {product.sizes.length > 0 && (
        <div className="space-y-3">
          <p className="font-semibold">
            Size:
            <span className="ml-2 font-normal text-muted-foreground">
              {selectedSize}
            </span>
          </p>

          <ProductOptionsGroup
            value={product.sizes}
            variant="size"
            selectedValue={selectedSize}
            onSelect={setSelectedSize}
          />
        </div>
      )}

      <Separator />

      {/* Buttons */}
      <div className="flex gap-4">
        <Button size="lg" className="flex-1" disabled={product.stock===0} >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Add to Cart
        </Button>

        <Button size="lg" variant="outline">
          <Heart className="h-5 w-5" />
        </Button>
      </div>

      {/* Extra Info */}
      <div className="rounded-xl border p-5 space-y-3 text-sm text-muted-foreground">
        <div className="flex justify-between">
          <span>Brand</span>
          <span className="font-medium text-foreground">
            {product.brand}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Category</span>
          <span className="font-medium text-foreground">
            {product.category.name}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Availability</span>
          <span className="font-medium text-foreground">
            {product.stock} Items
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSummary;