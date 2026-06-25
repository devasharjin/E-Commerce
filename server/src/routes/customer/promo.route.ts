import { Router, type Request, type Response } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { AsyncHandler } from "../../utils/AsyncHandler.js";
import { requireFound, requireText } from "../../utils/helper.js";
import { AppError } from "../../utils/AppError.js";
import Promo from "../../models/promo.js";
import { ok } from "../../utils/envelope.js";

const CustomerPromoRoute = Router()

CustomerPromoRoute.use(requireAuth)

CustomerPromoRoute.post('/promo/apply',
    AsyncHandler(async(req : Request, res : Response)=>{
        const code = String(req.body.code || "").trim().toUpperCase()
        requireText(code,'promo is required')

        const orderValue = Number(req.body.orderValue)

        if(Number.isNaN(orderValue) || orderValue <0){
            throw new AppError(400, "Valid order value is required!");
        }

        const promo = await Promo.findOne({code})

        if(!promo){
            throw new AppError(400,'Invalid promo id')
        }

        if(orderValue < promo.minimumOrderValue){
            throw new AppError(
        400,
        `Minimum order value for this promo is ${promo.minimumOrderValue}`,
      );
        }

        if(promo.count <1){
            throw new AppError(400, "Promo code limit is already excedded");
        }

        const date = new Date()

        if(date < promo.startAt){
            throw new AppError(400, "Promo code is not activated");
        }

        if(date > promo.endAt){
            throw new AppError(400, "Promo code is expired");
        }

        res.json(ok({
            code : promo.code,
            percentage : promo.percentage,
            count : promo.count,
            minimumOrderValue : promo.minimumOrderValue
        }))
        
    })
)



export default CustomerPromoRoute