const createHTTPError = require("http-errors");
const userModel = require("../../models/user_model.js");
const createHttpError = require("http-errors");
// const jwt=require("jsonwebtoken")
const {signAccessToken}=require("../../helpers/jwt.js")





const verifyOTP=async(req,res,next)=>{
    const {otpentered, otpgenerated, userId}=req.body;
    //or use req.params.id for userId

    if(!userId){return next(createHTTPError(500,"Error receiving user id"))}
    if(!otpgenerated){return next(createHTTPError(500,"Error generating otp"))}
    if(!otpentered){return next(createHttpError(400,"otp required"))}

    if(otpentered!==otpgenerated){return next(createHTTPError(400,"incorrect otp"))}

    try {
        const user = await userModel.findOne({_id:userId})
        if(!user){return next(createHTTPError(500,"User id not found"))}
    } catch (error) {
        return next(createHTTPError(500,"Error while checking for user"))
    }

    try {
        try {
            const updatedUser = await userModel.updateOne(
                { _id: userId },
                { $set: { verifiedonce: true } }
            );
        } catch (error) {
            return next(createHTTPError(500,"Error updating whether user is verified or not"))
        }
        const accesstoken=await signAccessToken(userId)
        res.json({
            id: userId,
            token: accesstoken})
        // const token=sign({sub: newUser._id}, process.env.JWT_SECRET, {expiresIn: '7d'})
    } catch (error) {
        return next(createHTTPError(500,"Error while verifying user"))
    }
}

module.exports = { verifyOTP };