const Admin = require("../model/adminRegModel");
const mongoose = require("mongoose");

const AdminRegistion = async (req, res) => {
  const { name, email, password, department } = req.body;

  try {
    // Validate request body
    if (!name || !email || !password || !department) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    // Check if the admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Create new admin
    const newAdmin = new Admin({name, email, password, department });
    const savedAdmin = await newAdmin.save();

    // Respond with success
    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      admin: savedAdmin,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Controller function for admin login
const AdminLogin = async (req, res) => {
  const { email, password, department } = req.body;

  try {
    // Validate request body
    if (!email || !password || !department) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    // Check if the admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    // Ensure the admin has access and belongs to the correct department
    if (!admin.access || admin.department !== department) {
      return res.status(401).json({ error: "Admin not authorized" });
    }

    // Check if the password matches
    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Respond with success
    res.status(200).json({
      message: "Admin logged in successfully",
      data: admin,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllAdmin = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const delAdminbyId = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Admin id is required" });
    }
    await Admin.findByIdAndDelete(id);
    res.status(200).json({ message: "Admin deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate if id is provided
    if (!id) {
      return res.status(400).json({ message: "Admin id is required" });
    }

    // Validate if id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Admin id" });
    }

    // Query for admin by id
    const admin = await Admin.findById(id);

    // Check if admin is found
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Send admin data in response
    res.status(200).json(admin);
  } catch (error) {
    // Handle any errors
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const accessBlocks = async (req, res) => {
  const { id } = req.params;
  const admin = await Admin.findById(id);
  admin.access = false;
  await admin.save();
  res.status(200).json({ message: "Access Blocked successfully" });
};

const accessUnblocks = async (req, res) => {
  const { id } = req.params;
  const admin = await Admin.findById(id);
  admin.access = true;
  await admin.save();
  res.status(200).json({ message: "Access Unblocked successfully" });
};

const blockAllAdmin = async (req, res) => {
  const admins = await Admin.find();
  admins.forEach(async (admin) => {
    admin.access = false;
    await admin.save();
  });
  res.status(200).json({ message: "All Admins Access Blocked successfully" });
};

const unblockAllAdmin = async (req, res) => {
  const admins = await Admin.find();
  admins.forEach(async (admin) => {
    admin.access = true;
    await admin.save();
  });
  res.status(200).json({ message: "All Admins Access Unblocked successfully" });
};

const deleteAlladmin = async (req, res) => {
  try {
    console.log("Deleting all users...");
    // Delete all users
    const result = await Admin.deleteMany();
    console.log(result);

    if (result.deletedCount > 0) {
      return res.status(200).json({
        message: `${result.deletedCount} user(s) deleted successfully`,
      });
    } else {
      return res.status(404).json({ message: "No users found to delete" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports = {
  AdminRegistion,
  AdminLogin,
  getAllAdmin,
  delAdminbyId,
  getAdminById,

  accessBlocks,
  accessUnblocks,
  blockAllAdmin,
  unblockAllAdmin,
  deleteAlladmin,
};
