import { Card, CardContent } from "@/components/ui/card"
import { getCover } from "@/features/customer/collections/collections.shared"
import type { Product } from "@/features/customer/collections/types"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

export type RenderHomeProductsPropsType = {
  products: Product[] | undefined
}

const RenderHomeProducts = ({ products }: RenderHomeProductsPropsType) => {
  if (!products?.length) return null

  return (
    <section className="py-8">
      <div className="mb-10">
        <p className="text-sm font-medium uppercase tracking-wider text-pink-500">
          Latest
        </p>

        <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
          Recent Products
        </h2>

        <p className="mt-2 text-gray-500">
          Discover our newest arrivals and trending products.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.slice(0, 4).map((product) => {
          const discountedPrice = product.salesPercentage
            ? product.price - (product.price * product.salesPercentage) / 100
            : product.price

          return (
            <Link
              key={product._id}
              to={`/collection/${product._id}`}
              className="group"
            >
              <Card className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

                {/* Product Image */}
                <div className="relative h-56 overflow-hidden bg-gray-50">
                  <img
                    src={getCover(product.images)}
                    alt={product.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {product.salesPercentage && (
                    <span className="absolute left-4 top-4 rounded-full bg-pink-500 px-3 py-1 text-xs font-semibold text-white">
                      {product.salesPercentage}% OFF
                    </span>
                  )}
                </div>

                <CardContent className="p-5">
                  {/* Brand */}
                  <p className="text-sm text-gray-400">
                    {product.brand}
                  </p>

                  {/* Title */}
                  <h3 className="mt-1 line-clamp-1 text-lg font-semibold text-gray-900">
                    {product.title}
                  </h3>

                  {/* Price */}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xl font-bold text-gray-900">
                      ₹{Math.round(discountedPrice)}
                    </span>

                    {!(product.salesPercentage === 0) && (
                      <span className="text-sm text-gray-400 line-through">
                        ₹{product.price}
                      </span>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="mt-5 flex items-center gap-2 text-sm font-medium text-pink-500 transition-all group-hover:gap-3">
                    View Product
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>

              </Card>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default RenderHomeProducts