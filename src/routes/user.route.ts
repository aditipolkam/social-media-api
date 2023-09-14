import express from "express";
import { signupController, loginController, logoutController, followUnfollowUser } from "../controllers/user.controller";
import protectRoute from "../middleware/protectRoute";

const router = express.Router();

router.get('/',function(req, res){
    res.send("Helloe")
})

router.post('/signup',signupController);
router.post('/login',loginController);
router.post('/logout',logoutController);
router.post('/follow/:id', protectRoute, followUnfollowUser)

export default router;