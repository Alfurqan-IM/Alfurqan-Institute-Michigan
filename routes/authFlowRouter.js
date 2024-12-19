const router = require("express").Router();

const {
  register,
  verifyMail,
  login,
  showMe,
  logout,
  // checkUserRegisterationStatus,
  forgotPassword,
  resetPassword,
  blacklist,
  googleAuth,
  googleCallBack,
  updateUserPassword,
} = require("../controllers/authFlow");
const {
  authenticated,
  authorizedPermissions,
} = require("../middleware/authentication");

router.route("/register").post(register);
router.route("/verify-email").post(verifyMail);
router.route("/login").post(login);
router.route("/google").get(googleAuth);
router.route("/google/callback").get(googleCallBack);
router.route("/logout").delete(authenticated, logout);
// router.route("/check").post(checkUserRegisterationStatus);
router.route("/forgotpassword").post(forgotPassword);
router.route("/resetpassword").patch(resetPassword);
router.route("/updatepassword").patch(authenticated, updateUserPassword);
router.route("/showme").get(authenticated, showMe);
router
  .route("/blacklist/:id")
  .patch(authenticated, authorizedPermissions("admin"), blacklist);

module.exports = router;
