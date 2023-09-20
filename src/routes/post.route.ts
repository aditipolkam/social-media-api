import express from "express";
import protectRoute from "../middleware/protector.middleware";
import { createPost, getPost, deletePost } from "../controllers/post.controller";

const router = express.Router();

router.post('/create', protectRoute, createPost);

router.get('/:id', protectRoute, getPost)

router.delete('/:id', protectRoute, deletePost)


export default router;