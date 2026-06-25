import { model, Schema, type Document } from "mongoose";


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

const promoSchema = new Schema<IPromo>({
    code: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        uppercase: true

    },
    percentage: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    count: {  
        type: Number,
        min: 1,
        required : true,
        default : 1
    },
    minimumOrderValue :{
        type : Number,
        required : true,
        min : 0
    },
    startAt :{
        type : Date,
        required : true
    },
    endAt :{
        type : Date,
        required : true
    },
},{timestamps : true})

const Promo = model<IPromo>('Promo',promoSchema)

export default Promo