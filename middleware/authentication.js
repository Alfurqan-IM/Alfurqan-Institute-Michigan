const { verifyToken, attachResponseToCookie } = require("../utils/jwt");
const db = require("../models");
const { token } = db;
const { UNAUTHORIZED } = require("../middleware/customErrors");

// const authenticated = async (req, res, next) => {
//   const { accessToken, refreshToken: refreshedToken } = req.signedCookies;
//   try {
//     if (accessToken) {
//       const { tokenUser } = verifyToken(accessToken);
//       // console.log(tokenUser);
//       req.user = tokenUser;
//       return next();
//     }

//     const { tokenUser, refreshToken } = verifyToken(refreshedToken);
//     // console.log(tokenUser, refreshToken);

//     const existingToken = await token.findOne({
//       where: {
//         user: tokenUser.user_id,
//         refreshToken: refreshToken,
//       },
//     });

//     const isValidToken = existingToken?.isValid;
//     if (!isValidToken || !existingToken) {
//       throw new UNAUTHORIZED("Token is not valid");
//     }
//     req.user = tokenUser;
//     attachResponseToCookie({ tokenUser, res, refreshToken });
//     next();
//   } catch (err) {
//     throw new UNAUTHORIZED("Authentication invalid, there is no token");
//   }
// };
const authenticated = async (req, res, next) => {
  try {
    // 1. Access token from header
    const authHeader = req.headers.authorization;
    let accessToken = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      accessToken = authHeader.split(" ")[1];
    }

    // 2. Access token from cookies
    if (!accessToken) {
      accessToken = req.signedCookies.accessToken;
    }

    // Validate access token if present
    if (accessToken) {
      const { tokenUser } = verifyToken(accessToken);
      req.user = tokenUser;
      return next();
    }

    // 3. No access token → try refresh token
    const refreshedToken = req.signedCookies.refreshToken;
    if (!refreshedToken) {
      throw new UNAUTHORIZED("No token provided");
    }
    const { tokenUser, refreshToken } = verifyToken(refreshedToken);

    const existingToken = await token.findOne({
      where: {
        user: tokenUser.user_id,
        refreshToken: refreshToken,
      },
    });

    if (!existingToken || !existingToken.isValid) {
      throw new UNAUTHORIZED("Token not valid");
    }

    // 4. Refresh valid → issue new access token
    attachResponseToCookie({ tokenUser, res, refreshToken });
    req.user = tokenUser;
    //console.log(refreshToken, "refresh token",req.user);
    return next();
  } catch (err) {
    throw new UNAUTHORIZED("Authentication invalid");
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
// checkPermissions({ reqUser: req.user, resUser: req.user.user_id });
