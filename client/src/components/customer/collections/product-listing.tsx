import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  getCover,
  getSalePrice,
} from "@/features/customer/collections/collections.shared";
import type { Product } from "@/features/customer/collections/types";
import { formatMoney } from "@/lib/utils";
import { Link } from "react-router-dom";

type ProductsListingProps = {
  product: Product;
};

const ProductListing = ({ product }: ProductsListingProps) => {
  const cover = getCover(product.images);
  const salePrice = getSalePrice(product);

  const hasSale = !!product.salesPercentage;

  return (
    <Card className="group overflow-hidden rounded-2xl border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link to={`/collection/${product._id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          {cover ? (
            <img
              src={cover}
              alt={product.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No Image
            </div>
          )}

          {hasSale && (
            <Badge className="absolute left-3 top-3 rounded-full bg-rose-600 px-3 py-1 text-white shadow">
              {product.salesPercentage}% OFF
            </Badge>
          )}
        </div>

        <CardContent className="space-y-3 p-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {product.brand}
            </p>

            <h3 className="mt-1 line-clamp-2 text-lg font-semibold leading-tight">
              {product.title}
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              {product.category.name}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">
              {formatMoney(salePrice)}
            </span>

            {hasSale && (
              <span className="text-sm text-muted-foreground line-through">
                {formatMoney(product.price)}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between">
            {product.colors.length > 0 ? (
              <div className="flex items-center gap-2">
                {product.colors.slice(0, 4).map((color) => (
                  <span
                    key={color}
                    className="h-6 w-6 rounded-full border border-gray-600"
                    style={{ backgroundColor: color }}
                  />
                ))}

                {product.colors.length > 4 && (
                  <span className="text-xs text-muted-foreground">
                    +{product.colors.length - 4}
                  </span>
                )}
              </div>
            ) : (
              <div />
            )}

            <Button>View Details</Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProductListing;