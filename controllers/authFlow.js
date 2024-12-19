const { StatusCodes } = require("http-status-codes");
const { users: USERS, token: TOKEN } = require("../models");
const crypto = require("crypto");
const passport = require("passport");
const {
  UNAUTHORIZED,
  NOT_FOUND,
  BAD_REQUEST,
} = require("../middleware/customErrors");
const sendVerificationMail = require("../utils/sendVerificationMail");
const { createUser, attachResponseToCookie } = require("../utils/jwt");
const sendPasswordResetMail = require("../utils/sendPasswordResetMail");
const register = async (req, res) => {
  const {
    first_name,
    last_name,
    password,
    email,
    phone,
    gender,
    address,
    city,
    state,
    country,
  } = req.body;
  // console.log(req.body);
  if (
    !first_name ||
    !last_name ||
    !city ||
    !state ||
    !country ||
    !email ||
    !password ||
    !address ||
    !phone ||
    !gender
  ) {
    throw new BAD_REQUEST("pls provide the neccesary fields");
  }
  const isEmailAlreadyExist = await USERS.findOne({ where: { email } });
  if (isEmailAlreadyExist) {
    throw new BAD_REQUEST("This Email has already been registered");
  }

  const isFirstAccount = await USERS.count();
  const role = isFirstAccount === 0 ? "admin" : "user";

  const verificationString = crypto.randomBytes(40).toString("hex");

  const userObject = {
    first_name,
    last_name,
    email,
    role,
    phone,
    password,
    gender,
    address,
    city,
    state,
    country,
    verificationString,
  };
  // console.log(userObject);
  const user = await USERS.create(userObject);
  const origin = "http://localhost:5005";
  // const origin = "http://localhost:5173";

  // verify Email
  await sendVerificationMail({
    origin,
    email: user.email,
    verificationString: user.verificationString,
    fullname: { first_name: user.first_name, last_name: user.last_name },
  });
  res.status(StatusCodes.CREATED).json({
    msg: "Please check your mail and complete your registeration",
    // verificationString,
  });
};

const verifyMail = async (req, res) => {
  const { verificationString, email } = req.body;
  // console.log(req.body);
  const user = await USERS.findOne({ where: { email } });
  // console.log(user);
  if (!user) {
    throw new BAD_REQUEST(
      "verification failed!!!, this email is not registered yet"
    );
  }
  if (verificationString !== user.verificationString) {
    throw new BAD_REQUEST("verification failed!!!");
  }

  user.verificationString = null;
  user.isVerified = true;
  user.verified = Date.now();
  user.save();
  res
    .status(StatusCodes.OK)
    .json({ msg: "Congratulations!!!! Welcome to Alfurqan Institute" });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  //   console.log(req.body);
  if (!email || !password) {
    throw new BAD_REQUEST(
      "You have not provided either an email or a password"
    );
  }
  const user = await USERS.findOne({ where: { email } });
  if (!user) {
    throw new BAD_REQUEST("This email has not been registered yet !!!");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  //   console.log(isPasswordCorrect);

  if (!isPasswordCorrect) {
    throw new UNAUTHORIZED("invalid credentials");
  }
  const isVerified = user.isVerified;
  //   //   const isVerified = false;
  if (!isVerified) {
    throw new UNAUTHORIZED(
      "This Email is not verified yet, please verify your email first !!!"
    );
  }
  const isBlackListed = user.blackListed;
  if (isBlackListed) {
    throw new UNAUTHORIZED(
      "You have been BANNED from accessing this Route sorry !!!!!"
    );
  }
  const tokenUser = createUser(user);
  //   create a refresh token
  let refreshToken = "";

  //   if user session is still valid
  const isTokenStillVaild = await TOKEN.findOne({
    where: { user: user.user_id },
  });
  if (isTokenStillVaild) {
    const isValid = isTokenStillVaild.isValid;
    if (!isValid) {
      throw new UNAUTHORIZED("Token is not valid");
    }
    refreshToken = isTokenStillVaild.refreshToken;
    attachResponseToCookie({ res, refreshToken, tokenUser });
    res.status(StatusCodes.OK).json({ msg: "Login Sucessful !!!!" });
    return;
  }
  refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  await TOKEN.create({ refreshToken, userAgent, ip, user: user.user_id });
  attachResponseToCookie({ res, refreshToken, tokenUser });
  res.status(StatusCodes.OK).json({ msg: "Login Sucessful !!!!" });
};
const showMe = async (req, res) => {
  // console.log(req.user);
  const {
    first_name,
    last_name,
    email,
    role,
    phone,
    gender,
    address,
    city,
    state,
    country,
  } = req.user;
  res.status(StatusCodes.OK).json({
    first_name,
    last_name,
    email,
    role,
    phone,
    gender,
    address,
    city,
    state,
    country,
  });
};
const logout = async (req, res) => {
  // console.log(req.user);
  await TOKEN.destroy({ where: { user: req.user.user_id } });
  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
    sameSite: "None",
    secure: true,
  });
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
    sameSite: "None",
    secure: true,
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out" });
};
// const checkUserRegisterationStatus = async (req, res) => {
//   const { email } = req.body;
//   const user = await USERS.findOne({ where: { email } });
//   if (!user) {
//     res.status(StatusCodes.OK).json({ msg: "notfound" });
//   }
//   res.status(StatusCodes.OK).json({ msg: "found" });
// };
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new UNAUTHORIZED("Authentication invalid, user not found !!!!");
  }
  const user = await USERS.findOne({ where: { email } });
  if (!user) {
    throw new UNAUTHORIZED("Reset password failed !!!!");
  }
  const passwordToken = crypto.randomBytes(40).toString("hex");
  const tenMin = 1000 * 60 * 10;
  user.passwordToken = passwordToken;
  user.passwordExpirationDate = new Date(Date.now() + tenMin);
  await user.save();
  const origin = "http://localhost:5005";
  // const origin = "https://apiariessixteen.onrender.com";
  await sendPasswordResetMail({
    origin,
    email: user.email,
    passwordToken: user.passwordToken,
    fullname: { first_name: user.first_name, last_name: user.last_name },
  });
  res.status(StatusCodes.OK).json({
    msg: "Reset link has been sent to your Email",
    passwordToken,
  });
};
const resetPassword = async (req, res) => {
  const { email, token, password } = req.body;
  if (!email || !token || !password) {
    throw new BAD_REQUEST("Please provides all the neccessary informations");
  }
  const user = await USERS.findOne({ where: { email } });
  if (!user) {
    throw new UNAUTHORIZED("Password reset failed, user not found");
  }
  const now = new Date();
  if ((user.passwordToken = token && now < user.passwordExpirationDate)) {
    user.password = password;
    user.passwordToken = null;
    user.passwordExpirationDate = null;
    user.save();
    res.status(StatusCodes.OK).json({ msg: "Password Reset successfully" });
  }
  throw new UNAUTHORIZED("Password reset failed !!!!!");
};

const blacklist = async (req, res) => {
  const { id: user_id } = req.params;
  const { blacklist, isValid } = req.body;
  const user = await USERS.findOne({ where: { user_id: user_id } });
  const userToken = await TOKEN.findOne({ where: { user: user_id } });
  if (!user || !userToken) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: "User does not have a login session" });
  }
  user.blacklisted = blacklist;
  userToken.isValid = isValid;
  await user.save();
  await userToken.save();
  // Conditional response based on blacklist status
  if (user.blacklisted && !userToken.isValid) {
    return res.status(StatusCodes.OK).json({
      msg: `${user.first_name + " " + user.last_name}  has been blacklisted`,
    });
  } else {
    return res.status(StatusCodes.OK).json({
      msg: `${user.first_name + " " + user.last_name} has been activated`,
    });
  }
};

const googleAuth = (req, res, next) => {
  passport.authenticate("google", { scope: ["profile", "email"] })(
    req,
    res,
    next
  );
};

const googleCallBack = (req, res, next) => {
  passport.authenticate(
    "google",
    {
      successRedirect: "/",
      failureRedirect: "/login",
    },
    async (err, user) => {
      try {
        if (err) {
          return next(err);
        }
        if (!user) {
          return next(new UNAUTHORIZED("Authentication failed pls try again!!"));
        }
        const { email } = user;

        const existingUser = await USERS.findOne({ where: { email } });
        //   console.log(existingUser);
        if (!existingUser) {
          throw new UNAUTHORIZED("User does not exist. Please sign up first.");
        }

        const isVerified = existingUser.isVerified;
        if (!isVerified) {
          throw new UNAUTHORIZED(
            "Authentication invalid, your google Email was not verified, please provide a verified email"
          );
        }

        const isBlackListed = existingUser.blackListed;
        if (isBlackListed) {
          throw new UNAUTHORIZED(
            "You have been BANNED from accessing this Route sorry !!!!!"
          );
        }

        const tokenUser = createUser(existingUser);

        let refreshToken = "";
        const existingToken = await TOKEN.findOne({
          where: {
            user: existingUser.user_id,
          },
        });
        if (existingToken) {
          const isValid = existingToken.isValid;
          if (!isValid) {
            throw new UNAUTHORIZED("Authentication invalid, invalid token");
          }
          refreshToken = existingToken.refreshToken;
        } else {
          refreshToken = crypto.randomBytes(40).toString("hex");
          const userAgent = req.headers["user-agent"];
          const ip = req.ip;
          await TOKEN.create({
            refreshToken,
            userAgent,
            ip,
            user: existingUser.user_id,
          });
        }

        attachResponseToCookie({ tokenUser, res, refreshToken });
        return res.status(StatusCodes.OK).json({
          msg: "login successful",
        });
      } catch (err) {
        next(err);
      }
    }
  )(req, res, next);
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const user_id = req.user.user_id;
  // you need to add a confirm password to this
  if (!oldPassword || !newPassword || !confirmPassword) {
    throw new BAD_REQUEST(`Pls provide all fields`);
  }
  if (newPassword !== confirmPassword) {
    throw new BAD_REQUEST(`New and old password are not the same`);
  }
  const user = await USERS.findOne({ where: { user_id } });

  if (!user) {
    throw new NOT_FOUND(`There is NO user with the id of ${user_id}`);
  }
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new UNAUTHORIZED(`Password update failed, old passwors is wrong`);
  }
  user.password = newPassword;
  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Password Successfully updated" });
};

module.exports = {
  register,
  verifyMail,
  login,
  showMe,
  logout,
  forgotPassword,
  resetPassword,
  blacklist,
  googleAuth,
  googleCallBack,
  updateUserPassword,
  // checkUserRegisterationStatus,
};
