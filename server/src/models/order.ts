import { model, Schema, Types, type Document } from "mongoose";


export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type OrderStatus = 'placed' | 'shipped' | 'delivered' | 'returned'

export type OrderItem = {
    product : Types.ObjectId,
    quantity : number
}

interface IOrder extends Document{
    user : Types.ObjectId,
    customerName : string,
    customerEmail : string,
    items : OrderItem[],
    totalItems : number,
    deliveryName : string,
    deliveryAddress : string,
    promoCode ? : string,
    discountAmount : number,
    totalAmount : number,
    paymentStatus : PaymentStatus,
    orderStatus : OrderStatus,
    razorpayOrderId : string,
    paymentId : string,
    paidAt : Date | null,
    deliveredAt : Date | null,
    returnedAt : Date | null,
    createdAt : Date,
    updatedAt : Date
}

const OrderItemSchema = new Schema<OrderItem>({
    product :{
        type : Schema.Types.ObjectId,
        ref : 'Product',
        required : true
    },
    quantity :{
        type : Number,
        min : 1,
        required : true
    }
})

const orderSchema = new Schema<IOrder> ({
    user : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    customerName : {
        type :String,
        trim : true,
        required : true
    },
    customerEmail : {
        type : String,
        trim : true ,
        required : true
    },
    items : {
        type : [OrderItemSchema],
        default : []
    },
    totalItems :{
        type : Number,
        min : 1,
        required : true
    },
    deliveryName : {
        type :String,
        trim : true,
        required : true
    },
    deliveryAddress : {
        type :String,
        trim : true,
        required : true
    },
    promoCode : {
        type :String,
        trim : true,
        default : '',
        uppercase : true
    },
    discountAmount :{
        type : Number,
        default : 0,
        min : 0
    },
    totalAmount :{
        type : Number,
        required : true,
        min : 0
    },
    paymentStatus : {
        type : String ,
        enum : ['pending' , 'paid' ,'failed'],
        default : 'pending'
    },
    orderStatus : {
        type : String ,
        enum : ['placed', 'shipped', 'delivered', 'returned'],
        default : 'placed'
    },
    razorpayOrderId : {
        type : String,
        required : true, 
        trim : true 
    },
    paymentId : {
        type : String,
        default : '', 
        trim : true 
    },
    paidAt : {
        type : Date,
        default : null
    },
    deliveredAt : {
        type : Date,
        default : null
    },
    returnedAt : {
        type : Date,
        default : null
    },
},{timestamps : true })


orderSchema.index({ user: 1, createdAt: -1 })
orderSchema.index({ paymentStatus: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 , createdAt: -1});


const Order = model<IOrder>('Order',orderSchema)

export default Order