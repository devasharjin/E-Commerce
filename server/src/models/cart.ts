import { Document, model, Schema, type Types } from "mongoose"


export type CartItem = {
    product: Types.ObjectId,
    quantity: number,
    color?: string,
    size?: 'S' | 'M' | 'L' | 'XL'
}

export interface ICart extends Document {
    user: Types.ObjectId,
    items: CartItem[],
    createdAt: Date,
    updatedAt: Date
}

const cartItemSchema = new Schema<CartItem>({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    color: {
        type: String,
    },
    size: {
        type: String,
        enum: ['S', 'M', 'L', 'XL']
    }
}, { _id: false })

const cartSchema = new Schema<ICart>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: {
        type: [cartItemSchema],
        required: true,
        default: []
    },

}, { timestamps: true })

const Cart = model<ICart>('Cart', cartSchema)

export default Cart