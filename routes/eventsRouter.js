 const router = require("express").Router();

 const {
   getAllEvents,
   createEvent,
   uploadEventImg,
   updateEvent,
   removeEvent,
 } = require("../controllers/events");
 const {
   authenticated,
   authorizedPermissions,
 } = require("../middleware/authentication");

 router
   .route("/")
   .post(authenticated, authorizedPermissions("admin"), createEvent)
   .get(getAllEvents);
 router
   .route("/uploadeventimg/:event_id")
   .patch(authenticated, authorizedPermissions("admin"), uploadEventImg);
 router
   .route("/:event_id")
   .patch(authenticated, authorizedPermissions("admin"), updateEvent);

 router
   .route("/:event_id")
   .delete(authenticated, authorizedPermissions("admin"), removeEvent);

 module.exports = router;
