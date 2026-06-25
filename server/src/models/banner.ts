import { model, Schema, type Document, type Types } from "mongoose";


export interface IBanner {
    imageUrl: string;
    imagePublicId: string;
    uploadedBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const BannerSchema = new Schema<IBanner>({
    imageUrl : {
        type : String,
        required : true ,
        trim : true
    },
    imagePublicId : {
        type : String,
        required : true ,
        trim : true
    },
    uploadedBy : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true
    }
},{timestamps : true})

const Banner = model<IBanner>('Banner',BannerSchema)

export default Banner;