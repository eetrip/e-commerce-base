import Joi from 'joi';

const validator = (schema) => async (payload) => {
  try {
    await schema.validateAsync(payload, { abortEarly: false });
  } catch (error) {
    const formattedMessage = error.details.map((err) => err.message);
    throw new Error(formattedMessage);
  }
};

const register = (payload) => {
  const schema = Joi.object({
    name: Joi.string().pattern(/^[a-zA-Z_ ]*$/).required(),
    password: Joi.string().min(6).max(10).required(),
    mobile: Joi.number().min(6000000000).max(9999999999).required(),
    type: Joi.string().required()
  });
  return validator(schema)(payload);
};

const login = (payload) => {
    const schema = Joi.object({
      password: Joi.string().min(6).max(10).required(),
      mobile: Joi.number().min(6000000000).max(9999999999).required()
    });
    return validator(schema)(payload);
  };

export default {
  register,
  login
};
