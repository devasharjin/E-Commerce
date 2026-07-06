import Loader from "@/components/common/Loader";
import ProductFilters from "@/components/customer/collections/product-filters";
import ProductListing from "@/components/customer/collections/product-listing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type {
  Product,
  ProductSort,
} from "@/features/customer/collections/types";
import { useCollections } from "@/features/customer/collections/use-collections";

function Collections() {
  const {
    filters,
    changesort,
    loading,
    products,
    hasActiveFilters,
    categories,
    toggleFilterFacets,
    availableColors,
    clearFilter,
    activeFilters,
  } = useCollections();


  if (loading || !products) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader />
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-rose-50 via-pink-50 to-white">
        <div className="absolute -top-32 right-0 h-80 w-80 rounded-full bg-pink-300/20 blur-3xl" />
        <div className="absolute -bottom-32 left-0 h-80 w-80 rounded-full bg-rose-300/20 blur-3xl" />

        <div className="relative container mx-auto px-6 py-16 md:py-20">
          <Badge className="rounded-full bg-pink-100 px-4 py-1 text-pink-700 hover:bg-pink-100">
            ✨ New Collection
          </Badge>

          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 md:text-6xl">
            Premium{" "}
            <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              Everyday
            </span>{" "}
            Essentials
          </h1>

          <p className="mt-5 max-w-2xl text-lg text-slate-600">
            Discover timeless styles crafted with premium quality, effortless
            comfort, and modern elegance for every occasion.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8 space-y-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold tracking-tight">
                  Collections
                </h2>

                {!loading && (
                  <Badge variant="secondary">
                    {products.length} Products
                  </Badge>
                )}
              </div>

              {activeFilters.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {activeFilters.map((item) => (
                    <Badge
                      key={item.type}
                      variant="outline"
                      className="rounded-full"
                    >
                      {item.type}: {item.value}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filters */}
              <div className="lg:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline">Filters</Button>
                  </SheetTrigger>

                  <SheetContent side="left" className="w-[320px] p-6">
                    <h3 className="mb-6 text-lg font-semibold">Filters</h3>

                    <ProductFilters
                      hasActiveFilters={hasActiveFilters}
                      category={categories}
                      toggleFilterFacets={toggleFilterFacets}
                      availableColors={availableColors}
                      clearFilter={clearFilter}
                    />
                  </SheetContent>
                </Sheet>
              </div>

              <Select
                value={filters.sort}
                onValueChange={(value) =>
                  changesort(value as ProductSort)
                }
              >
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="recent">
                    Newest
                  </SelectItem>

                  <SelectItem value="price-low">
                    Price: Low to High
                  </SelectItem>

                  <SelectItem value="price-high">
                    Price: High to Low
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Layout */}
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block sticky top-24">
            <ProductFilters
              hasActiveFilters={hasActiveFilters}
              category={categories}
              toggleFilterFacets={toggleFilterFacets}
              availableColors={availableColors}
              clearFilter={clearFilter}
            />
          </aside>

          {/* Products */}
          <main>
            {products.length === 0 ? (
              <Card className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border-dashed">
                <div className="space-y-3 text-center">
                  <h3 className="text-2xl font-semibold">No Products Found</h3>

                  <p className="text-muted-foreground">
                    Try adjusting or clearing your filters.
                  </p>

                  {hasActiveFilters && (
                    <Button onClick={clearFilter}>Clear Filters</Button>
                  )}
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product: Product) => (
                  <ProductListing
                    key={product._id}
                    product={product}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Collections;