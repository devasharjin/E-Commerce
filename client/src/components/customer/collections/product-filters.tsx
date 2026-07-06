import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  BRANDS,
  SIZE_OPTIONS,
} from "@/features/customer/collections/collections.shared"
import type { ProductCategory } from "@/features/customer/collections/types"

type ProductFiltersProps = {
  hasActiveFilters: boolean
  category: ProductCategory[] | undefined
  toggleFilterFacets: (key: string, value: string) => void
  availableColors: string[]
  clearFilter: () => void
}

const ProductFilters = ({
  hasActiveFilters,
  category,
  toggleFilterFacets,
  availableColors,
  clearFilter,
}: ProductFiltersProps) => {
  return (
    <Card className="sticky top-24 rounded-2xl border shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Filters</CardTitle>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilter}
              className="text-muted-foreground hover:text-destructive"
            >
              Clear
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Categories */}
        <section className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Categories
          </h3>

          <div className="flex flex-wrap gap-2">
            {category?.map((item) => (
              <Button
                key={item._id}
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => toggleFilterFacets("category", item._id)}
              >
                {item.name}
              </Button>
            ))}
          </div>

          <Separator />
        </section>

        {/* Brands */}
        <section className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Brands
          </h3>

          <div className="flex flex-wrap gap-2">
            {BRANDS.map((brand) => (
              <Button
                key={brand}
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => toggleFilterFacets("brand", brand)}
              >
                {brand}
              </Button>
            ))}
          </div>

          <Separator />
        </section>

        {/* Colors */}
        <section className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Colors
          </h3>

          <div className="flex flex-wrap gap-3">
            {availableColors.map((color) => (
              <button
                key={color}
                title={color}
                onClick={() => toggleFilterFacets("color", color)}
                className="h-9 w-9 rounded-full border-2 border-border transition hover:scale-110 hover:border-primary"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <Separator />
        </section>

        {/* Sizes */}
        <section className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Sizes
          </h3>

          <div className="flex flex-wrap gap-2">
            {SIZE_OPTIONS.map((size) => (
              <Button
                key={size}
                variant="outline"
                size="sm"
                className="min-w-12 rounded-full"
                onClick={() => toggleFilterFacets("size", size)}
              >
                {size}
              </Button>
            ))}
          </div>
        </section>
      </CardContent>
    </Card>
  )
}

export default ProductFilters