const { verifyToken, attachResponseToCookie } = require("../utils/jwt");
const db = require("../models");
const { token } = db;
const { UNAUTHORIZED } = require("../middleware/customErrors");

const authenticated = async (req, res, next) => {
  const { accessToken, refreshToken: refreshedToken } = req.signedCookies;
  try {
    if (accessToken) {
      const { tokenUser } = verifyToken(accessToken);
      // console.log(tokenUser);
      req.user = tokenUser;
      return next();
    }

    const { tokenUser, refreshToken } = verifyToken(refreshedToken);
    // console.log(tokenUser, refreshToken);

    const existingToken = await token.findOne({
      where: {
        user: tokenUser.user_id,
        refreshToken: refreshToken,
      },
    });

    const isValidToken = existingToken?.isValid;
    if (!isValidToken || !existingToken) {
      throw new UNAUTHORIZED("Token is not valid");
    }
    req.user = tokenUser;
    attachResponseToCookie({ tokenUser, res, refreshToken });
    next();
  } catch (err) {
    throw new UNAUTHORIZED("Authentication invalid, there is no token");
  }
};

const authorizedPermissions = (...roles) => {
  const authorize = (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UNAUTHORIZED("Not authorized to access this route");
    }
    next();
  };
  return authorize;
};

const checkPermissions = ({ reqUser, resUser }) => {
  if (reqUser.role === "admin") return;
  if (reqUser.user_id === resUser) return;
  throw new UNAUTHORIZED("you are not authorized to access this route");
};

module.exports = { authenticated, authorizedPermissions, checkPermissions };
