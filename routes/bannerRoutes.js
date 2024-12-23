const router = require("express").Router();

const {
  getAllBanners,
  createBanner,
  uploadBannerImg,
  updateBanner,
  removeBanner,
} = require("../controllers/banner");
const {
  authenticated,
  authorizedPermissions,
} = require("../middleware/authentication");

router
  .route("/")
  .post(authenticated, authorizedPermissions("admin"), createBanner)
  .get(getAllBanners);
router
  .route("/uploadbannerimg/:banner_id")
  .patch(authenticated, authorizedPermissions("admin"), uploadBannerImg);
router
  .route("/:banner_id")
  .patch(authenticated, authorizedPermissions("admin"), updateBanner);

router
  .route("/:banner_id")
  .delete(authenticated, authorizedPermissions("admin"), removeBanner);

module.exports = router;
