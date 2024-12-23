const router = require("express").Router();
const { feedbackLimiter } = require("../utils/limiter");
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
  .post(authenticated, feedbackLimiter, createFeedback);
router.route("/user").get(authenticated, getUserFeedback);
router
  .route("/:feedback_id")
  .delete(authenticated, removeFeedback)
  .patch(authenticated, feedbackLimiter, updateFeedback);

module.exports = router;
