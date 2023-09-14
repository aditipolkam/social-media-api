import express from "express";
import { signupController, loginController, logoutController } from "../controllers/user.controller";

const router = express.Router();

router.get('/',function(req, res){
    res.send("Helloe")
})

router.post('/signup',signupController);
router.post('/login',loginController);
router.post('/logout',logoutController);

export default router;