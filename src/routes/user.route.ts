import express from "express";
import { signupController, loginController, logoutController, followUnfollowUser, updateUser, getUser } from "../controllers/user.controller";
import protectRoute from "../middleware/protector.middleware";
import { AuthenticatedRequest } from "../interfaces/express.generic";

const router = express.Router();

router.get('/',function(req, res){
    res.send("Helloe")
})

router.post('/signup',signupController);
router.post('/login',loginController);
router.post('/logout',logoutController);
router.post('/follow/:id', protectRoute, followUnfollowUser)
router.post('/update', protectRoute, updateUser)
router.get('/profile/:id',getUser)

export default router;