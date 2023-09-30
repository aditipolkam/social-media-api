import mongoose from "mongoose";
import { mongoUri } from "../utils/constants";

const connectDB = async () => {
    try{
        mongoose.connect(mongoUri, {
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