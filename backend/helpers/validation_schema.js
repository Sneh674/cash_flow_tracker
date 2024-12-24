const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().min(1).required(),
  cc: Joi.string().optional().default("91"),
  mobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
  email: Joi.string().email().lowercase().required(),
});
const loginMobileSchema = Joi.object({
  cc: Joi.string().optional().default("91"),
  mobile: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
});
const loginEmailSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
});

module.exports = { registerSchema, loginEmailSchema, loginMobileSchema };
