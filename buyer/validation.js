import Joi from "joi";

const validator = (schema) => async (payload) => {
  try {
    await schema.validateAsync(payload, { abortEarly: false });
  } catch (error) {
    const formattedMessage = error.details.map((err) => err.message);
    throw new Error(formattedMessage);
  }
};

const getCatalog = (payload) => {
  const schema = Joi.object({
    sellerId: Joi.string().required(),
  });
  return validator(schema)(payload);
};

const createBuyOrder = (payload) => {
  const schema = Joi.object({
    productName: Joi.string().required(),
    sellerId: Joi.string().required(),
    catalogId: Joi.string().required(),
  });
  return validator(schema)(payload);
}

export default {
  getCatalog,
  createBuyOrder
};
