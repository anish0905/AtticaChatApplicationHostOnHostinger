const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateToken");

const {
  registerManager,
  loginManager,
  logoutManager,
  getAllManagers,
  getManagerById,
  deleteManagerById,
  updateManagerById,
  currentManager,
  deleteAllUsers,
  accessBlock,
  accessUnblock,
  blockAllManager,
  unblockAllManager,
  getuserGroup,
} = require("../controllers/managerController");

router.post("/register", registerManager);
router.post("/login", loginManager);
router.post("/logout", authenticateToken, logoutManager);
router.get("/getAllManagers", getAllManagers);
router.get("/getManagerById/:id", getManagerById);
router.delete("/deleteManagerById/:id", deleteManagerById);
router.put("/updateManagerById/:id", updateManagerById);
router.get("/currentManager", authenticateToken, currentManager);

router.put("/accessBlock/:id", accessBlock);
router.put("/access/unblock/:id", accessUnblock);
router.put("/access/blockall", blockAllManager);
router.put("/access/unblock/all", unblockAllManager);
router.delete("/managerdelete", deleteAllUsers);
router.get("/groups/:id", getuserGroup);

module.exports = router;
