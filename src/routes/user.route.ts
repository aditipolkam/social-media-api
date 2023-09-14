import express from "express";

const router = express.Router();

router.get('/',function(req, res){
    res.send("Helloe")
})

// router.post('/signup', 
//     signupController
// );

export default router;