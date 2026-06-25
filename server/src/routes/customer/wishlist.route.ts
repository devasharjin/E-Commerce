import { Router, type Request, type Response } from "express";
import { extractDbUser, requireAuth } from "../../middleware/auth.js";
import { AsyncHandler } from "../../utils/AsyncHandler.js";
import { ok } from "../../utils/envelope.js";
import { getWishlistResponse } from "./helper/cart-wiashlist-helper.js";
import { requireFound, requireText } from "../../utils/helper.js";
import Wishlist from "../../models/wishlist.js";
import Product from "../../models/product.js";
import { AppError } from "../../utils/AppError.js";
import Cart from "../../models/cart.js";


const CustomerWishlistRoute = Router()

CustomerWishlistRoute.use(requireAuth)


CustomerWishlistRoute.get('/wishlist',
    AsyncHandler(async (req: Request, res: Response) => {
        const dbUser = await extractDbUser(req)

        res.json(ok(
            await getWishlistResponse(String(dbUser._id))
        ))

    })
)



CustomerWishlistRoute.post('/cart',
    AsyncHandler(async (req: Request, res: Response) => {
        const dbUser = await extractDbUser(req)
        const productId = String(req.body.productId || "").trim()

        requireText(productId, 'Product Id not found')

        let wishlist = await Wishlist.findOne({ user: dbUser._id })

        if (!wishlist) {
            wishlist = await Wishlist.create({
                user: dbUser._id,
                products: []
            })
        }

        const product = await Product.findById(productId)

        const foundProduct = requireFound(product, 'Product not Found')

        const itemIndex = wishlist.products.findIndex((item) =>
            String(item) === String(foundProduct._id)
        )

        if (itemIndex >= 0) {
            throw new AppError(400, 'Proaduct already in wishlist')
        } else {
            wishlist.products.push(foundProduct._id)
        }

        await wishlist.save()

        res.json(ok(
            await getWishlistResponse(String(dbUser._id))
        ))
    })
)


CustomerWishlistRoute.delete('/cart',
    AsyncHandler(async (req: Request, res: Response) => {
        const dbUser = await extractDbUser(req)
        const productId = String(req.body.productId || "").trim()

        requireText(productId, 'Product Id not found')

        const wishlist = await Wishlist.findOne({ user: dbUser._id })

        if (!wishlist) {
            throw new AppError(400, 'No Proaduct in wishlist')
        }

        wishlist.products = wishlist.products.filter((item) =>
            !(String(item) === String(productId))
        )

        await wishlist.save()

        res.json(ok(
            await getWishlistResponse(String(dbUser._id))
        ))
    })
)

export default CustomerWishlistRoute