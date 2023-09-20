import Post from "../models/post.model";
import User from "../models/user.model";

const createPost = async(req, res) => {
    try{
        const {postedBy, text, img} = req.body;

        if(!postedBy || !text) return res.status(400).json({message: "PostedBy and text field should be present."});

        const user = await User.findById(postedBy);
        if(!user){
            return res.status(404).json({message:"User not found."})
        }

        if(user._id.toString() !== req.user._id.toString()){
            return res.status(401).json({message: "You are unauthorized to perform this transaction."})
        }

        const newPost = new Post({postedBy, text, img})
        const result = await newPost.save();
        console.log(result);

        res.status(201).json({message:"Created.", post: result})
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Internal server error."})
    }
}


const getPost = async(req, res)=>{
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

const deletePost = async(req, res)=>{
    try{
        const {id} = req.params;
        if(!id) return res.status(400).json({message:"Id required"})

        const post = await Post.findById(id);
        if(!post) return res.status(404).json({message:"Post not found"})
        if(req.user._id.toString() !== post.postedBy.toString()) return res.status(401).json({message:"Unauthorized to delete post."})

        const result = await Post.findByIdAndDelete(id);
        console.log(result);
        res.status(200).json({message: "Deleted."})
    }
    catch(error){
        console.error(error);
        res.status(500).json({message: "Internal server error."})
    }
}

export {createPost, getPost, deletePost}