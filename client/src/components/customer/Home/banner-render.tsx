import { Card } from "@/components/ui/card"
import type { Banner } from "@/features/admin/settings/types"

type RenderHomeBannerPropsType = {
  banners: Banner[] | undefined
}

const RenderHomeBanner = ({ banners }: RenderHomeBannerPropsType) => {
  if (!banners?.length) {
    return null
  }

  const mainBanner = banners[0].imageUrl
  const subBanner = banners.slice(1, 3)

  return (
    <div className="w-full">
      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Banner */}
        <Card className="group overflow-hidden rounded-[32px] border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:col-span-2">
          <img
            src={mainBanner}
            alt="Banner Image"
            className="h-105 w-full rounded-[32px] object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
          />
        </Card>

        {/* Side Banners */}
        <div className="flex flex-col gap-6">
          {subBanner.map((banner, index) => (
            <Card
              key={index}
              className="group overflow-hidden rounded-[32px] border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <img
                src={banner.imageUrl}
                alt="Banner Image"
                className="h-48 w-full rounded-[32px] object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
              />
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RenderHomeBanner