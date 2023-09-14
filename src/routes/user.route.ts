import express from "express";
import { signupController } from "../controllers/user.controller";

const router = express.Router();

router.get('/',function(req, res){
    res.send("Helloe")
})

router.post('/signup', 
    signupController
);

export default router;