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

// Login logic
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
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

    res.status(200).json({ token, message: "Logged in successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
