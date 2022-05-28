import { BadRequestError, ErrorResponse } from "../utils/errorResponse.js";

const notFound = (req, res, next) => {
  return next(new ErrorResponse(`Not found - ${req.originalUrl} `), 404);
};

const errorHandler = (err, req, res, next) => {
  let error = { ...err }; 

  error.message = err.message;

  // Log to console for developer
  console.log(err.stack.red);

  //Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = `Resource not found`;
    error = new ErrorResponse(message, 404); //instanciramo objekat klase ErrorResponse,proslijeđujemo message i statusCode.
  }

  //Mongoose duplicate key
  if (err.code === 11000) {
    const message = `Duplicate field value entered`;
    error = new BadRequestError(message, 400);
  }

  //Mongoose validation error(missing field error)
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new BadRequestError(message, 400);
  }

  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || "Server Error" });
};

export { notFound, errorHandler };
