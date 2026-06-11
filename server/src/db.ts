import mongoose from "mongoose";


export async function connectToDB (){
    try {
        const URI : string = process.env.MONGO_URI as string

        await mongoose.connect(URI)
        console.log('DB connected')
    } catch (error) {
        console.log('db connection failed');
        console.log(error)
        process.exit(1)
              
    }
}