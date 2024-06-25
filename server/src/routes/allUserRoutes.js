const express = require("express");
const router = express.Router();
const authController = require("../controllers/allUserController");

// User registration
router.post("/register", authController.registerUser);

// User login
router.post("/digital/login", authController.loginDigitalMarketing);
router.post("/acc/login", authController.loginAccountant);
router.post("/software/login", authController.loginSoftware);
router.post("/Hr/login", authController.loginHR)
router.post("/callcenter/login", authController.loginCallCenter);
router.post("/virtualTeam/login", authController.loginVirtualTeam);
router.post("/monitoring/login", authController.loginMonitoringTeam);
router.post("/Security/login", authController.loginSecurity);
router.post("/bouncers/login", authController.loginBouncers);


// Route to get user count by role
router.get("/counts/by-role", authController.getUsersCountByRole);

router.get("/getAllDigitalMarketingTeam", authController.getAllDigitalTeams);

router.get("/getAllAccountantTeam", authController.getAllAccountantTeams);

router.get("/getAllSoftwareTeam", authController.getAllSoftwareTeams);

router.get("/getAllHRTeam", authController.getAllHRTeams);

router.get("/getAllCallCenterTeam", authController.getAllCallCenterTeams);

router.get("/getAllVirtualTeam", authController.getAllVirtualTeams);

router.get("/getAllMonitoringTeam", authController.getAllMonitoringTeams);


router.get("/getbyId/:id", authController.getById)
router.get("/delete", authController.deleteById)

module.exports = router;
