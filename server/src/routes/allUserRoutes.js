const express = require("express");
const router = express.Router();
const authController = require("../controllers/allUserController");

// User registration
router.post("/register", authController.registerUser);

// User login
router.post("/digital/login", authController.loginDigitalMarketing);
router.post("/acc/login", authController.loginAccountant);
router.post("/software/login", authController.loginSoftware);
router.post("/Hr/login", authController.loginHR);
router.post("/callcenter/login", authController.loginCallCenter);
router.post("/virtualTeam/login", authController.loginVirtualTeam);
router.post("/monitoring/login", authController.loginMonitoringTeam);
router.post("/Security/login", authController.loginSecurity);
router.post("/bouncers/login", authController.loginBouncers);

// Route to get user count by role
router.get("/counts/by-role", authController.getUsersCountByRole);

router.get("/getAllDigitalMarketingTeam", authController.getAllDigitalTeams);

router.get("/getAllAccountantTeam", authController.getAllAccountant);

router.get("/getAllSoftwareTeam", authController.getAllSoftware);

router.get("/getAllHRTeam", authController.getAllHR);

router.get("/getAllCallCenterTeam", authController.getAllCallCenter);

router.get("/getAllVirtualTeam", authController.getAllVirtualTeam);

router.get("/getAllMonitoringTeam", authController.getAllMonitoringTeam);

router.get("/getAllSecurityTeam", authController.getAllSecurity);

router.get("/getAllBouncersTeam", authController.getAllBouncers);

router.get("/getbyId/:id", authController.getById);
router.delete("/delete/:id", authController.deleteById);
router.patch("/update/:id", authController.updateById);

router.put("/accessBlock/:id", authController.accessBlock);
router.put("/access/unblock/:id", authController.accessUnblock);
router.put("/access/blockall", authController.blockAllUser);
router.put("/access/unblock/all", authController.unblockAllUser);

module.exports = router;
