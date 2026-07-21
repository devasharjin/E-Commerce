import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import type { Promo } from "@/features/admin/promo/type"
import { Ticket, Copy } from "lucide-react"

type RenderHomeCouponsPropsType = {
  coupons: Promo[] | undefined
}

const RenderHomeCoupons = ({
  coupons,
}: RenderHomeCouponsPropsType) => {
  if (!coupons?.length) return null

  return (
    <section className="py-10">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-pink-500">
          Offers
        </p>

        <h2 className="mt-2 text-4xl font-bold tracking-tight text-gray-900">
          Live Coupon Cards
        </h2>

        <p className="mt-3 text-gray-500">
          Grab these exclusive discounts before they expire.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {coupons.slice(0, 4).map((coupon) => (
          <Card
            key={coupon.code}
            className="group relative overflow-hidden rounded-3xl border border-pink-100 bg-gradient-to-br from-white via-pink-50 to-pink-100/60 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
          >
            {/* Decorative circles */}
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-pink-200/40" />

            <div className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-pink-200/30" />

            <CardContent className="relative flex h-64 flex-col items-center justify-center p-6 text-center">
              {/* Icon */}
              <div className="mb-5 rounded-2xl bg-pink-500 p-4 text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
                <Ticket className="h-7 w-7" />
              </div>

              {/* Discount */}
              <Badge className="rounded-full bg-pink-100 px-4 py-1 text-pink-600 hover:bg-pink-100">
                {coupon.percentage}% OFF
              </Badge>

              <p className="mt-4 text-sm text-gray-500">
                Use coupon code
              </p>

              {/* Coupon Code */}
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-dashed border-pink-300 bg-white px-5 py-2 font-bold tracking-widest text-pink-600 shadow-sm">
                <span>{coupon.code}</span>

                <Copy className="h-4 w-4 text-pink-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default RenderHomeCoupons