import mongoose = require("mongoose");


export async function connectToDB (){
    try {
        await mongoose.connect(process.env.MONGO_URI as string)
        console.log('DB connected')
    } catch (error) {
        console.log('db connect failed');
        process.exit(1)
              
    }
}