import express from "express";
import protectRoute from "../middleware/protector.middleware";
import { createPost, getPost } from "../controllers/post.controller";

const router = express.Router();

router.post('/create', protectRoute, createPost);

router.get('/:id', protectRoute, getPost)

export default router;