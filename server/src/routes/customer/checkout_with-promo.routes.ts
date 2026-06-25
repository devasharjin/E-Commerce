import { Router, type Request, type Response } from "express";
import { extractDbUser, requireAuth } from "../../middleware/auth.js";
import { AsyncHandler } from "../../utils/AsyncHandler.js";
import { requireFound, requireText } from "../../utils/helper.js";
import User from "../../models/user.js";
import Cart from "../../models/cart.js";
import { ok } from "../../utils/envelope.js";
import { AppError } from "../../utils/AppError.js";
import Product from "../../models/product.js";
import Promo from "../../models/promo.js";
import Order from "../../models/order.js";


export const checkoutWithPromoRouter = Router()

checkoutWithPromoRouter.get('/points',
    AsyncHandler(async (req: Request, res: Response) => {
        const dbUser = await extractDbUser(req)

        const points = dbUser.points || 0

        res.json(ok(points))
    })
)

checkoutWithPromoRouter.use(requireAuth)

checkoutWithPromoRouter.post('/checkout/pay-with-points',
    AsyncHandler(async (req: Request, res: Response) => {
        const dbUser = await extractDbUser(req)
        const addressid = String(req.body.addressid || "").trim()
        const promoCode = String(req.body.promoCode || "").trim().toUpperCase()

        requireText(addressid, 'Address Id is required.')

        const [user, cart] = await Promise.all([
            User.findById(dbUser._id),
            Cart.findOne({
                user: dbUser._id
            })
        ])

        const foundUser = requireFound(user, 'User Not Found')
        const foundCart = requireFound(cart, 'Cart Not Found')

        const selectedAddress = foundUser?.addresses.find(item => String(item._id) === addressid)

        if (!selectedAddress) {
            throw new AppError(400, 'Invalid Address')
        }

        const products = await Product.find({
            _id: { $in: foundCart.items.map(item => item.product) }
        })

        const productMap = new Map(
            products.map((item) => [String(item._id), item]),
        )

        let totalItems = 0
        let subTotal = 0

        const items = foundCart.items.map((item) => {
            const product = productMap.get(String(item.product))

            if (!product || product.status === "inactive") {
                throw new AppError(400, 'Cart is empty')
            }
            if (product.stock < item.quantity) {
                throw new AppError(400, 'Stock is low')
            }

            const finalPrice = product.salesPercentage
                ? Math.round(product.price - (product.price * product.salesPercentage) / 100)
                : product.price;

            totalItems += item.quantity
            subTotal += finalPrice * item.quantity

            return {
                product: item.product,
                quantity: item.quantity
            }
        })

        let discountAmount = 0
        let appliedPromoCode = ''

        if (promoCode) {
            const promo = await Promo.findOne({ code: promoCode })
            const foundPromo = requireFound(promo, 'Promo code is invalid')

            const date = new Date()

            if (foundPromo.startAt > date || foundPromo.endAt < date || foundPromo.count < 1) {
                throw new AppError(400, 'Promo Code Expired ')
            }

            if (foundPromo.minimumOrderValue > subTotal) {
                throw new AppError(400, 'Add more products to eligible')
            }

            appliedPromoCode = String(foundPromo.code).trim().toUpperCase()

            discountAmount = Math.round((subTotal * foundPromo.percentage) / 100)
        }

        const totalAmount = Math.max(subTotal - discountAmount, 0)

        if (foundUser.points < totalAmount) {
            throw new AppError(400, 'Points is low')
        }

        const deductedUserPoints = await User.findByIdAndUpdate(foundUser._id, {
            $inc: {
                points: -totalAmount            }
        })

        try {
            for (const item of items) {
                const updated = await Product.updateOne(
                    {
                        _id: item.product,
                        stock: { $gte: item.quantity },
                    },
                    {
                        $inc: { stock: -item.quantity },
                    },
                );

                if (!updated.matchedCount) {
                    throw new AppError(400, "One or more cart items are out of stock");
                }
            }

            if (appliedPromoCode) {
                await Promo.updateOne(
                    {
                        code: appliedPromoCode,
                        count: { $gt: 0 },
                    },
                    {
                        $inc: { count: -1 },
                    },
                );
            }

            await Cart.updateOne({ user: dbUser._id }, { $set: { items: [] } });

            const pointsPaymentId = `points_${Date.now()}`;

            const deliveryAddress = [
                selectedAddress.address,
                selectedAddress.city,
                selectedAddress.pinCode,
            ]
                .filter(Boolean)
                .join(", ");

            const order = await Order.create({
                user: dbUser._id,
                customerName: foundUser.name || selectedAddress.fullName,
                customerEmail: foundUser.email || "",
                items,
                totalItems,
                deliveryName: selectedAddress.fullName,
                deliveryAddress,
                promoCode: appliedPromoCode,
                discountAmount,
                totalAmount,
                paymentStatus: "paid",
                orderStatus: "placed",
                razorpayOrderId: pointsPaymentId,
                paymentId: pointsPaymentId,
                paidAt: new Date(),
            });

            const updatedUser = await User.findById(dbUser._id)
                .select("points")
                .lean<{ points: number } | null>();

            res.json(
                ok({
                    _id: String(order._id),
                    totalPoints: updatedUser?.points || 0,
                }),
            );
        } catch (error) {
            await User.updateOne(
                {
                    _id: dbUser._id,
                },
                {
                    $inc: { points: totalAmount },
                },
            );

            throw error;
        }
    })
)

export default checkoutWithPromoRouter