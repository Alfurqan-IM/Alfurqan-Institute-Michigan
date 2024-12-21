const router = require("express").Router();

const {
  createFeedback,
  getAllFeedBack,
  removeFeedback,
  updateFeedback,
  getUserFeedback,
} = require("../controllers/feedback");
const {
  authenticated,
  authorizedPermissions,
} = require("../middleware/authentication");

router
  .route("/")
  .get(authenticated, authorizedPermissions("admin"), getAllFeedBack)
  .post(authenticated, createFeedback);
router.route("/user").get(authenticated, getUserFeedback);
router
  .route("/:feedback_id")
  .delete(authenticated, removeFeedback)
  .patch(authenticated, updateFeedback);

module.exports = router;
