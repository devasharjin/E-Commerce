import { Router, type Request, type Response } from "express";
import { requireAdmin, requireAuth } from "../../middleware/auth.js";
import { AsyncHandler } from "../../utils/AsyncHandler.js";
import Product from "../../models/product.js";
import Category from "../../models/category.js";
import Order from "../../models/order.js";
import { ok } from "../../utils/envelope.js";

const AdminDashboardRoute = Router();

AdminDashboardRoute.use(requireAuth);
AdminDashboardRoute.use(requireAdmin);

AdminDashboardRoute.get(
  "/dashboard",
  AsyncHandler(async (req: Request, res: Response) => {
    const [totalCategories, totalProducts,salesRow , totalOrders ,totalReturnedOrders] = await Promise.all([
      Category.countDocuments(),
      Product.countDocuments(),
      Order.aggregate([
        {$match : {paymentStatus : 'paid'}},
        {$group : {
            _id : null,
            totalSales : {$sum :'$totalAmount'}
        }}
      ]),
      Order.countDocuments({paymentStatus : 'paid'}),
      Order.countDocuments({orderStatus : 'returned'})
    ]);

    res.json(ok({
        totalCategories,
        totalProducts,
        totalSales : salesRow[0]?.totalSales || 0,
        totalOrders,
        totalReturnedOrders
    }))
  }),
);

export default AdminDashboardRoute;
