const express = require("express");
const router = express.Router();
const {
  billingTeamRegistration,
  billingTeamLogin,
  logoutBillingTeam,
  getUserById,
  updateUserById,
  delUserbyId,
  getAllUsers,
  accessBlock,
  accessUnblock,
  blockAllUser,
} = require("../controllers/BillingTeamUserController");

router
  .post("/register", billingTeamRegistration)
  .post("/login", billingTeamLogin)
  .post("/logout", logoutBillingTeam)
  .get("/getUserById/:id", getUserById)
  .put("/updateUserById/:id", updateUserById)
  .delete("/delUserbyId/:id", delUserbyId)
  .get("/getAllUsers", getAllUsers);

router.put("/accessBlock/:id", accessBlock);
router.put("/access/unblock/:id", accessUnblock);
router.put("/access/blockall", blockAllUser);
// router.put("/access/unblock/all", authController.unblockAllUser);

module.exports = router;
