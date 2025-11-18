const jwt = require("jsonwebtoken");
const createUser = (user) => {
  const userDetails = user.dataValues;
  const payload = {
    user_id: userDetails.user_id,
    first_name: userDetails.first_name,
    last_name: userDetails.last_name,
    user_name: userDetails.user_name,
    email: userDetails.email,
    role: userDetails.role,
    phone: userDetails.phone,
    gender: userDetails.gender,
    image: userDetails.image,
    city: userDetails.city,
    state: userDetails.state,
    country: userDetails.country,
    address: userDetails.address,
    notification: userDetails.notification,
  };
  console.log(payload,'payload here');
  return payload;
};

const createToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};
const verifyToken = (token) => {
  const isValid = jwt.verify(token, process.env.JWT_SECRET);
  return isValid;
};

const attachResponseToCookie = ({ res, tokenUser, refreshToken }) => {
  // const accessTokenJWT = createToken({ tokenUser });
  const refreshTokenJWT = createToken({ tokenUser, refreshToken });
  //const oneDay = 1000 * 60 * 60 * 24;
  const twoWeeks = 1000 * 60 * 60 * 24 * 14;
  // console.log(accessTokenJWT,refreshTokenJWT)
  // res.cookie("accessToken", accessTokenJWT, {
  //   httpOnly: true,
  //   expires: new Date(Date.now() + oneDay),
  //   sameSite: "None",
  //   // secure: process.env.NODE_ENV === "production",
  //   signed: true,
  //   secure: true,
  // });
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + twoWeeks),
    sameSite: isProduction ? "None" : "Lax",
    secure: isProduction, // secure only in production
    signed: true,
  });
};

module.exports = {
  verifyToken,
  createToken,
  createUser,
  attachResponseToCookie,
};
