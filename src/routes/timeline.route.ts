import express from "express";
import protectRoute from "../middleware/protectRoute";
import { getFeedPosts } from "../controllers/timeline.controller";

const router = express.Router();

router.get('/recent-posts', protectRoute, getFeedPosts)

export default router;