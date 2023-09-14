import mongoose, { Schema, model } from "mongoose";

const PostSchema = new Schema({
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text:{
        type: String,
        maxLength: 500
    },
    img:{
        type: String
    },
    likes:{
        type: Number,
        default:0
    },
    replies:[
        {
            userId:{
                type:mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            text: {
                type: String,
                required: true
            },
            userProfilePic: {
                type: String
            },
            username:{
                type: String
            }
        }
    ]
},{
    timestamps: true
})

const Post = model('Post',PostSchema)

export default Post;