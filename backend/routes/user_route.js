const express = require("express");
const router = express();
const {
  registerUser,
  loginUser,
} = require("../controllers/user/userdetails_controller.js");
const { verifyOTP } = require("../controllers/user/verifyotp_conroller.js");

/**
 * @openapi
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: This endpoint allows for the registration of a new user by providing required details like name, mobile, and email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The full name of the user.
 *               cc:
 *                 type: string
 *                 description: The country code for the user's mobile number.
 *               mobile:
 *                 type: string
 *                 description: The mobile number of the user.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user.
 *             required:
 *               - name
 *               - mobile
 *               - email
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   additionalProperties: true
 *       400:
 *         description: Bad request due to missing fields or user already exists
 *       500:
 *         description: Server error during registration process
 *       422:
 *         description: Invalid input, Joi error
 */
router.post("/register", registerUser);

/**
 * @openapi
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
router.post("/login", loginUser);

/**
 * @openapi
 * /verifyotp:
 *   post:
 *     summary: Verify OTP for user authentication
 *     description: This endpoint allows verifying the OTP entered by the user to authenticate them.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otpentered:
 *                 type: string
 *                 description: OTP entered by the user for verification
 *               otpgenerated:
 *                 type: string
 *                 description: OTP that was generated and sent to the user
 *               userId:
 *                 type: string
 *                 description: User ID of the person attempting OTP verification
 *             required:
 *               - otpentered
 *               - otpgenerated
 *               - userId
 *     responses:
 *       200:
 *         description: OTP successfully verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The user ID
 *                 token:
 *                   type: string
 *                   description: The access token returned after successful OTP verification
 *       400:
 *         description: Invalid OTP or missing parameters
 *       500:
 *         description: Server error, could not verify OTP
 */
router.post("/verifyotp", verifyOTP);

module.exports = router;
