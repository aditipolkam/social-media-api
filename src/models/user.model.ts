import { Schema, model } from "mongoose";

// export interface IUser {
//     name: string;
//     email: string;
//     avatar?: string;
// }

// export interface IUserModel extends IUser, Document{}

const UserSchema = new Schema({
    name:{
       type: String,
       required: true 
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        minLenght: 6,
        required: true
    },
    profilePic:{
        type: String,
        default: ""
    },
    followers: {
        type: [String],
        default: []
    },
    following: {
        type: [String],
        default: []
    },
    bio:{
        type: String,
        default: ""
    }
},{
    timestamps:true
})

const User = model('User', UserSchema)

export default User;
