import generateToken from "../helpers/generateToken";
import User from "../models/user.model";
import bcrypt from "bcryptjs"

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
        // const {id} = req.params;
        // const userToModify = await User.findById(id);
        // const currentUser = await User.findById();

        res.status(200).json({message:"User logged out successfully."});
    }
    catch(error){
        console.error("Error in follow/unfollow user",error);
        res.status(500).json({message: error.message})
    }
}

export { signupController, loginController, logoutController, followUnfollowUser }