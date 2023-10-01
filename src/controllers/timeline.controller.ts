import { CustomRequest } from "../interfaces/express.generic";
import User from "../models/user.model";
import { Response } from "express";
import Post from "../models/post.model";

export const getFeedPosts = async(req: CustomRequest, res:Response)=>{
    try{
    
        //check if user exists
        if(!req.userId) return res.status(401).json({message: "Unauthorized."})
        const user = await User.findById(req.userId);
        if(!user) return res.status(404).json({message: "User not found."})

        //get posts for user
        const following = user.following;
        const posts = await Post.find({postedBy: {$in: following}}).sort({createdAt: -1})

        //send posts
        res.status(200).json({message: "Got feed posts.", posts: posts})
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Internal server error."})
    }
}