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
  const { id } = req.params;
  const manager = await ManagerDetails.find();
  manager.access = false;
  await manager.save();
  res.status(200).json({ message: "Access Blocked Successfully" });
};
exports.accessUnblock = async (req, res) => {
  const { id } = req.params;
  const manager = await ManagerDetails.find();
  manager.access = true;
  await manager.save();
  res.status(200).json({ message: "Access Unblocked Successfully" });
};

exports.blockAllUser = async (req, res) => {
  const manager = await ManagerDetails.find();
  manager.forEach(async (m) => {
    m.access = false;
    await m.save();
  });
  res.status(200).json({ message: "All Managers Access Blocked Successfully" });
};

exports.unblockAllUser = async (req, res) => {
  const manager = await ManagerDetails.find();
  manager.forEach(async (m) => {
    m.access = true;
    await m.save();
  });
  res
    .status(200)
    .json({ message: "All Managers Access Unblocked Successfully" });
};
