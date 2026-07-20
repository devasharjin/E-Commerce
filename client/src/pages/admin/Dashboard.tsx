import Loader from "@/components/common/Loader";
import { Card, CardContent } from "@/components/ui/card";
import { useAdminDashboard } from "@/features/admin/dashBoard/api";
import {
  Boxes,
  IndianRupee,
  Layers3,
  PackageCheck,
  RotateCcw,
} from "lucide-react";

const AdminDashboard = () => {
  type DashboardData = {
    totalProducts: number;
    totalCategories: number;
    totalSales: number;
    totalOrders: number;
    totalReturnedOrders: number;
  };

  const { data } = useAdminDashboard();

  const Items: {
    key: keyof DashboardData;
    label: string;
    icon: React.ElementType;
  }[] = [
      {
        key: "totalProducts",
        label: "Total Products",
        icon: Boxes,
      },
      {
        key: "totalCategories",
        label: "Total Categories",
        icon: Layers3,
      },
      {
        key: "totalSales",
        label: "Total Sales",
        icon: IndianRupee,
      },
      {
        key: "totalOrders",
        label: "Total Orders",
        icon: PackageCheck,
      },
      {
        key: "totalReturnedOrders",
        label: "Returned Orders",
        icon: RotateCcw,
      },
    ];

  if (!data) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Card className="p-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your store statistics
        </p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Items.map((item) => (
          <Card
            key={item.key}
            className="rounded-3xl border-0 bg-zinc-50 shadow-none hover:bg-zinc-100 transition"
          >
            <CardContent className="p-6">

              <div className="flex gap-6">
                <item.icon className="mb-6 h-8 w-8 text-primary" />
                <div className="flex flex-col">
                  <p className="text-sm text-muted-foreground">
                    {item.label}
                  </p>

                  <h2 className="mt-2 text-4xl font-bold">
                    {item.key === "totalSales"
                      ? `₹${data[item.key].toLocaleString()}`
                      : data[item.key].toLocaleString()}
                  </h2>
                </div>
              </div>
              

             
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;