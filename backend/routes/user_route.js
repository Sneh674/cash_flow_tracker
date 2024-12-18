const express = require('express')
const router=express();
const { registerUser, loginUser }=require("../controllers/user/userdetails_controller.js")
const {verifyOTP}=require("../controllers/user/verifyotp_conroller.js")

router.post("/register",registerUser)
router.post("/login",loginUser)
router.post("/verifyotp",verifyOTP)

module.exports=router