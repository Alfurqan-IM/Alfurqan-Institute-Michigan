const router = require("express").Router();

const {
  getAllDonations,
  getAllDonors,
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

module.exports = router;
