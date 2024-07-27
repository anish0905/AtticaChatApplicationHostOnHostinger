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
router.post("/TE/login", authController.loginTE);
router.post("/Logistic/login", authController.loginLogistic);
router.post("/Cashier/login", authController.loginCashier);


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

router.get("/getAllTE", authController.getAllTE);
router.get("/getAllLogistic", authController.getAllLogistic);

router.get("/getAllDigitalCashier", authController.getAllCashier);

router.get("/getbyId/:id", authController.getById);
router.delete("/delete/:id", authController.deleteById);
router.patch("/update/:id", authController.updateById);

router.put("/accessBlock/:id", authController.accessBlock);
router.put("/access/unblock/:id", authController.accessUnblock);
router.put("/access/blockall", authController.blockAllUser);
router.put("/access/unblock/all", authController.unblockAllUser);

// delete /bouncers/driver/

router.delete("/bouncers/driver/:id", authController.deleteBouncersDriver);

// delete Accountant

router.delete("/accountant/:id", authController.deleteAccountant);
// delete Accountant

router.delete("/software/:id", authController.deletesoftware);

router.delete("/HR/:id", authController.deleteHr);

router.delete("/callCenter/:id", authController.CallCenter);

router.delete("/virtualTeam/:id", authController.deleteVirtualTeam);

router.delete("/monitoringTeam/:id", authController.deleteMonitoringTeam);

router.delete("/security/CCTV/:id", authController.deleteSecurityCCTV);

router.delete("/bouncers/driver/:id", authController.deleteCashier);



router.delete("/te/:id", authController.deleteTE);
router.delete("/logistic/:id", authController.deleteLogistic);

router.delete("/users", authController.deleteUsersByRole);

module.exports = router;
