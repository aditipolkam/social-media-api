import express from "express";
import protectRoute from "../middleware/protectRoute";
import { createPost, getPost, deletePost, likeUnlikePost } from "../controllers/post.controller";

const router = express.Router();

router.post('/create', protectRoute, createPost);

router.get('/:id', protectRoute, getPost)

router.delete('/:id', protectRoute, deletePost)

router.post('/like/:id', protectRoute, likeUnlikePost)


export default router;