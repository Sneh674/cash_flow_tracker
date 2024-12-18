const express = require('express')
const router=express();
const {verifyAccessToken}= require('../helpers/jwt.js')

router.get("/home",verifyAccessToken,(req,res)=>{
    const userId=req.user.id
    res.json({userid : userId})
})

module.exports=router