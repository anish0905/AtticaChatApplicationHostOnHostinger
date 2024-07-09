// locationRoutes.js
const express = require("express");
const router = express.Router();
const {
  saveLocation,
  getLocation,
  TeSaveLocation,
  TeGetLocationByDate,
} = require("../controllers/locationController");

// Save location
router.post("/", saveLocation);
router.get("/get/:id", getLocation);

router.post("/te-location", TeSaveLocation);
// Route to get location data by date
router.get("/get-location/:userId/:date", TeGetLocationByDate);

module.exports = router;
