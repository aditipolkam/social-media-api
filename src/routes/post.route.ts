import express from "express";
import protectRoute from "../middleware/protector.middleware";
import { createPost } from "../controllers/post.controller";

const router = express.Router();

router.post('/create', protectRoute, createPost);

export default router;