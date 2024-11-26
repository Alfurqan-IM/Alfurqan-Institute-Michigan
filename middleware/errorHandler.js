const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  //   console.log(err.message, "this is the message", err);
  let customError = {
    msg: err.message || "Something went wrong. Try again later",
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  };

  // Duplicate entry error (ER_DUP_ENTRY)
  if (err.code === "ER_DUP_ENTRY") {
    customError.msg = "Duplicate value entered. Please choose another value";
    customError.statusCode = 400;
  }

  // Data too long for column error (ER_DATA_TOO_LONG)
  if (err.code === "ER_DATA_TOO_LONG") {
    customError.msg = `Data too long for column: ${err.sqlMessage}`;
    customError.statusCode = 400;
  }

  // Foreign key constraint fails (ER_NO_REFERENCED_ROW or ER_ROW_IS_REFERENCED)
  if (
    err.code === "ER_NO_REFERENCED_ROW" ||
    err.code === "ER_ROW_IS_REFERENCED"
  ) {
    customError.msg = `Foreign key constraint fails: ${err.sqlMessage}`;
    customError.statusCode = 400;
  }

  // Handle any other specific MySQL errors you care about
  // ...

  return res
    .status(customError.statusCode)
    .json({ msg: customError.msg, statusCode: customError.statusCode });
};

module.exports = errorHandlerMiddleware;
