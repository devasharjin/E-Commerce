import { Router, type Request, type Response } from "express";
import { requireAdmin, requireAuth } from "../../middleware/auth.js";
import { AsyncHandler } from "../../utils/AsyncHandler.js";
import Promo from "../../models/promo.js";
import { ok } from "../../utils/envelope.js";
import type { Document } from "mongoose";
import { requireFound, requireText } from "../../utils/helper.js";
import { AppError } from "../../utils/AppError.js";


const AdminPromoRoute = Router()

AdminPromoRoute.use(requireAuth)
AdminPromoRoute.use(requireAdmin)

export interface IPromo extends Document {
    code: string,
    percentage: number,
    count: number,
    minimumOrderValue: number,
    startAt: Date,
    endAt: Date,
    createdAt: Date,
    updatedAt: Date
}

async function getAllPromos() {
    const promos = await Promo.find({}).sort({ createdAt: -1 })

    return promos
}

function parsePromoPayload(req: Request) {
    const code = String(req.body.code || "").trim().toUpperCase()
    const percentage = Number(req.body.percentage)
    const count = Number(req.body.count)
    const minimumOrderValue = Number(req.body.minimumOrderValue)
    const startAt = new Date(req.body.startAt)
    const endAt = new Date(req.body.endAt)

    requireText(code, "code is required")

    if (Number.isNaN(percentage) || percentage < 1 || percentage > 100) {
        throw new AppError(400, 'Percentage must be between 1 and 100')
    }

    if (Number.isNaN(count) || count < 1) {
        throw new AppError(400, "Promo count must be atleast 1")
    }

    if (Number.isNaN(minimumOrderValue) || minimumOrderValue < 0) {
        throw new AppError(400, "Promo count must be atleast 0 or more")
    }


    if (Number.isNaN(startAt.getTime())) {
        throw new AppError(400, "Valid start time is required");
    }

    if (Number.isNaN(endAt.getTime())) {
        throw new AppError(400, "Valid end time is required");
    }

    if (endAt <= startAt) {
        throw new AppError(400, "End time should be after start time");
    }

    return {
        code,
        percentage,
        count,
        minimumOrderValue,
        startAt,
        endAt
    }
}

AdminPromoRoute.get('/promos',
    AsyncHandler(async (req: Request, res: Response) => {
        res.json(ok({
            promos: await getAllPromos()
        }))
    })
)

AdminPromoRoute.post('/promos',
    AsyncHandler(async (req: Request, res: Response) => {
        const payload = parsePromoPayload(req)

        const isExist = await Promo.findOne({ code: payload.code })

        if (isExist) {
            throw new AppError(400, "Promo code already exists")
        }

        await Promo.create(payload)

        res.json(ok({
            promos: await getAllPromos()
        }))

    })

)
AdminPromoRoute.put('/promos/:id',
    AsyncHandler(async (req: Request, res: Response) => {
        const PromoId = String(req.params.id || "").trim()

        const existingPromo = await Promo.findById(PromoId)

        if (!existingPromo) {
            throw new AppError(400, 'Promo not found')
        }

        const payload = parsePromoPayload(req)

        const duplicatePromo = await Promo.findOne({
            code: payload.code,
            _id: { $ne: PromoId }
        })

        if (duplicatePromo) {
            throw new AppError(400, "Promo code already exists")
        }

        existingPromo.code = payload.code
        existingPromo.percentage = payload.percentage
        existingPromo.count = payload.count
        existingPromo.minimumOrderValue = payload.minimumOrderValue,
            existingPromo.endAt = payload.endAt
        existingPromo.startAt = payload.startAt

        await existingPromo.save()

        res.json(ok({
            promos: await getAllPromos()
        }))
    })

)
AdminPromoRoute.delete('/promos/:id',
    AsyncHandler(async (req: Request, res: Response) => {
        const promoId = req.params.id
        requireText(String(promoId).trim(), 'promo Id is required')

        const existingPromo = await Promo.findById(promoId)

        if (!existingPromo) {
            throw new AppError(400, 'Promo not found')
        }

        await Promo.findByIdAndDelete(promoId)

        res.json(ok({
            promos: await getAllPromos()
        }))
    })

)

export default AdminPromoRoute