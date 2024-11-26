const { StatusCodes } = require("http-status-codes");
const CustomError = require("./custom");

class UNAUTHORIZED extends CustomError {
  constructor(message) {
    super(message);
    this.statuscode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = UNAUTHORIZED;
