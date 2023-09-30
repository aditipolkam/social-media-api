import jwt from "jsonwebtoken"
import { jwtSecret } from "../utils/constants";


const generateToken = (userId:string) =>{
    const token = jwt.sign({userId}, jwtSecret,{
        expiresIn: "15d"
    })

    return token;
}

export default generateToken;