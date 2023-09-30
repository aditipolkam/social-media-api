import { Request, Response } from "express";
import Post from "../models/post.model";
import User from "../models/user.model";
import { CustomRequest } from "../interfaces/express.generic";

const createPost = async(req: CustomRequest, res:Response) => {
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


const getPost = async(req: CustomRequest, res:Response)=>{
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

const deletePost = async(req: CustomRequest, res:Response)=>{
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

const likePost = async(req: Request, res:Response)=>{
    try{
        const {id} = req.params;
        if(!id) return res.status(400).json({message:"Id required"})

        const post = await Post.findById(id);
        if(!post) return res.status(404).json({message:"Post not found"})
        
        // const isLiked = post.likes.includes(id);
        // const result = await Post.findByIdAndDelete(id);
        // console.log(result);
        // res.status(200).json({message: "Deleted."})
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Internal server error."})
    }
}

export {createPost, getPost, deletePost, likePost}