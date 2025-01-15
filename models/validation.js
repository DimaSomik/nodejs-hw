const joi = require("joi");

const validationSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  phone: joi.string().required(),
  favorite: joi.boolean(),
});

const checkContact = async (req, res, next) => {
  try {
    await validationSchema.validateAsync(req.body);
    next();
  } catch (error) {
    res.status(400).json({msg: `missing required ${error.details[0].context.key} field`});
  }
};

module.exports = { checkContact };