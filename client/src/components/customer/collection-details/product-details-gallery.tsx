import { Card } from "@/components/ui/card";
import clsx from "clsx";
import type { Product } from "@/features/customer/collections/types";

type ProductDetailsGalleryProps = {
  product: Product;
  selectedImage: string;
  setSelectedImage: (value: string) => void;
};

const ProductDetailsGallery = ({
  product,
  selectedImage,
  setSelectedImage,
}: ProductDetailsGalleryProps) => {
  return (
    <Card className="overflow-hidden rounded-2xl border shadow-sm">
      {/* Main Image */}
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={selectedImage}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3 overflow-x-auto p-4">
        {product.images.map((image) => {
          const isActive = image.url === selectedImage;

          return (
            <button
              key={image.publicId}
              onClick={() => setSelectedImage(image.url)}
              className={clsx(
                "h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all",
                isActive
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-transparent hover:border-muted-foreground/40"
              )}
            >
              <img
                src={image.url}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            </button>
          );
        })}
      </div>
    </Card>
  );
};

export default ProductDetailsGallery;