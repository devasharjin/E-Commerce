import { Card, CardContent } from "@/components/ui/card"
import type { ProductCategory } from "@/features/customer/collections/types"
import { ArrowRight, Grid2X2 } from "lucide-react"
import { Link } from "react-router-dom"

type RenderHomeCategoriesPropsType = {
  categoreies: ProductCategory[] | undefined
}

const RenderHomeCategories = ({
  categoreies,
}: RenderHomeCategoriesPropsType) => {
  if (!categoreies?.length) return null

  return (
    <section className="py-8">
      <div className="mb-10 ">
        <h2 className="text-4xl font-bold tracking-tight text-gray-900">
          Browse By Collection
        </h2>

        <p className="mt-3 text-gray-500">
          Discover products organized by category.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {categoreies.slice(0, 4).map((category) => (
          <Link
            key={category._id}
            to={`/collections?category=${category._id}`}
            className="group"
          >
            <Card className="h-full overflow-hidden rounded-[28px] border border-pink-100 bg-pink-50/50 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-pink-300 hover:bg-pink-50 hover:shadow-xl">
              <CardContent className="flex h-56 flex-col items-center justify-center p-6 text-center">
                {/* Icon */}
                <div className="mb-6 rounded-full bg-pink-100 p-5 text-pink-500 transition-all duration-300 group-hover:scale-110">
                  <Grid2X2 className="h-8 w-8" />
                </div>

                {/* Category Name */}
                <h3 className="text-xl font-semibold tracking-tight text-gray-800">
                  {category.name}
                </h3>

                {/* CTA */}
                <div className="mt-5 flex items-center gap-2 text-sm font-medium text-pink-500 transition-all duration-300 group-hover:gap-3">
                  <span>View Collection</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default RenderHomeCategories