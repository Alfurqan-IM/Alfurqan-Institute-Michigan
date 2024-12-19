const router = require("express").Router();

const {
  createEnquiry,
  getAllEnquiries,
  removeEnquiry,
} = require("../controllers/enquiries");
const {
  authenticated,
  authorizedPermissions,
} = require("../middleware/authentication");

router
  .route("/")
  .get(authenticated, authorizedPermissions("admin"), getAllEnquiries);
router
  .route("/")
  .post(authenticated, authorizedPermissions("admin"), createEnquiry);
router
  .route("/:enq_id")
  .delete(authenticated, authorizedPermissions("admin"), removeEnquiry);

module.exports = router;
