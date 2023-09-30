import { Schema, model, InferSchemaType } from "mongoose";

export interface IUser extends Document{
    name: string;
    username: string;
    email: string;
    password:string;
    profilePic?: string;
    followers?:[string];
    following?:[string];
    bio?:string;
}

const userSchema = new Schema<IUser>({
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

const User = model<IUser>('User', userSchema)

type userType = InferSchemaType<typeof userSchema>;

export {User, userType};
