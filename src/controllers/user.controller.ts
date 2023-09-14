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

export {signupController}