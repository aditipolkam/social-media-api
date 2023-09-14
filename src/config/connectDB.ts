import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try{
        mongoose.connect(process.env.MONGO_URI, {
            retryWrites:true, 
            w:"majority"
        })       
        .then(()=>{console.log("Connected to database")})
    }
    catch(error){
        console.error(error);
        process.exit(1)
    }
}

export default connectDB;