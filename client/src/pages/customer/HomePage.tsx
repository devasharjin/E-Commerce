import RenderHomeBanner from "@/components/customer/Home/banner-render";
import RenderHomeCategories from "@/components/customer/Home/render-categoreis";
import RenderHomeCoupons from "@/components/customer/Home/render-coupons";
import RenderHomeProducts from "@/components/customer/Home/render-products";
import { useHome } from "@/features/customer/Home/api";

const CustomerHomePage = () => {
  const { data } = useHome();

  console.log(data);

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-6">
      <section>
        <RenderHomeBanner banners={data?.banner} />
      </section>

      <section>
        <RenderHomeCategories categoreies={data?.categories} />
      </section>

      <section>
        <RenderHomeCoupons coupons={data?.coupons} />
      </section>

      <section>
        <RenderHomeProducts products={data?.products} />
      </section>
    </div>
  );
};

export default CustomerHomePage;