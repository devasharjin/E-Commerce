import { Router, type Request, type Response } from "express";
import { extractDbUser, requireAuth } from "../../middleware/auth.js";
import { AsyncHandler } from "../../utils/AsyncHandler.js";
import { ok } from "../../utils/envelope.js";
import Cart from "../../models/cart.js";
import { requireFound, requireText } from "../../utils/helper.js";
import { AppError } from "../../utils/AppError.js";
import Product from "../../models/product.js";
import { checkSameProduct, getCartResponse, selectedVariant, type ProductSize, type SyncCartItem } from "./helper/cart-wiashlist-helper.js";


const CustomerCartRoute = Router()

CustomerCartRoute.use(requireAuth)

CustomerCartRoute.get('/cart',
    AsyncHandler(async (req: Request, res: Response) => {
        const dbUser = await extractDbUser(req)

        res.json(ok(
            await getCartResponse(String(dbUser._id))
        ))
    })
)
CustomerCartRoute.post('/cart',
    AsyncHandler(async (req: Request, res: Response) => {
        const dbUser = await extractDbUser(req)

        const productId = String(req.body.id || "").trim()
        const quantity = Number(req.body.quantity)
        const colorValue = String(req.body.color || "").trim()
        const sizeValue = String(req.body.size || "").trim() as ProductSize       

        requireText(productId, 'Product Id is required')
        if (Number.isNaN(quantity) || quantity < 1) {
            throw new AppError(400, 'Quantity is not in number')
        }

        const product = await Product.findOne({
            _id: productId,
            status: 'active'
        })

        const foundProduct = requireFound(product, 'Product Not Found')

        const { color, size } = selectedVariant(foundProduct, colorValue, sizeValue)

        if (quantity > foundProduct.stock) {
            throw new AppError(400, 'Quantity is greater than stock')
        }

        let cart = await Cart.findOne({
            user: dbUser._id
        })

        if (!cart) {
            cart = await Cart.create({
                items: [],
                user: dbUser._id
            })
        }

        const itemIndex = cart.items.findIndex((item) =>
            checkSameProduct(item, String(productId), color, size)
        )

        if (itemIndex >= 0) {
            const nextQuantity = quantity + cart.items[itemIndex].quantity

            if (nextQuantity > foundProduct?.stock) {
                throw new AppError(400, 'Quantity is greater than stock')
            }
            cart.items[itemIndex].quantity = nextQuantity
        }
        else {
            cart.items.push({
                product: foundProduct._id,
                quantity,
                color,
                size
            })
        }

        await cart.save()

        res.json(ok(
            await getCartResponse(String(dbUser._id))
        ))

    })
)


CustomerCartRoute.put('/cart/item',
    AsyncHandler(async (req: Request, res: Response) => {
        const dbUser = await extractDbUser(req)

        const productId = String(req.body.id || "").trim()
        const quantity = Number(req.body.quantity)
        const colorValue = String(req.body.color || "").trim()
        const sizeValue = String(req.body.size || "").trim() as ProductSize

        requireText(productId, 'Product Id is required')
        if (Number.isNaN(quantity) || quantity < 1) {
            throw new AppError(400, 'Quantity is not in number')
        }

        const product = await Product.findOne({
            _id: productId,
            status: "active"
        })

        const foundProduct = requireFound(product, 'Product Not Found')

        const { color, size } = selectedVariant(foundProduct, colorValue, sizeValue)

        if (quantity > foundProduct.stock) {
            throw new AppError(400, 'Quantity is greater than stock')
        }

        let cart = await Cart.findOne({
            user: dbUser._id
        })

        if (!cart) {
            throw new AppError(400, 'No products in the cart')
        }

        const itemIndex = cart.items.findIndex((item) =>
            checkSameProduct(item, String(productId), color, size)
        )

        if (itemIndex < 0 ) {
            throw new AppError(400, 'Product is not in the cart')
        }
        else {
            cart.items[itemIndex].quantity = quantity
        }

        await cart.save()

        res.json(ok(
            await getCartResponse(String(dbUser._id))
        ))

    })
)


CustomerCartRoute.delete('/cart',
    AsyncHandler(async (req: Request, res: Response) => {
        const dbUser = await extractDbUser(req)
        
        console.log(req.query.id);
        console.log(req.query.color);
        
        

        const productId = String(req.query.id || "").trim()
        const color = String(req.query.color || "").trim()
        const size = String(req.query.size || "").trim() as ProductSize

        console.log(productId);
        console.log(color);
        console.log(size);
        // console.log(quantity);

        requireText(productId, 'Product Id is required')

        let cart = await Cart.findOne({
            user: dbUser._id
        })

        if (!cart) {
            throw new AppError(400, 'No products in the cart')
        }

        cart.items = cart.items.filter((item) =>
            !(checkSameProduct(item, String(productId), color, size))
        )

        await cart.save()

        res.json(ok(
            await getCartResponse(String(dbUser._id))
        ))
    })
)



CustomerCartRoute.post('/cart/sync',
    AsyncHandler(async (req: Request, res: Response) => {
        const dbUser = await extractDbUser(req)

        const incomingItems = Array.isArray(req.body.items) ?
            req.body.items as SyncCartItem[] : [];

        console.log(incomingItems);
        

        let cart = await Cart.findOne({
             user: dbUser._id,
        })

        if (!cart) {
            cart = await Cart.create({
                user: dbUser._id,
                items: []
            })
        }

        for (const rawItem of incomingItems) {
            const productId = String(rawItem.product || "").trim()
            const quantity = Number(rawItem.quantity)
            const colorValue = String(rawItem.color || "").trim()
            const sizeValue = String(rawItem.size || "").trim() as ProductSize

            if (!productId || Number.isNaN(quantity) || quantity < 1) {
                continue
            }

            const product = await Product.findById(productId)

            if (!product || product.stock < 1) {
                continue;
            }

            try {
                const { size, color } = selectedVariant(product, colorValue, sizeValue)

                const itemIndex = cart.items.findIndex((item) =>
                    checkSameProduct(item, String(productId), color, size)
                )

                if (itemIndex >= 0) {
                    const nextQuantity = quantity + cart.items[itemIndex].quantity


                    cart.items[itemIndex].quantity = Math.min(
                        nextQuantity,
                        product.stock,
                    );
                } else {
                    cart.items.push({
                        product: product._id,
                        quantity: Math.min(quantity, product.stock),
                        color,
                        size
                    })
                }
            } catch {
                continue
            }
        }
        await cart.save();

        res.json(ok(await getCartResponse(String(dbUser._id))));
    })
)



export default CustomerCartRoute