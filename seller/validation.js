import Joi from "joi";

const validator = (schema) => async (payload) => {
  try {
    await schema.validateAsync(payload, { abortEarly: false });
  } catch (error) {
    const formattedMessage = error.details.map((err) => err.message);
    throw new Error(formattedMessage);
  }
};

const createCatalog = (payload) => {
  const schema = Joi.object({
    name: Joi.string()
      .pattern(/^[a-zA-Z_ ]*$/)
      .required(),
  });
  return validator(schema)(payload);
};

const addItems = (payload) => {
  const schema = Joi.object({
    catalogId: Joi.string().required(),
    items: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required(),
          price: Joi.number().min(1).max(999999).required(),
        })
      )
      .max(10)
      .required(),
  });
  return validator(schema)(payload);
};

export default {
  createCatalog,
  addItems,
};
