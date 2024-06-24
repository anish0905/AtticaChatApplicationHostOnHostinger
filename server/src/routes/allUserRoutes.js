const express = require("express");
const router = express.Router();
const authController = require("../controllers/allUserController");

// User registration
router.post("/register", authController.registerUser);

// User login
router.post("/login", authController.loginUser);

// Route to get user count by role
router.get("/counts/by-role", authController.getUsersCountByRole);
router.get("/getAllDigitalMarketingTeam", authController.getAllDigitalTeams);

module.exports = router;
