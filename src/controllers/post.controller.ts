import { Response } from "express";
import Post from "../models/post.model";
import User from "../models/user.model";
import { CustomRequest } from "../interfaces/express.generic";

export const createPost = async(req: CustomRequest, res:Response) => {
    try{
        const {text, img} = req.body;

        if(!text) return res.status(400).json({message: "Text field should be present."});

        const user = await User.findById(req.userId);

        if(!user){
            return res.status(404).json({message:"User not found."})
        }

        const postedBy = req.userId;

        const newPost = new Post({postedBy,text, img})
        const result = await newPost.save();
        console.log(result);

        res.status(201).json({message:"Created.", post: result})
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Internal server error."})
    }
}


export const getPost = async(req: CustomRequest, res:Response)=>{
    try{
        const {id} = req.params;
        if(!id) return res.status(400).json({message:"Id required"})
        const post = await Post.findById(id);
        if(!post) return res.status(404).json({message: "Post not found."})
        return res.status(200).json({post:post})
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Internal server error."})
    }
}

export const deletePost = async(req: CustomRequest, res:Response)=>{
    try{
  
        const {id} = req.params;
        if(!id) return res.status(400).json({message:"Id required"})

        const post = await Post.findById(id);
        if(!post) return res.status(404).json({message:"Post not found"})

        if(!req.userId) return res.status(401).json({message: "User not found."})
        if(req.userId.toString() !== post.postedBy.toString()) return res.status(403).json({message:"Unauthorized to delete post."})

        const result = await Post.findByIdAndDelete(id);
        console.log(result);
        res.status(200).json({message: "Deleted."})
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Internal server error."})
    }
}

export const likeUnlikePost = async(req: CustomRequest, res:Response)=>{
    try{
        //check if user exists
        if(!req.userId) return res.status(401).json({message: "Unauthorized."})
        const user = await User.findById(req.userId);
        if(!user) return res.status(404).json({message: "User not found."})

        //get params
        const {id} = req.params;
        if(!id) return res.status(400).json({message:"Id required"})

        //check if post exists
        const post = await Post.findById(id);
        if(!post) return res.status(404).json({message:"Post not found"})
        
        //like or unlike post
        if(post.likes.includes(req.userId))
            await Post.findByIdAndUpdate(id, {
                $pull: { likes: user._id },
            });
        else
        await Post.findByIdAndUpdate(id, {
            $push: { likes: user._id },
        });
        res.status(200).json({message: "Like/unlike done."})
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Internal server error."})
    }
}

export const replyToPost = async(req: CustomRequest, res:Response)=>{
    try{
        //check if user exists
        if(!req.userId) return res.status(401).json({message: "Unauthorized."})
        const user = await User.findById(req.userId);
        if(!user) return res.status(404).json({message: "User not found."})

        //get id of the post to reply to
        const {id} = req.params;
        if(!id) return res.status(400).json({message:"Post Id required"})

        const {text} = req.body;
        if(!text) return res.status(400).json({message:"Text is required"})

        //check if post exists
        const post = await Post.findById(id);
        if(!post) return res.status(404).json({message:"Post not found"})
        
        await Post.findByIdAndUpdate(id, {
            $push: {replies: {userId: user._id, text:text}}
        })
       
        res.status(200).json({message: "Reply added.", post:post})
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Internal server error."})
    }
}

