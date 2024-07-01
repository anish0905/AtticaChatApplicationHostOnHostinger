const express = require("express");
const router = express.Router();
const {
  registerEmployee,
  loginUser,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
  getTotalMemberAccordingToGroup,
  getEmployeeById,

  accessBlock,
  accessUnblock,
  BolockAllEmployee,
  Unblocked,
} = require("../controllers/employeeRegController");

// Register
router.post("/register", registerEmployee);

// Login
router.post("/login", loginUser);

// Get all employees
router.get("/", getAllEmployees);

// Update employee details
router.put("/:employeeId", updateEmployee);

// Delete employee
router.delete("/:employeeId", deleteEmployee);
router.get("/getTotalMember", getTotalMemberAccordingToGroup);
router.get("/a/:id", getEmployeeById);

// Route to toggle 'access' field for the current user
router.put("/accessBlock/:id", accessBlock);
router.put("/access/unblock/:id", accessUnblock);
router.put("/access/blockall", BolockAllEmployee);
router.put("/unblock", Unblocked);

module.exports = router;
