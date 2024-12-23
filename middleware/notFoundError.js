const { StatusCodes } = require("http-status-codes");

const notFound = async (req, res) => {
  res
    .statuscode(StatusCodes.BAD_REQUEST)
    .json({ msg: "This route does not exist" });
};

module.exports = notFound;
