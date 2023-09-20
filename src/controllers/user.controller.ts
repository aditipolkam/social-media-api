import generateToken from "../helpers/generateToken";
import User from "../models/user.model";
import bcrypt from "bcryptjs"
import sendEmail from "../services/email.service";
import { welcomeEmail } from "../utils/constants";

const signupController = async(req, res) => {
    try{
        const {name, email, username, password } = req.body;
        const user = await User.findOne({$or:[{email},{username}]});
        if(user){
            return res.status(400).json({message: "User already exists"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({name,email,username,password:hashedPassword});
        await newUser.save();

        if(newUser){
            const token = generateToken(newUser._id);
            sendEmail(newUser.email,welcomeEmail.subject, welcomeEmail.htmlBody, welcomeEmail.textBody, welcomeEmail.messageStream);
            res.cookie("jwt", token, {
                httpOnly: true,
                maxAge: 15 * 24 * 60 * 60 * 1000,
                sameSite:"strict",
            }).status(201).json({
                _id: newUser._id,
                username: newUser.username
            })
        }
        else{
            res.status(400).json({
                message: "Invalid User Data"
            })
        }
    }
    catch(error){
        console.error("Error in signup user",error);
        res.status(500).json({message: error.message})
    }
}

const loginController = async(req, res) => {
    try{
        const { username, password} = req.body;

        const user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if(!user || !isPasswordCorrect) return res.status(400).json({message:"Invalid username or password."});
        const token  = generateToken(user._id);
        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: 15 * 24 * 60 * 60 * 1000,
            sameSite:"strict",
        }).status(201).json({
            _id: user._id,
            username: user.username
        })
    }
    catch(error){
        console.error("Error in login user",error);
        res.status(500).json({message: error.message})
    }
}

const logoutController = async(req, res) => {
    try{
        res.cookie("jwt","",{maxAge:1});
        res.status(200).json({message:"User logged out successfully."});
    }
    catch(error){
        console.error("Error in logout user",error);
        res.status(500).json({message: error.message})
    }
}

const followUnfollowUser = async(req, res) => {
    try{
        const {id} = req.params;
        const currentUser = await User.findById(req.user._id);

        if(id == currentUser._id) return res.status(400).json({message:"Cannot follow/unfollow yourself."});

        const isFollowing = currentUser.following.includes(id);
        console.log("is following:", isFollowing)
        if(isFollowing){
            await User.findByIdAndUpdate(currentUser._id, {$pull : {following: id}});
            await User.findByIdAndUpdate(id, {$pull : {followers: currentUser._id}});
            res.status(200).json({message:"Unfollow successfull"});
        }
        else{
            await User.findByIdAndUpdate(currentUser._id, {$push : {following: id}});
            await User.findByIdAndUpdate(id, {$push : {followers: currentUser._id}});
            res.status(200).json({message:"Follow successfull"});
        }


        
    }
    catch(error){
        console.error("Error in follow/unfollow user",error);
        res.status(500).json({message: error.message})
    }
}

const updateUser = async(req, res)=> {
    try{
        const { name, email, profilePic, bio } = req.body;
        const userId = req.user._id;
    
        const user = await User.findById(userId).select("-password");
    
        if(!user) return res.status(400).json({message:"User not found."})
    
        user.name = name || user.name;
        user.email = email || user.email;
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio || user.bio;
    
        await user.save();
    
        res.status(200).json({message:"User updated successfully.", user})
    }
    catch(error){
        console.error("Error while updating user.", error);
        res.status(500).json({message: error.message})
    }

}

const getUser = async(req, res)=>{
    try{
        const {id} = req.params;

        const user = await User.findById(id).select("-password");
        if(!user) return res.status(400).json({message: "User not found."});
    
        res.status(200).json(user);
    }
    catch(error){
        console.error("Error while getting user.", error);
        res.status(500).json({message: error.message})
    }
}

export { signupController, loginController, logoutController, followUnfollowUser, updateUser, getUser}