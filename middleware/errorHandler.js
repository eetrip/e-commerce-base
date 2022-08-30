import responder from "../utils/responseHandler.js";

const errorHandler = (error, req, res, next) => {
  if (error) {
    responder(res)(error, { error: true });
    console.log(error);
    return;
  }
  return next();
};

export default errorHandler;
