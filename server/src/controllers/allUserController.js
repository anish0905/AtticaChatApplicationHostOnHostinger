const User = require("../model/allUser");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Registration logic
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Save the user to the database
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// export const deleteAllUsers = async (req, res) => {
//   try {
//     await User.deleteMany({});
//     res.status(200).json({ message: "All users deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

exports.getUsersCountByRole = async (req, res) => {
  try {
    // Aggregate users by role and count the number of users in each role
    const userCounts = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0, // Exclude the default _id field
          role: "$_id", // Rename _id to role
          count: 1, // Include the count field
        },
      },
      {
        $sort: { count: -1 }, // Optional: Sort by count in descending order
      },
    ]);

    res.status(200).json(userCounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get the count of users by role
exports.getUsersCountByRole = async (req, res) => {
  try {
    // Aggregate users by role and count the number of users in each role
    const userCounts = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0, // Exclude the default _id field
          role: "$_id", // Rename _id to role
          count: 1, // Include the count field
        },
      },
      {
        $sort: { count: -1 }, // Optional: Sort by count in descending order
      },
    ]);

    res.status(200).json(userCounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//login

exports.loginDigitalMarketing = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email and role
    const user = await User.findOne({ email, role: "Digital Marketing" });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    if (!user.access) {
      return res
        .status(401)
        .json({ error: "Digital Marketing not authorized" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      "your_jwt_secret", // Replace with a secure key
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      message: "Digital Marketing logged in successfully",
      _id: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginCashier = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email and role
    const user = await User.findOne({ email, role: "Cashier" });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    if (!user.access) {
      return res
        .status(401)
        .json({ error: "Cashier not authorized" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      "your_jwt_secret", // Replace with a secure key
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      message: "Cashier logged in successfully",
      _id: user._id,
      user: user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.loginAccountant = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email and role
    const user = await User.findOne({ email, role: "Accountant" });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    if (!user.access) {
      return res.status(401).json({ error: "Accountant not authorized" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      "your_jwt_secret", // Replace with a secure key
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      message: "Accountant logged in successfully",
      _id: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginSoftware = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: "Software" });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    if (!user.access) {
      return res.status(401).json({ error: "Software not authorized" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      "your_jwt_secret",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      message: "Software logged in successfully",
      _id: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginHR = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: "HR" });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    if (!user.access) {
      return res.status(401).json({ error: "HR not authorized" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      "your_jwt_secret",
      { expiresIn: "1h" }
    );

    res
      .status(200)
      .json({ token, message: "HR logged in successfully", _id: user._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginCallCenter = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: "CallCenter" });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.access) {
      return res.status(401).json({ error: "CallCenter not authorized" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      "your_jwt_secret",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      message: "CallCenter logged in successfully",
      _id: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginVirtualTeam = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: "VirtualTeam" });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    if (!user.access) {
      return res.status(401).json({ error: "VirtualTeam not authorized" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      "your_jwt_secret",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      message: "VirtualTeam logged in successfully",
      _id: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginMonitoringTeam = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: "MonitoringTeam" });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.access) {
      return res.status(401).json({ error: "MonitoringTeam not authorized" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      "your_jwt_secret",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      message: "MonitoringTeam logged in successfully",
      _id: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginBouncers = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: "Bouncers/Driver" });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    if (!user.access) {
      return res.status(401).json({ error: "Bouncers not authorized" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      "your_jwt_secret",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      message: "MonitoringTeam logged in successfully",
      _id: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginSecurity = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: "Security/CCTV" });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    if (!user.access) {
      return res.status(401).json({ error: "Security not authorized" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      "your_jwt_secret",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token,
      message: "Security/CCTV logged in successfully",
      _id: user._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginTE = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user in the database with the provided email and role "TE"
    const user = await User.findOne({ email, role: "TE" });

    // If user not found, return 400 Bad Request with error message
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if the user's access is true. If not, return 401 Unauthorized
    if (!user.access) {
      return res.status(401).json({ error: "TE not authorized" });
    }

    // Compare the provided password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);

    // If passwords do not match, return 400 Bad Request with error message
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // If email and password are correct, generate a JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      "ACCESS_TOKEN_SECRET",
      { expiresIn: "1h" }
    );

    // Return 200 OK with token and success message
    res.status(200).json({
      token,
      message: "TE logged in successfully",
      _id: user._id,
      success: true,
      role: user.role,
    });
  } catch (error) {
    // If any error occurs during the process, return 500 Internal Server Error with error message
    res.status(500).json({ message: error.message });
  }
};

exports.loginLogistic = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user in the database with the provided email and role "TE"
    const user = await User.findOne({ email, role: "Logistic" });

    // If user not found, return 400 Bad Request with error message
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if the user's access is true. If not, return 401 Unauthorized
    if (!user.access) {
      return res.status(401).json({ error: "Logistic not authorized" });
    }

    // Compare the provided password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);

    // If passwords do not match, return 400 Bad Request with error message
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // If email and password are correct, generate a JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      "ACCESS_TOKEN_SECRET",
      { expiresIn: "1h" }
    );

    // Return 200 OK with token and success message
    res.status(200).json({
      token,
      message: "Logistic logged in successfully",
      _id: user._id,
      success: true,
      role: user.role,
    });
  } catch (error) {
    // If any error occurs during the process, return 500 Internal Server Error with error message
    res.status(500).json({ message: error.message });
  }
};

exports.getAllDigitalTeams = async function (req, res) {
  try {
    const users = await User.find({ role: "Digital Marketing" }).select(
      "-password"
    );
    res.json(users);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getAllCashier = async function (req, res) {
  try {
    const users = await User.find({ role: "Cashier" }).select(
      "-password"
    );
    res.json(users);
  } catch (err) {
    res.status(500).send(err);
  }
};
exports.getAllAccountant = async function (req, res) {
  try {
    const users = await User.find({ role: "Accountant" }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getAllSoftware = async function (req, res) {
  try {
    const users = await User.find({ role: "Software" }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getAllCallCenter = async function (req, res) {
  try {
    const users = await User.find({ role: "CallCenter" }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getAllVirtualTeam = async function (req, res) {
  try {
    const users = await User.find({ role: "VirtualTeam" }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getAllMonitoringTeam = async function (req, res) {
  try {
    const users = await User.find({ role: "MonitoringTeam" }).select(
      "-password"
    );
    res.json(users);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getAllBouncers = async function (req, res) {
  try {
    const users = await User.find({ role: "Bouncers/Driver" }).select(
      "-password"
    );
    res.json(users);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getAllSecurity = async function (req, res) {
  try {
    const users = await User.find({ role: "Security/CCTV" }).select(
      "-password"
    );
    res.json(users);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getAllHR = async function (req, res) {
  try {
    const users = await User.find({ role: "HR" }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).send(err);
  }
};
exports.getAllTE = async function (req, res) {
  try {
    const users = await User.find({ role: "TE" }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getAllLogistic = async function (req, res) {
  try {
    const users = await User.find({ role: "Logistic" }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.deleteById = async function (req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(500).send(err);
  }
};
exports.getById = async function (req, res) {
  try {
    const user = await User.findById(req.params.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.updateById = async function (req, res) {
  const { email, password, name } = req.body;
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Invalid user ID", success: false });
  }

  try {
    const updateData = { email, name };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const updatedUserDetails = await User.findByIdAndUpdate(
      { _id: id },
      updateData,
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    ).select("-password");

    if (!updatedUserDetails) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    res.status(200).json({
      message: "User updated successfully",
      success: true,
      data: updatedUserDetails,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

//////////////////////////??///////////////////////////////////
exports.accessBlock = async (req, res) => {
  try {
    const users = await User.find();

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Update the access field for each user
    for (let user of users) {
      user.access = false;
      await user.save();
    }

    res.status(200).json({ message: "Access Blocked Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.accessUnblock = async (req, res) => {
  try {
    const users = await User.find();

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    // Update the access field for each user
    for (let user of users) {
      user.access = true;
      await user.save();
    }

    res.status(200).json({ message: "Access Unblocked Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.blockAllUser = async (req, res) => {
  const manager = await User.find();
  manager.forEach(async (m) => {
    m.access = false;
    await m.save();
  });
  res.status(200).json({ message: "All Managers Access Blocked Successfully" });
};

exports.unblockAllUser = async (req, res) => {
  const manager = await User.find();
  manager.forEach(async (m) => {
    m.access = true;
    await m.save();
  });
  res
    .status(200)
    .json({ message: "All Managers Access Unblocked Successfully" });
};

// delete Bouncers/Driver

exports.deleteBouncersDriver = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check the role of the user
    if (user.role === "Bouncers/Driver") {
      // Delete the user
      await User.findByIdAndDelete(userId);
      return res.status(200).json({ message: "User deleted successfully" });
    } else {
      return res
        .status(403)
        .json({ message: "Forbidden: User does not have the required role" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

exports.deleteAccountant = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    if (user.role === "Accountant") {
      await User.findByIdAndDelete(userId);
      return res.status(200).json({ message: "User deleted successfully" });
    } else {
      return res
        .status(403)
        .json({ message: "Forbidden: User does not have the required role" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

exports.deletesoftware = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role === "Software") {
      await User.findByIdAndDelete(userId);
      return res.status(200).json({ message: "User deleted successfully" });
    } else {
      return res
        .status(403)
        .json({ message: "Forbidden: User does not have the required role" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

exports.deleteHr = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role === "HR") {
      await User.findByIdAndDelete(userId);
      return res.status(200).json({ message: "User deleted successfully" });
    } else {
      return res
        .status(403)
        .json({ message: "Forbidden: User does not have the required role" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

exports.CallCenter = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role === "CallCenter") {
      await User.findByIdAndDelete(userId);
      return res.status(200).json({ message: "User deleted successfully" });
    } else {
      return res
        .status(403)
        .json({ message: "Forbidden: User does not have the required role" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

exports.deleteVirtualTeam = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role === "VirtualTeam") {
      await User.findByIdAndDelete(userId);
      return res.status(200).json({ message: "User deleted successfully" });
    } else {
      return res
        .status(403)
        .json({ message: "Forbidden: User does not have the required role" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

exports.deleteMonitoringTeam = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role === "MonitoringTeam") {
      await User.findByIdAndDelete(userId);
      return res.status(200).json({ message: "User deleted successfully" });
    } else {
      return res
        .status(403)
        .json({ message: "Forbidden: User does not have the required role" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

exports.deleteSecurityCCTV = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role === "Security/CCTV") {
      await User.findByIdAndDelete(userId);
      return res.status(200).json({ message: "User deleted successfully" });
    } else {
      return res
        .status(403)
        .json({ message: "Forbidden: User does not have the required role" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

exports.deleteDigitalMarketing = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role === "Digital Marketing") {
      await User.findByIdAndDelete(userId);
      return res.status(200).json({ message: "User deleted successfully" });
    } else {
      return res
        .status(403)
        .json({ message: "Forbidden: User does not have the required role" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

exports.deleteCashier = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role === "Cashier") {
      await User.findByIdAndDelete(userId);
      return res.status(200).json({ message: "User deleted successfully" });
    } else {
      return res
        .status(403)
        .json({ message: "Forbidden: User does not have the required role" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

exports.deleteTE = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role === "TE") {
      await User.findByIdAndDelete(userId);
      return res.status(200).json({ message: "User deleted successfully" });
    } else {
      return res
        .status(403)
        .json({ message: "Forbidden: User does not have the required role" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

exports.deleteLogistic = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role === "Logistic") {
      await User.findByIdAndDelete(userId);
      return res.status(200).json({ message: "User deleted successfully" });
    } else {
      return res
        .status(403)
        .json({ message: "Forbidden: User does not have the required role" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

//according to roles

exports.deleteUsersByRole = async (req, res) => {
  try {
    const { role } = req.body;

    // Delete all users with the specified role
    const result = await User.deleteMany({ role: role });

    if (result.deletedCount > 0) {
      return res.status(200).json({
        message: `${result.deletedCount} user(s) with role ${role} deleted successfully`,
      });
    } else {
      return res
        .status(404)
        .json({ message: `No users found with role ${role}` });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};
