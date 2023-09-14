import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model";

dotenv.config();

interface JwtPayload {
    userId: string
}

const protectRoute = async(req, res, next) =>{
    try{
        const token = req.cookies.jwt;

        if(!token) return res.status(401).json({message: "Unauthorized."});

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

        const user = await User.findById(decoded.userId).select("-password");

        req.user = user;

        next();

    }catch(error){
        console.error("Error in protectRoute",error);
        res.status(500).json({message: error.message})
    }
}

export default protectRoute;