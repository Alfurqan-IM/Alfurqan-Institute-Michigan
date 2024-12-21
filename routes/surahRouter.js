const router = require("express").Router();

const {
  addSurah,
  getSurah,
  updateSurah,
} = require("../controllers/quranSurah");
const {
  authenticated,
  authorizedPermissions,
} = require("../middleware/authentication");

router
  .route("/")
  .post(authenticated, authorizedPermissions("admin"), addSurah)
  .get(getSurah);
router
  .route("/:surah_id")
  .patch(authenticated, authorizedPermissions("admin"), updateSurah);

module.exports = router;
