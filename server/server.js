const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const connectDb = require("./src/config/dbConnection");
const dotenv = require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer"); // Import multer for handling file uploads
const { uploadOnCloudinary } = require("../server/src/utils/cloudinary.js");
const liveChat = require("./src/model/liveChatModel.js");
const messageRouter = require("./src/routes/messageRoutes.js");
const empAdminsenderRoutes = require("./src/routes/empadminsenderRouter.js");
const adminRoutes = require("./src/routes/adminRegRoutes.js");
const superAdminRoutes = require("./src/routes/superAdminRoutes.js");
const billingTeamRoutes = require("./src/routes/billingTeamUserRoutes.js");
const branchRoutes = require("./src/routes/branchRoutes.js");
const managerRoute = require("./src/routes/managerRoutes.js");
const locationRoutes = require("./src/routes/locationRoute.js");
const employeeRoute = require("./src/routes/employeeRegRoutes.js");
const notificationRouter = require("./src/routes/notificationRoutes.js");
const allUserRoutes = require("./src/routes/allUserRoutes.js");
const chatRoutes = require("./src/routes/chatRoutes.js");
connectDb(); // Call the function to connect to the database

const app = express();

app.use(cors()); // Allow Cross-Origin Resource Sharing (CORS)

const port = process.env.PORT || 5002;

app.use(express.json()); // Parse JSON bodies of incoming requests

// API endpoint to fetch distinct group names and grades
app.get("/api/groups", async (req, res) => {
  try {
    const groups = await ChatModel.aggregate([
      {
        $group: {
          _id: { group: "$group", grade: "$grade" },
          group: { $first: "$group" },
          grade: { $first: "$grade" },
          documentId: { $first: "$_id" },
        },
      },
      {
        $project: {
          _id: "$documentId",
          group: 1,
          grade: 1,
        },
      },
    ]);
    res.json(groups); // Send the distinct group names and grades as JSON response
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ error: "Internal server error" }); // Send 500 status code in case of error
  }
});
app.get("/api/employeeDetails/:employeeId", async (req, res) => {
  const { employeeId } = req.params;
  try {
    const employee = await EmployeeRegistration.findOne({ employeeId });
    if (employee) {
      res.json(employee);
    } else {
      res.status(404).json({ error: "Employee details not found" });
    }
  } catch (error) {
    console.error("Error fetching employee details:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to fetch messages based on group and grade
app.get("/api/Emessages", async (req, res) => {
  let { teamName, grade } = req.query;
  //   console.log("Received query:", teamName, grade);
  try {
    teamName = teamName.trim().toLowerCase();
    grade = grade.trim().toLowerCase();
    // console.log("Formatted query:", teamName, grade);

    const result = await ChatModel.findOne({
      group: { $regex: new RegExp("^" + teamName + "$", "i") },
      grade: { $regex: new RegExp("^" + grade + "$", "i") },
    });

    // console.log("Query result:", result);
    res.json(result ? result.messages : []);
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("/api/messages/last-24-hours", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pipeline = [
      {
        $match: {
          createdAt: {
            $gte: today,
            $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          },
        },
      },
    ];

    const messages = await liveChat.aggregate(pipeline);
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error retrieving messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/groups/mark-messages-read/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await ChatModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id), // Match by group _id
        },
      },
      {
        $unwind: "$messages", // Unwind the messages array
      },
      {
        $sort: {
          "messages._id": -1, // Sort messages by their _id in descending order
        },
      },
      {
        $limit: 1, // Limit the result to one message
      },
      {
        $project: {
          _id: 0,
          lastMessage: "$messages", // Project the last message
        },
      },
    ]);

    if (result.length === 0) {
      res.status(404).json({ message: "No messages found for this group." });
    } else {
      res.json(result[0].lastMessage);
    }
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//group Chat Message
app.use("/api/chat", chatRoutes);

// Mounting routes for admin and employee registration
app.use("/api/employeeRegistration", require("./src/routes/employeeRegRoutes"));

// one tp one chat
app.use("/api", messageRouter);
app.use("/api", notificationRouter);

//empadmin sender routes

app.use("/api/empadminsender", empAdminsenderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/superAdmin", superAdminRoutes);
app.use("/api/serverControl", require("./src/routes/serverControlRoutes.js"));
app.use("/api/billingTeam", billingTeamRoutes);
app.use("/api/branch", branchRoutes);
app.use("/api/manager", managerRoute);
app.use("/api/location", locationRoutes);
app.use("/api/employee", employeeRoute);
app.use("/api/allUser", allUserRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port no ${port}`);
});
