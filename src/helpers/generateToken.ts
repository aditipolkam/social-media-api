import jwt from "jsonwebtoken"
import dotenv from "dotenv";

dotenv.config();

const generateToken = (userId) =>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET,{
        expiresIn: "15d"
    })

    return token;
}

export default generateToken;