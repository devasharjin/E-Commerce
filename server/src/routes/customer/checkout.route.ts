import { Router, type Request, type Response } from "express";
import { extractDbUser, requireAuth } from "../../middleware/auth.js";
import { AsyncHandler } from "../../utils/AsyncHandler.js";
import { requireFound, requireText } from "../../utils/helper.js";
import User from "../../models/user.js";
import Cart from "../../models/cart.js";
import { AppError } from "../../utils/AppError.js";
import Product from "../../models/product.js";
import Promo from "../../models/promo.js";
import razorpay, { toSubUnits } from "../../utils/razorpay.js";
import Order from "../../models/order.js";
import { ok } from "../../utils/envelope.js";
import crypto from 'crypto'

const CustomerCheckoutRouter = Router()

CustomerCheckoutRouter.use(requireAuth)

CustomerCheckoutRouter.post('/checkout/create-session',
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

        const item = foundCart.items.map((item) => {
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

        const razorpayOrder = await razorpay.orders.create({
            amount: toSubUnits(totalAmount),
            currency: 'INR',
            receipt: `order_${Date.now()}`
        })

        const deliveryAddress = [
            selectedAddress.fullName,
            selectedAddress.address,
            selectedAddress.city,
            selectedAddress.pinCode
        ].filter(Boolean).join(" , ")

        const order = await Order.create({
            user: foundUser._id,
            customerName: foundUser.name || selectedAddress.fullName,
            customerEmail: foundUser.email || "",
            items: item,
            totalItems,
            deliveryName: selectedAddress.fullName,
            deliveryAddress,
            promoCode: appliedPromoCode,
            discountAmount,
            totalAmount,
            razorpayOrderId: razorpayOrder.id,
        })

        res.json(ok({
            razorpay: {
                keyId: process.env.RAZORPAY_KEY,
                orderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency
            },
            order: {
                _id: order._id,
                totalItems,
                discountAmount,
                totalAmount,
            }
        }))
    })
)

CustomerCheckoutRouter.post('/checkout/verify',
    AsyncHandler((async (req: Request, res: Response) => {
        const dbUser = await extractDbUser(req)
        const orderId = String(req.body.orderId || "").trim()
        const razorpayOrderId = String(req.body.razorpay_order_id || "").trim()
        const razorpayPaymentId = String(req.body.razorpay_payment_id || "").trim()
        const razorpaySignature = String(req.body.razorpay_signature || "").trim()

        requireText(orderId, 'Order Id is Required')
        requireText(razorpayOrderId, 'razorpayOrderId is Required')
        requireText(razorpayPaymentId, 'razorpayPaymentId is Required')
        requireText(razorpaySignature, 'razorpaySignature is Required')

        const order = await Order.findOne({
            _id: orderId,
            user: dbUser._id
        })

        const foundOrder = requireFound(order, "Inavlid Order Id")

        if (foundOrder.paymentStatus === 'paid') {
            return res.json(ok({ order: String(foundOrder._id) }))
        }

        if (foundOrder.razorpayOrderId !== razorpayOrderId) {
            throw new AppError(400, 'order id mismatch')
        }

        const signature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET || "")
            .update(`${razorpayOrderId}|${razorpayPaymentId}`)
            .digest('hex')

        if (signature !== razorpaySignature) {
            throw new AppError(400, 'invalid ')
        }

        const products = await Product.find({
            _id: { $in: foundOrder.items.map(item => item.product) }
        })

        const productMap = new Map(
            products.map((item) => [String(item._id), item]),
        )

        const checkstock = foundOrder.items.filter((item) => {
            const product = productMap.get(String(item.product))
            if (!product) {
                throw new AppError(400, 'product not found')
            }
            return item.quantity > product?.stock
        })

        if (checkstock.length > 0) {
            throw new AppError(400, 'stack is loow')
        }



        for (const item of foundOrder.items) {

            const updatedProduct = await Product.findOneAndUpdate(
                {
                    _id: item.product,
                    stock: { $gte: item.quantity }
                },
                {
                    $inc: {
                        stock: -item.quantity
                    }
                }
            )

            if (!updatedProduct) {
                await razorpay.payments.refund(
                    razorpayPaymentId,
                    {
                        amount: foundOrder.totalAmount * 100
                    }
                )

                throw new AppError(
                    400,
                    "Product out of stock. Payment refunded."
                )
            }
        }

        if (foundOrder.promoCode) {
            const promo = await Promo.findOneAndUpdate({
                code: foundOrder.promoCode,
                count: { $gte: 1 }
            }, {
                $inc: {
                    count: -1
                }
            })

            if (!promo) {
                throw new AppError(400, "Promo expired");
            }
        }

        await Cart.updateOne(
            { user: dbUser._id }, {
            items: []
        })

        foundOrder.paymentStatus = 'paid'
        foundOrder.paymentId = razorpayPaymentId
        foundOrder.paidAt = new Date()

        await foundOrder.save()

        res.json(ok({ order: String(foundOrder._id) }))
    })
    )
)


export default CustomerCheckoutRouter