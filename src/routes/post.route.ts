import express from "express";
import protectRoute from "../middleware/protectRoute";
import { createPost, getPost, deletePost, likeUnlikePost, replyToPost } from "../controllers/post.controller";

const router = express.Router();

router.post('/create', protectRoute, createPost);

router.get('/:id', protectRoute, getPost)

router.delete('/:id', protectRoute, deletePost)

router.post('/like/:id', protectRoute, likeUnlikePost)

router.post('/reply/:id', protectRoute, replyToPost);


export default router;