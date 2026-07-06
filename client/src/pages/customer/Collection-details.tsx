import Loader from "@/components/common/Loader";
import RelatedProducts from "@/components/customer/collection-details/related-products";
import { useSingleProduct } from "@/features/customer/collections/api";
import { useProductDetailsStore } from "@/features/customer/collections/Collection-details/store";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import ProductDetailsSummary from "@/components/customer/collection-details/product-details-summary";
import ProductDetailsGallery from "@/components/customer/collection-details/product-details-gallery";

const CollectionDetails = () => {
  const { id = "" } = useParams();

  const { data: response, isLoading } = useSingleProduct(id);

  const product = response?.product;
  const relatedProduct = response?.relatedProducts

  const {
    initialize,
    clear,
    selectedColor,
    selectedImage,
    setSelectedSize,
    setSelectedColor,
    setSelectedImage,
    selectedSize
  } = useProductDetailsStore();



  useEffect(() => {
    if (!product) return;

    initialize(product)
    return () => clear();
  }, [product, clear]);

  if (isLoading || !product) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-10">
        {/* Back Button */}
        <Link
          to="/collections"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Collections
        </Link>

        {/* Header */}
        <div className="mt-8 space-y-2 border-b pb-8">
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            {product.brand}
          </p>

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {product.title}
          </h1>
        </div>

        {/* Product Section */}
        <section className="mt-12 grid gap-12 lg:grid-cols-[0.85fr_0.85fr]">
          <ProductDetailsGallery
            product={product}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />

          <div className="lg:sticky lg:top-24 h-fit">
            <ProductDetailsSummary
              product={product}
              selectedColor = {selectedColor}
              selectedSize= {selectedSize}
              setSelectedColor={setSelectedColor}
              setSelectedSize={setSelectedSize}
            />
          </div>
        </section>

        <section className="mt-12">
          {relatedProduct?.length ? (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold">The More You Like</h2>
                <p className="text-muted-foreground">
                  Related products
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProduct.map((item) => (
                  <RelatedProducts
                    key={item._id}
                    product={item}
                  />
                ))}
              </div>
            </>
          ) : null}
        </section>
      </div>
    </div>
  );
};

export default CollectionDetails;