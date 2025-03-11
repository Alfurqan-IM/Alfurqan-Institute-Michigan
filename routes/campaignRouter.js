
const router = require("express").Router();

const {
  getAllCampaigns,
  createCampaign,
  uploadCampaignImg,
  updateCampaign,
  removeCampaign,
  getAllCampaignsDonor,
} = require("../controllers/campaigns_aim");
const {
  authenticated,
  authorizedPermissions,
} = require("../middleware/authentication");

router
  .route("/")
  .post(authenticated, authorizedPermissions("admin"), createCampaign)
  .get(getAllCampaigns);
router
  .route("/donorCampaigns").get(getAllCampaignsDonor);
router
  .route("/uploadcampaignimg/:campaign_id")
  .patch(authenticated, authorizedPermissions("admin"), uploadCampaignImg);
router
  .route("/:campaign_id")
  .patch(authenticated, authorizedPermissions("admin"), updateCampaign);

router
  .route("/:campaign_id")
  .delete(authenticated, authorizedPermissions("admin"), removeCampaign);

module.exports = router;
