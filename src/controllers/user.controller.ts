import generateToken from "../helpers/generateToken";
import {User} from "../models/user.model";
import bcrypt from "bcryptjs";
import sendEmail from "../services/email.service";
import { welcomeEmail } from "../utils/constants";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../interfaces/express.generic";

const signupController = async (
  req: Request<
    never,
    unknown,
    { name?: string; email?: string; username?: string; password?: string }
  >,
  res: Response
) => {
  try {
    const { name, email, username, password } = req.body;
    if(!name || !email || !username || !password){
      return res.status(400).json({message: "All fields are necessary."})
    }
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      username,
      password: hashedPassword,
    });
    await newUser.save();

    if (newUser) {
      const token = generateToken(newUser._id.toString());
      sendEmail(
        newUser.email,
        welcomeEmail.subject,
        welcomeEmail.htmlBody,
        welcomeEmail.textBody,
        welcomeEmail.messageStream
      );
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
        message: "Invalid User Data",
      });
    }
  } catch (err) {
    const error = err as Error
    console.error("Error in signup user", error);
    res.status(500).json({ message: error.message });
  }
};

const loginController = async (req: Request<never, unknown, {username?:string, password?:string}>, res:Response) => {
  try {
    const { username, password } = req.body;

    if(!username || !password){
      return res.status(400).json({message:"All fields are necessary."})
    }

    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect)
      return res.status(400).json({ message: "Invalid username or password." });
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

const logoutController = async (req:Request, res:Response) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ message: "User logged out successfully." });
  } catch (err) {
    const error = err as Error
    console.error("Error in logout user", error);
    res.status(500).json({ message: error.message });
  }
};

const followUnfollowUser = async (req:AuthenticatedRequest, res:Response) => {
  try {
    const { id } = req.params;
    const currentUser = await User.findById(req.user._id);

    if(!currentUser) return res.status(404).json({message:"User not found."})

    if (id == currentUser._id.toString())
      return res
        .status(400)
        .json({ message: "Cannot follow/unfollow yourself." });

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

const updateUser = async (req:AuthenticatedRequest, res: Response) => {
  try {
    const { name, email, profilePic, bio } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password");

    if (!user) return res.status(400).json({ message: "User not found." });

    user.name = name || user.name;
    user.email = email || user.email;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;

    await user.save();

    res.status(200).json({ message: "User updated successfully.", user });
  } catch (err) {
    const error = err as Error
    console.error("Error while updating user.", error);
    res.status(500).json({ message: error.message });
  }
};

const getUser = async (req:AuthenticatedRequest, res:Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");
    if (!user) return res.status(400).json({ message: "User not found." });

    res.status(200).json(user);
  } catch (err) {
    const error = err as Error
    console.error("Error while getting user.", error);
    res.status(500).json({ message: error.message });
  }
};

export {
  signupController,
  loginController,
  logoutController,
  followUnfollowUser,
  updateUser,
  getUser,
};
