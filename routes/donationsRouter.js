const router = require("express").Router();

const {
  getAllDonations,
  getAllDonors,
  donationwebhook,
} = require("../controllers/donations");
const {
  authenticated,
  authorizedPermissions,
} = require("../middleware/authentication");

router
  .route("/")
  .get(authenticated, authorizedPermissions("admin"), getAllDonations);

router
  .route("/donors")
  .get(authenticated, authorizedPermissions("admin"), getAllDonors);
router.route("/notification").post(donationwebhook);

module.exports = router;

