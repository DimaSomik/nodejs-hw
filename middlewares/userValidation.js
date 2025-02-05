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

const avatarSchema = joi.object({
  file: joi.object({
    mimetype: joi.string()
      .valid("image/jpeg", "image/png", "image/gif")
      .required()
      .messages({
        "any.only": "Allowed file formats: jpeg, png, gif",
        "any.required": "File is required",
      }),
    size: joi.number()
      .max(4 * 1024 * 1024)
      .required()
      .messages({
        "number.max": "File size can't be bigger than 4MB",
        "any.required": "File size is required",
      }),
  }),
});

const emailSchema = joi.object({
  email: joi.string().email().required(),
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

const checkAvatar = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ message: "File was not found"});
  };

  const { mimetype, size } = req.file;

  try {
    await avatarSchema.validateAsync({
      file: { mimetype, size }
    });
    next();
  } catch (error) {
    res.status(400).json({msg: `missing required ${error.details[0].context.key} field`});
  }
};


const checkEmail = async (req, res, next) => {
  try {
    await emailSchema.validateAsync(req.body);
    next();
  } catch (error) {
    res.status(400).json({msg: `missing required ${error.details[0].context.key} field`});
  }
};

module.exports = { checkUser, checkSub, checkAvatar, checkEmail };