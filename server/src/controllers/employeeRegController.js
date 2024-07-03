const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const EmployeReg = require("../model/employeeRegModel");
const { json } = require("express");

const mongoose = require("mongoose");

const registerEmployee = asyncHandler(async (req, res) => {
  const {
    name,
    password,
    confirmPassword,
    employeeId,
    state,
    language,
    grade,
    group,
  } = req.body;

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ error: "Password and confirm password do not match!" });
  }

  // Validate other mandatory fields
  if (
    !name ||
    !password ||
    !confirmPassword ||
    !employeeId ||
    !state ||
    !grade ||
    !group
  ) {
    return res.status(400).json({ error: "All fields are mandatoryyy!" });
  }

  // let user_id;
  // if (req.userAdministrator) {
  //   user_id = req.userAdministrator.id;
  // } else {
  //   return res.status(401).json({ error: "User not authenticated" });
  // }

  const employeeAvailable = await EmployeReg.findOne({ employeeId });
  if (employeeAvailable) {
    return res.status(400).json({ error: "User already registered!" });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const employeeRegistration = await EmployeReg.create({
    name,
    password: hashedPassword,
    confirmPassword: hashedPassword,
    employeeId,
    state,
    language,
    grade,
    group,
  });
  console.log(employeeRegistration);

  res.status(201).json({ employeeRegistration });
});

const loginUser = asyncHandler(async (req, res) => {
  const { employeeId, password } = req.body;

  if (!employeeId || !password) {
    return res.status(400).json({ error: "All fields are mandatory!" });
  }

  // Check if there's an employee with access=true

  // Check if the employee attempting to log in has access=true
  const employeeAvailable = await EmployeReg.findOne({ employeeId });

  if (
    !employeeAvailable ||
    !(await bcrypt.compare(password, employeeAvailable.password))
  ) {
    return res
      .status(401)
      .json({ error: "Employee ID or password is not valid" });
  }
  
  // if (!employeeAvailable.access) {
  //   return res.status(401).json({ error: "Employee not authorized" });
  // }

  // Ensure the employee attempting to log in has access=true
  if (!employeeAvailable.access) {
    return res.status(401).json({ error: "Employee not authorized" });
  }

  // Create JWT token
  const accessToken = jwt.sign(
    {
      employeeAvailable: {
        id: employeeAvailable.id,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  // Return token and employee details
  res.status(200).json({
    accessToken,
    employeeGrade: employeeAvailable.grade,
    employeeTeam: employeeAvailable.group,
    _id: employeeAvailable._id,
  });
});

const getAllEmployees = asyncHandler(async (req, res) => {
  const employees = await EmployeReg.find();
  res.status(200).json(employees);
});

const updateEmployee = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;
  const updatedData = req.body;

  const updatedEmployee = await EmployeReg.findOneAndUpdate(
    { employeeId },
    updatedData,
    { new: true } // Return the updated document
  );

  if (!updatedEmployee) {
    return res.status(404).json({ error: "Employee not found" });
  }

  res.status(200).json({
    message: "Employee details updated successfully",
    updatedEmployee,
  });
});

const deleteEmployee = asyncHandler(async (req, res) => {
  const { employeeId } = req.params;

  const result = await EmployeReg.deleteOne({ employeeId });

  if (result.deletedCount === 0) {
    return res.status(404).json({ error: "Employee not found" });
  }

  res.status(200).json({ message: "Employee deleted successfully" });
});
const getTotalMemberAccordingToGroup = asyncHandler(async (req, res) => {
  try {
    const data = await EmployeReg.aggregate([
      {
        $match: {
          grade: { $in: ["A", "B", "C"] },
          group: {
            $in: [
              "Karnataka Team",
              "Andhra Pradesh Team",
              "Tamil Nadu Team",
              "Kerla Team",
              "Pondicherry Team",
            ],
          },
        },
      },
      {
        $group: {
          _id: { group: "$group", grade: "$grade" },
          totalMembers: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          group: "$_id.group",
          grade: "$_id.grade",
          totalMembers: 1,
        },
      },
    ]);
    res.status(201).json(data);
  } catch (error) {
    console.error("Error to finding all data ", error);
    res.status(500).json({ error: "Not fetching the all data " });
  }
});

const getEmployeeById = async (req, res) => {
  const { id } = req.params;
  

  // Validate ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid employee ID" });
  }

  try {
    const employee = await EmployeReg.findById(id);

    if (employee) {
      res.status(200).json(employee);
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    console.error("Error fetching employee by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const accessBlock = async (req, res) => {
  const { id } = req.params;
  const employee = await EmployeReg.findById(id);
  employee.access = false;
  await employee.save();
  res.status(200).json({ message: "Access Blocked Successfully" });
};

const accessUnblock = async (req, res) => {
  const { id } = req.params;
  const employee = await EmployeReg.findById(id);
  employee.access = true;
  await employee.save();
  res.status(200).json({ message: "Access Unblocked Successfully" });
};

const BolockAllEmployee = async (req, res) => {
  const employees = await EmployeReg.find();
  employees.forEach(async (employee) => {
    employee.access = false;
    await employee.save();
  });
  res.status(200).json({ message: "All Access Blocked Successfully" });
};
const Unblocked = async (req, res) => {
  try {
    const employees = await EmployeReg.find();
    for (const employee of employees) {
      employee.access = true;
      await employee.save();
    }
    res.status(200).json({ message: "All Access Unblocked Successfully" });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};

module.exports = {
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
};
