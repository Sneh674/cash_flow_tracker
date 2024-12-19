const createHTTPError = require("http-errors");
const userModel = require("../../models/user_model.js");
const {registerSchema, loginEmailSchema, loginMobileSchema}= require("../../helpers/validation_schema.js")


const registerUser = async (req, res, next) => {
    const { name, cc, mobile, email } = req.body;
    if (!name || !mobile || !email) {
        return next(createHTTPError(400, "All fields required"));
    }
    try {
        const result=await registerSchema.validateAsync(req.body)
        console.log(result);
        try {
            const user = await userModel.findOne({ mobile: mobile });
            if (user) {
                return next(createHTTPError(400, "User already exists"));
            }
        } catch (error) {
            return next(
                createHTTPError(500, `Error while checking for user in db: ${error}`)
            );
        }
        try {
            const newUser = await userModel.create({
                name,
                cc,
                mobile,
                email,
                verifiedonce: false,
            });
            res.json({ user: newUser });
        } catch (error) {
            return next(
                createHTTPError(500, `error while adding user to db: ${error}`)
            );
        }
    } catch (error) {
        if(error.isJoi==true){return next(createHTTPError(422,`Invalid input: Joi error: ${error}`))}
        return next(createHTTPError(500, `Error while registering user: ${error}`));
    }
};

const loginUser = async (req, res, next) => {
    const { cc, mobile, email } = req.body;
    if ((!cc || !mobile) && !email) {
        return next(
            createHTTPError(
                400,
                "Either mobile with country code or email is required"
            )
        );
    }
    try {
        let user;
        if (cc && mobile) {
            const result=await loginMobileSchema.validateAsync({cc, mobile})
            console.log(result);
            user = await userModel.findOne({ mobile: mobile, countrycode: cc });
            if (!user) {
                return next(createHTTPError(400, "User not found with provided mobile and country code"));
            }
        } else if (email) {
            const result=await loginEmailSchema.validateAsync({email})
            console.log(result);
            user = await userModel.findOne({ email: email });
            if (!user) {
                return next(createHTTPError(400, "User not found with provided email"));
            }
        }
        res.json({
            message: "User logged in successfully",
            user: user,
        });
    } catch (error) {
        return next(createHTTPError(500, `Error while logging in user: ${error}`));
    }
};

module.exports = { registerUser, loginUser };
