// locationRoutes.js
const express = require("express");
const router = express.Router();
const {
  TeSaveLocation,
  TeGetLocationByDate,
  ManagerSaveLocation,
  ManagerGetLocationByDate,
} = require("../controllers/locationController");

// Save location
router.post("/managerlocation", ManagerSaveLocation);
router.get("/get-managerlocation/:userId/:date", ManagerGetLocationByDate);

router.post("/te-location", TeSaveLocation);
// Route to get location data by date
router.get("/get-location/:userId/:date", TeGetLocationByDate);

module.exports = router;
