import jwt from "jsonwebtoken";
import {User} from "../models/user.model";
import { Response, NextFunction } from "express";
import { jwtSecret } from "../utils/constants";
import { AuthenticatedRequest } from "../interfaces/express.generic";

interface JwtPayload {
    userId: string
}

const protectRoute = async(req:AuthenticatedRequest, res:Response, next: NextFunction) =>{
    try{
        const token = req.cookies.jwt;

        if(!token) return res.status(401).json({message: "Unauthorized."});

        const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

        const user = await User.findById(decoded.userId).select("-password");

        if(!user) return res.status(404).json({message: "User not found."})

        req.user = user;

        next();

    }catch(err){
        const error = err as Error;
        console.error("Error in protectRoute",error);
        res.status(500).json({message: error.message})
    }
}

export default protectRoute;