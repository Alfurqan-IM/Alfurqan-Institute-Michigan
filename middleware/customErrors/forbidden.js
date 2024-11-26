const { StatusCodes } = require("http-status-codes");
const CustomError = require("./custom");

class FORBIDDEN extends CustomError {
  constructor(message) {
    super(message);
    this.statuscode = StatusCodes.FORBIDDEN;
  }
}

module.exports = FORBIDDEN;
