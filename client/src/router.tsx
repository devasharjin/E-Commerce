import { createBrowserRouter } from "react-router-dom";
import CustomerLayout from "./components/layout/customerLayout";
import { PublicOnlyLayout } from "./components/auth/PublicOnlyLayout";
import GoogleSignIn from "./pages/auth/GoogleLogin";
import CustomerHomePage from "./pages/customer/HomePage";
import CustomerProfile from "./pages/customer/Profile";
import { ProtectedLayout } from "./components/auth/protectedLayout";
import { RoleGuardLayout } from "./components/auth/RoleGuard";
import AdminLayout from "./components/layout/adminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminCoupons from "./pages/admin/Coupons";
import AdminOrders from "./pages/admin/Orders";
import AdminProducts from "./pages/admin/Products";
import AdminSettings from "./pages/admin/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <CustomerLayout />,
    children: [
      {
        index: true,
        element: <CustomerHomePage />
      },
      {
        element: <PublicOnlyLayout />,
        children: [
          {
            path: "signin",
            element: <GoogleSignIn />,
          },
        ],
      }, {
        element: <ProtectedLayout />,
        children: [
          {
            path: "profile",
            element: <CustomerProfile />,
          },
        ]
      }
    ],
  },
  {
    path: 'admin',
    children: [
      {
        element: <ProtectedLayout />,
        children: [

          {
            element: <RoleGuardLayout allow={['admin']} />,
            children: [
              {
                element: <AdminLayout />,
                children: [
                  {
                    index: true,
                    element: <AdminDashboard />
                  },
                  {
                    path : 'coupons',
                    element: <AdminCoupons/>
                  },
                  {
                    path : 'orders',
                    element: <AdminOrders/>
                  },
                  {
                    path : 'products',
                    element: <AdminProducts/>
                  },
                  {
                    path : 'settings',
                    element: <AdminSettings/>
                  },
                ]
              }]
          }
        ]
      }]
  }
]);