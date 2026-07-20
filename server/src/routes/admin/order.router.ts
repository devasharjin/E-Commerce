import { Router, type Request, type Response } from "express";
import { requireAdmin, requireAuth } from "../../middleware/auth.js";
import { AsyncHandler } from "../../utils/AsyncHandler.js";
import Order, { type OrderStatus } from "../../models/order.js";
import { ok } from "../../utils/envelope.js";
import { AppError } from "../../utils/AppError.js";
import { requireFound, requireText } from "../../utils/helper.js";
import Product from "../../models/product.js";
import User from "../../models/user.js";


const AdminOrderRouter = Router()

AdminOrderRouter.use(requireAuth)
AdminOrderRouter.use(requireAdmin)


AdminOrderRouter.get('/orders',
    AsyncHandler(async (req: Request, res: Response) => {
        const order = await Order.find()

        if (!order) {
            throw new AppError(400, 'Order Not found')
        }

        res.json(ok({
            orders: order.map(item => ({
                id: item._id,
                code: String(item._id).slice(-8).toUpperCase(),
                customerName: item.customerName,
                customerEmail: item.customerEmail,
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
    })
)


AdminOrderRouter.put('/orders/:id',
    AsyncHandler(async (req: Request, res: Response) => {
        const orderId = String(req.params.id || "").trim()
        const orderStatus = String(req.body.orderStatus) as OrderStatus

        const allowedStatuses: OrderStatus[] = [
            "placed",
            "shipped",
            "delivered",
            "returned"
        ]

        if (!allowedStatuses.includes(orderStatus)) {
            throw new AppError(400, "Invalid order status")
        }

        requireText(orderId, 'Order Id is not found')
        requireText(orderStatus, 'Order status is not found')

        const order = await Order.findById(orderId)

        const foundOrder = requireFound(order, 'Order not found')

        if (orderStatus === "returned" && foundOrder.orderStatus !== "delivered") {
            throw new AppError(
                400,
                "Only delivered orders can be returned"
            )
        }

        if (orderStatus === 'returned' && foundOrder.orderStatus !== 'returned') {
            for (const item of foundOrder.items) {
                await Product.findByIdAndUpdate(
                    item.product, {
                    $inc: {
                        stock: item.quantity
                    }
                }
                )
            }

            await User.findByIdAndUpdate(
                foundOrder.user, {
                $inc: {
                    points: foundOrder.totalAmount
                }
            }
            )
            foundOrder.returnedAt = new Date()
        }

        if (foundOrder.orderStatus === "returned") {
            throw new AppError(400, "Returned orders cannot be modified")
        }

        if (orderStatus === 'delivered' && !foundOrder.deliveredAt) {
            foundOrder.deliveredAt = new Date()
        }

        foundOrder.orderStatus = orderStatus
        await foundOrder.save()

        res.json(ok({
            id: String(foundOrder._id,),
            orderStatus: foundOrder.orderStatus,
            deliveredAt: foundOrder.deliveredAt,
            returnedAt: foundOrder.returnedAt,
        }))
    })
)

export default AdminOrderRouter