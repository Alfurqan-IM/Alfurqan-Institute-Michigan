const router = require("express").Router();
const { feedbackLimiter } = require("../utils/limiter");
const {
  createEnquiry,
  getAllEnquiries,
  removeEnquiry,
  updateEnquiry,
} = require("../controllers/enquiries");
const {
  authenticated,
  authorizedPermissions,
} = require("../middleware/authentication");

router
  .route("/")
  .get(authenticated, authorizedPermissions("admin"), getAllEnquiries)
  .post(feedbackLimiter, createEnquiry);
router
  .route("/:enq_id")
  .delete(authenticated, authorizedPermissions("admin"), removeEnquiry)
  .patch(authenticated, authorizedPermissions("admin"), updateEnquiry);

module.exports = router;
