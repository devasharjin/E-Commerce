import { Router, type Request, type Response } from "express";
import { AsyncHandler } from "../../utils/AsyncHandler.js";
import Banner from "../../models/banner.js";
import Category from "../../models/category.js";
import Product from "../../models/product.js";
import Promo from "../../models/promo.js";
import { ok } from "../../utils/envelope.js";

const CustomerHomeRoutes = Router();

CustomerHomeRoutes.get(
  "/home",
  AsyncHandler(async (req: Request, res: Response) => {
    const date = new Date();

    const [banner, categories, products, coupons] = await Promise.all([
      Banner.find().sort({ createdAt: -1 }).lean().limit(6),
      Category.find().sort({ name: 1 }).lean(),
      Product.find({ 
        status: "active", stock: { $gte: 1 } 
    }).sort({ createdAt: -1 }) .limit(4).lean(),
      Promo.find({
        startAt: {
          $lte: date,
        },
        endAt: {
          $gte: date,
        },
        count: {
          $gte: 1,
        },
      }).sort({ createdAt: -1 }).lean(),
    ]);

    res.json(
      ok({
        banner,
        categories,
        products,
        coupons,
      }),
    );
  }),
);

export default CustomerHomeRoutes;
