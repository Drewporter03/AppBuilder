import mongoose from "mongoose"

export const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MONOGDB CONNECTED SUCCESSFULLY")
    }
    catch{
        console.log("ERROR CONNECTING TO MONGODB", error);
        process.exit(1);
    }
};