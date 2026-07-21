import { createBrowserRouter } from "react-router-dom";
import CustomerLayout from "./components/layout/customerLayout";
import { PublicOnlyLayout } from "./components/auth/PublicOnlyLayout";
import GoogleSignIn from "./pages/auth/GoogleLogin";
import CustomerHomePage from "./pages/customer/HomePage";
import { ProtectedLayout } from "./components/auth/protectedLayout";
import { RoleGuardLayout } from "./components/auth/RoleGuard";
import AdminLayout from "./components/layout/adminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminCoupons from "./pages/admin/Promos";
import AdminOrders from "./pages/admin/Orders";
import AdminProducts from "./pages/admin/Products";
import AdminSettings from "./pages/admin/Settings";
import AuthProvider from "./features/auth/AuthProvider";
import Collections from "./pages/customer/Collections";
import CollectionDetails from "./pages/customer/Collection-details";
import OrderSuccess from "./pages/customer/Order-Success";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthProvider />,
    children: [
      // Public-only routes (outside CustomerLayout)
      {
        element: <PublicOnlyLayout />,
        children: [
          {
            path: "signin",
            element: <GoogleSignIn />,
          },
        ],
      },

      // Customer routes
      {
        element: <CustomerLayout />,
        children: [
          {
            index: true,
            element: <CustomerHomePage />,
          },
          {
            path: "collections",
            element: <Collections />,
          },

          {
            path: "collection/:id",
            element: <CollectionDetails />,
          },

          {
            element: <ProtectedLayout />,
            children: [
              {
                path: "order-success",
                element: <OrderSuccess />,
              }
            ],
          },
        ],
      },

      // Admin routes
      {
        path: "admin",
        element: <ProtectedLayout />,
        children: [
          {
            element: <RoleGuardLayout allow={["admin"]} />,
            children: [
              {
                element: <AdminLayout />,
                children: [
                  {
                    index: true,
                    element: <AdminDashboard />,
                  },
                  {
                    path: "coupons",
                    element: <AdminCoupons />,
                  },
                  {
                    path: "orders",
                    element: <AdminOrders />,
                  },
                  {
                    path: "products",
                    element: <AdminProducts />,
                  },
                  {
                    path: "settings",
                    element: <AdminSettings />,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);