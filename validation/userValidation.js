const joi = require("joi");

const validationSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(8).required().messages({
    "string.min": "Password must contain at least 8 characters",
    "any.required": "Password is required",
  }),
});

const subscriptionSchema = joi.object({
  subscription: joi.string()
  .valid("starter", "pro", "business")
  .required()
  .messages({
    "any.only": "Our subscriptions: starter, pro, business",
    "any.required": "Subscription is required",
  }), 
});

const checkUser = async (req, res, next) => {
  try {
    await validationSchema.validateAsync(req.body);
    next();
  } catch (error) {
    res.status(400).json({msg: `missing required ${error.details[0].context.key} field`});
  }
};


const checkSub = async (req, res, next) => {
  try {
    await subscriptionSchema.validateAsync(req.body);
    next();
  } catch (error) {
    res.status(400).json({msg: `missing required ${error.details[0].context.key} field`});
  }
};

module.exports = { checkUser, checkSub };