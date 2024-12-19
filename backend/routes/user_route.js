const express = require('express')
const router=express();
const { registerUser, loginUser }=require("../controllers/user/userdetails_controller.js")
const {verifyOTP}=require("../controllers/user/verifyotp_conroller.js")



router.post("/register",registerUser)


/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     description: Login for users with email or mobile and country code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cc:
 *                 type: string
 *                 description: Country code (required if mobile is provided)
 *               mobile:
 *                 type: string
 *                 description: Mobile number (required if country code is provided)
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address (required if mobile and country code are not provided)
 *             required:
 *               - cc
 *               - mobile
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   additionalProperties: true
 *       400:
 *         description: Invalid login credentials or missing parameters
 *       500:
 *         description: Error while logging in user
 */
router.post("/login",loginUser)

/**
 * @swagger
 * /:
 *  post:
 *      summary: verify otp
 *      description: otp verifiction using post method
 *      requestBody:
 *          required: true
 *      responses:
 *          200:
 *              description: successfully verified otp
 *          400:
 *             description: OTP verification failed
 */
router.post("/verifyotp",verifyOTP)

module.exports=router