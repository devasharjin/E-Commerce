import { Document, model, Schema, Types } from "mongoose"

export interface IWishlist extends Document{
    user : Types.ObjectId,
    products : Types.ObjectId[],
    createdAt : Date,
    updatedAt : Date
}

const wishlistSchema = new Schema<IWishlist>({
    user : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    products : [{
        type : Schema.Types.ObjectId,
        ref : 'Product',
        required : true
    }]
        
    
},{timestamps : true})

const Wishlist = model<IWishlist>('Wishlist',wishlistSchema)
export default Wishlist