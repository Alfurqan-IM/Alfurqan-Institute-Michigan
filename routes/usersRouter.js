const router = require("express").Router();
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
router.route("/avatar").post(authenticated, uploadAvatar);
router
  .route("/:user_id")
  .get(authenticated, getSingleUser)
  .patch(authenticated, updateUser)
  router.route("/unsubscribe/:user_id").patch(authenticated, unSubscribeToEmail);
  router.route("/subscribe/:user_id").patch(authenticated, subscribeToEmail);
module.exports = router;
