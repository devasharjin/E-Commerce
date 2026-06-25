import { Router, type Request, type Response } from "express";
import { extractDbUser, requireAuth } from "../../middleware/auth.js";
import { AsyncHandler } from "../../utils/AsyncHandler.js";
import Order from "../../models/order.js";
import { requireFound, requireText } from "../../utils/helper.js";
import { ok } from "../../utils/envelope.js";
import { AppError } from "../../utils/AppError.js";
import Product from "../../models/product.js";
import User from "../../models/user.js";


const customerOrderRouter = Router()

customerOrderRouter.use(requireAuth)

customerOrderRouter.get('/orders', AsyncHandler(async (req: Request, res: Response) => {
    const dbUser = await extractDbUser(req)

    const orders = await Order.find({
        user: dbUser._id
    }).sort({ createdAt: -1 })


    res.json(ok({
        orders: orders.map(item => ({
            _id: item._id,
            code: String(item._id).slice(-8).toUpperCase(),
            totalItems: item.totalItems,
            totalAmount: item.totalAmount,
            orderStatus: item.orderStatus,
            paymentStatus: item.paymentStatus,
            returnedAt: item.returnedAt,
            deliveredAt: item.deliveredAt,
            createdAt: item.createdAt,
            paidAt: item.paidAt
        }))
    }))
}))

customerOrderRouter.post('/orders/return/:id', AsyncHandler(async (req: Request, res: Response) => {
    const dbUser = await extractDbUser(req)
    const orderid = String(req.params.id || "").trim()

    requireText(orderid, 'Order Id not found')

    const order = await Order.findOne({
        _id: orderid,
        user: dbUser._id
    })

    const foundOrder = requireFound(order, 'Order Not Found')

    if (foundOrder.orderStatus === 'returned') {
        throw new AppError(400, "Order already returned");
    }

    if (foundOrder.orderStatus !== "delivered") {
        throw new AppError(
            400,
            "Only delivered orders can be returned"
        );
    }

    if (!foundOrder.deliveredAt) {
        throw new AppError(400, "Delivery date not found");
    }

    const sevenDaysReturnWindowTime = 7 * 24 * 60 * 60 * 1000

    if (Date.now() - new Date(foundOrder.deliveredAt).getTime() > sevenDaysReturnWindowTime) {
        throw new AppError(400, 'Return Date is expired')
    }

    for (const item of foundOrder.items) {
        const product = await Product.findByIdAndUpdate(item.product, {
            $inc: {
                stock: item.quantity
            }
        })
    }

    await User.findByIdAndUpdate(dbUser._id, {
        $inc: {
            points: foundOrder.totalAmount
        }
    })

    foundOrder.orderStatus = 'returned'
    foundOrder.returnedAt = new Date()
    await foundOrder.save()

    res.status(201).json(ok({
        _id: String(foundOrder._id),
        orderStatus: foundOrder.orderStatus,
        returnedAt: foundOrder.returnedAt,
    }))
}))

export default customerOrderRouter 