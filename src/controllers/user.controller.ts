import generateToken from "../helpers/generateToken";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import sendEmail from "../services/email.service";
import { welcomeEmail } from "../utils/constants";
import { Request, Response } from "express";
import { CustomRequest } from "../interfaces/express.generic";

export const signupController = async (
  req: Request<
    never,
    unknown,
    { name?: string; email?: string; username?: string; password?: string }
  >,
  res: Response
) => {
  try {

    //get body params
    const { name, email, username, password } = req.body;

    //check if required fields are present
    if(!name || !email || !username || !password){
      return res.status(400).json({message: "All fields are necessary."})
    }

    //check if the user already exists
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create the new user object
    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
    });

    //save user to collection
    await newUser.save();

    //generate a jwt token if new user is created
    if (newUser) {
      const token = generateToken(newUser._id.toString());
      sendEmail(
        newUser.email,
        welcomeEmail.subject,
        welcomeEmail.htmlBody,
        welcomeEmail.textBody,
        welcomeEmail.messageStream
      );

      //set the jwt as a cookie
      res
        .cookie("jwt", token, {
          httpOnly: true,
          maxAge: 15 * 24 * 60 * 60 * 1000,
          sameSite: "strict",
        })
        .status(201)
        .json({
          _id: newUser._id,
          username: newUser.username,
        });
    } else {
      res.status(400).json({
        message: "Could not create account.",
      });
    }
  } catch (err) {
    const error = err as Error
    console.error("Error in signup user", error);
    res.status(500).json({ message: error.message });
  }
};

export const loginController = async (req: Request<never, unknown, {username?:string, password?:string}>, res:Response) => {
  try {
    //get bopdy params
    const { username, password } = req.body;

    //check if required fields are present
    if(!username || !password){
      return res.status(400).json({message:"All fields are necessary."})
    }

    //check if user exists
    const user = await User.findOne({ username });
    if(!user) return res.status(400).json({ message: "No such username exists." });

    //compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid username or password." });
    
    //issue jwt token and set cookie
    const token = generateToken(user._id.toString());
    res
      .cookie("jwt", token, {
        httpOnly: true,
        maxAge: 15 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      })
      .status(201)
      .json({
        _id: user._id,
        username: user.username,
      });
  } catch (err) {
    const error = err as Error
    console.error("Error in login user", error);
    res.status(500).json({ message: error.message });
  }
};

export const logoutController = async (req:Request, res:Response) => {
  try {
    //clear cookie and send response
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ message: "User logged out successfully." });
  } catch (err) {
    const error = err as Error
    console.error("Error in logout user", error);
    res.status(500).json({ message: error.message });
  }
};

export const followUnfollowUser = async (req:CustomRequest, res:Response) => {
  try {
    //get id of another user to follow or unfollow
    const { id } = req.params;

    //check if user exists
    if(!req.userId) return res.status(401).json({message: "User not found."})
    const currentUser = await User.findById(req.userId);
    if(!currentUser) return res.status(404).json({message:"User not found."})

    //check if current user is trying to follow/unfollow self
    if (id == currentUser._id.toString())
      return res
        .status(400)
        .json({ message: "Cannot follow/unfollow yourself." });

    //check if another user exists in current user's following, if yes then unfollow else follow
    if (currentUser.following && currentUser.following.includes(id)) {
      await User.findByIdAndUpdate(currentUser._id, {
        $pull: { following: id },
      });
      await User.findByIdAndUpdate(id, {
        $pull: { followers: currentUser._id },
      });
      res.status(200).json({ message: "Unfollow successfull" });
    } else {
      await User.findByIdAndUpdate(currentUser._id, {
        $push: { following: id },
      });
      await User.findByIdAndUpdate(id, {
        $push: { followers: currentUser._id },
      });
      res.status(200).json({ message: "Follow successfull" });
    }
  } catch (err) {
    const error = err as Error
    console.error("Error in follow/unfollow user", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req:CustomRequest, res: Response) => {
  try {
    //get body params
    const { name, email, profilePic, bio } = req.body;

    //check if user exists
    if(!req.userId) return res.status(401).json({message: "User not found."})
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(400).json({ message: "User not found." });

    //set new values
    user.name = name || user.name;
    user.email = email || user.email;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;

    //save user 
    await user.save();
    res.status(200).json({ message: "User updated successfully.", user });

  } catch (err) {
    const error = err as Error
    console.error("Error while updating user.", error);
    res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req:CustomRequest, res:Response) => {
  try {
    const { id } = req.params;

    //check if user exists
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(400).json({ message: "User not found." });

    res.status(200).json(user);
  } catch (err) {
    const error = err as Error
    console.error("Error while getting user.", error);
    res.status(500).json({ message: error.message });
  }
};

 
