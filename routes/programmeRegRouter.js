const express = require("express");
const router = express.Router();
const {
  editReg,
  deleteReg,
  getUserRegistrations,
  getAllRegistrations,
  createReg,
} = require("../controllers/programme_reg");
const {
  authenticated,
  authorizedPermissions,
} = require("../middleware/authentication");

// User Routes
router
  .route("/user/:reg_id")
  .patch(authenticated, editReg)
  .delete(authenticated, deleteReg);
router
  .route("/user")
  .get(authenticated, getUserRegistrations)
  .post(authenticated, createReg);

// Admin Route
router
  .route("/admin")
  .get(authenticated, authorizedPermissions("admin"), getAllRegistrations);

module.exports = router;
