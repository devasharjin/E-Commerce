import express from "express";
import "dotenv/config.js";
import { connectToDB } from "./db.js";
import { notFound } from "./middleware/notFound.js";
import { ErrorHandler } from "./middleware/ErrorHandler.js";
import cors from "cors";
import morgan from "morgan";
import dns from "dns";
import cookieParser from "cookie-parser";
import { AuthRouter } from "./routes/auth/auth.route.js";
import { AdminProductRouter } from "./routes/admin/product.route.js";
import customerAddressRoute from "./routes/customer/address.route.js";
import customerProductRoute from "./routes/customer/product.route.js";
import AdminPromoRoute from "./routes/admin/promo.route.js";
import CustomerPromoRoute from "./routes/customer/promo.route.js";
import CustomerCartRoute from "./routes/customer/cart.route.js";
import CustomerWishlistRoute from "./routes/customer/wishlist.route.js";
import CustomerCheckoutRouter from "./routes/customer/checkout.route.js";
import AdminOrderRouter from "./routes/admin/order.router.js";
import AdminSettingsRoute from "./routes/admin/settings.route.js";
import AdminDashboardRoute from "./routes/admin/dashboard.route.js";
import checkoutWithPromoRouter from "./routes/customer/checkout_with-promo.routes.js";
import customerOrderRouter from "./routes/customer/order.routes.js";
import CustomerHomeRoutes from "./routes/customer/Home.route.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");

//connect DB

connectToDB();

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));

const corsOrigin = process.env.CORSORIGIN;

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  }),
);

//Auth Routes

app.use("/auth", AuthRouter);

//Admin Routes
app.use("/admin", AdminProductRouter);
app.use("/admin", AdminPromoRoute);
app.use("/admin", AdminOrderRouter);
app.use("/admin", AdminSettingsRoute);
app.use("/admin", AdminDashboardRoute);

//Customer Routes
app.use("/customer", customerProductRoute);
app.use("/customer", customerAddressRoute);
app.use("/customer", CustomerPromoRoute);
app.use("/customer", CustomerCartRoute);
app.use("/customer", CustomerWishlistRoute);
app.use("customer", CustomerCheckoutRouter);
app.use("/customer", checkoutWithPromoRouter);
app.use("customer", customerOrderRouter);
app.use("/custommer", CustomerHomeRoutes);

//middleware

app.use(notFound);
app.use(ErrorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("server is running");
});
