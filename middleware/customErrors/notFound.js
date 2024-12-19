const { StatusCodes } = require("http-status-codes");
const CustomError = require("./custom");

class NOT_FOUND extends CustomError {
  constructor(message) {
    super(message);
    this.statuscode = StatusCodes.NOT_FOUND;
  }
}

module.exports = NOT_FOUND;
