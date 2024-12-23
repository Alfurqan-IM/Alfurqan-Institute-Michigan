const router = require("express").Router();

const {
  createProgrammes,
  deleteProgramme,
  uploadPrgrammeImages,
  updateProgrammeOutcome,
  getSingleProgramme,
  getAllProgrammes,
  updateProgramme,
} = require("../controllers/programmes");
const {
  authenticated,
  authorizedPermissions,
} = require("../middleware/authentication");

router
  .route("/")
  .post(authenticated, authorizedPermissions("admin"), createProgrammes)
  .get(getAllProgrammes);
router
  .route("/:programme_id")
  .delete(authenticated, authorizedPermissions("admin"), deleteProgramme)
  .get(getSingleProgramme)
  .patch(authenticated, authorizedPermissions("admin"), updateProgramme);
router
  .route("/uploadprogrammeimages/:programme_id")
  .patch(authenticated, authorizedPermissions("admin"), uploadPrgrammeImages);
router
  .route("/updateprogrammeoutcome/:programme_id")
  .patch(authenticated, authorizedPermissions("admin"), updateProgrammeOutcome);
module.exports = router;
