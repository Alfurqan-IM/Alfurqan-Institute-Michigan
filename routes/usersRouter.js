const router = require("express").Router();
const { uploadLimiter, feedbackLimiter } = require("../utils/limiter");
const {
  getAllUsers,
  getSingleUser,
  updateUser,
  uploadAvatar,
  subscribeToEmail,
  unSubscribeToEmail,
} = require("../controllers/users");
const {
  authenticated,
  authorizedPermissions,
} = require("../middleware/authentication");
router
  .route("/")
  .get(authenticated, authorizedPermissions("admin"), getAllUsers);
router.route("/avatar").post(authenticated, uploadLimiter, uploadAvatar);
router
  .route("/:user_id")
  .get(authenticated, getSingleUser)
  .patch(authenticated, feedbackLimiter, updateUser);
router.route("/unsubscribe/:user_id").patch(authenticated, unSubscribeToEmail);
router.route("/subscribe/:user_id").patch(authenticated, subscribeToEmail);
module.exports = router;
