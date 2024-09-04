const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const connectDb = require("./src/config/dbConnection");
const dotenv = require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
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
const announceRoutes = require("./src/routes/announceRoutes.js");
const announcementDepartmentWiseRoutes = require("./src/routes/announcementDepartmentWise.js");
const allUserRoutes = require("./src/routes/allUserRoutes.js");
const videoCallRoute = require("./src/routes/videoCallIngRouter.js");

connectDb(); // Call the function to connect to the database

const app = express();

app.use(bodyParser.json());

app.use(cors()); // Allow Cross-Origin Resource Sharing (CORS)

const port = process.env.PORT || 5002; // Change this to a different port if needed

app.use(express.json()); // Parse JSON bodies of incoming requests

// Define Mongoose Schema for the chat
const chatSchema = new mongoose.Schema({
  group: String, // Group name
  grade: String,
  department: {
    type: String,
    enum: [
      "Admin",
      "Employee",
      "Manager",
      "Billing_Team",
      "Accountant",
      "Software",
      "HR",
      "CallCenter",
      "VirtualTeam",
      "MonitoringTeam",
      "Bouncers/Driver",
      "Security/CCTV",
      "Digital Marketing",
      "TE",
      "Logistic",
      "Cashier",
    ],
  },
  messages: [
    {
      employeeId: String,
      message: String,
      Image: String,
      Document: String,
      video: String,
    },
  ],
});

// Create Mongoose Model based on the schema
const ChatModel = mongoose.model("Chat", chatSchema);

// Set up multer storage configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Set up multer upload configuration
const upload = multer({ storage: storage });

app.post(
  "/api/messages",
  upload.fields([{ name: "image" }, { name: "document" }, { name: "video" }]),
  async (req, res) => {
    try {
      const { employeeId, message, group, grade, department } = req.body;

      // Find the chat room by group name and grade
      let chatRoom = await ChatModel.findOne({ group, grade, department });

      if (!chatRoom) {
        return res.status(400).json({
          error: `Chat room with group "${group}" and grade "${grade}"  and department  "${department}" does not exist   `,
        });
      }

      // Check if image, document, and video files are provided
      const hasImage = req.files && req.files.image;
      const hasDocument = req.files && req.files.document;
      const hasVideo = req.files && req.files.video;

      let imageUploadResult;
      if (hasImage) {
        const imageLocalPath = req.files.image[0].path;
        imageUploadResult = await uploadOnCloudinary(imageLocalPath);
        if (!imageUploadResult || !imageUploadResult.url) {
          console.error(
            "Image upload failed:",
            imageUploadResult?.error || "Unknown error"
          );
          return res
            .status(400)
            .json({ error: "Image upload failed. Please try again." });
        }
      }

      let documentUploadResult;
      if (hasDocument) {
        const documentLocalPath = req.files.document[0].path;
        documentUploadResult = await uploadOnCloudinary(documentLocalPath);
        if (!documentUploadResult || !documentUploadResult.url) {
          console.error(
            "Document upload failed:",
            documentUploadResult?.error || "Unknown error"
          );
          return res
            .status(400)
            .json({ error: "Document upload failed. Please try again." });
        }
      }

      let videoUploadResult;
      if (hasVideo) {
        const videoLocalPath = req.files.video[0].path;
        videoUploadResult = await uploadOnCloudinary(videoLocalPath);
        if (!videoUploadResult || !videoUploadResult.url) {
          console.error(
            "Video upload failed:",
            videoUploadResult?.error || "Unknown error"
          );
          return res
            .status(400)
            .json({ error: "Video upload failed. Please try again." });
        }
      }

      // Add the new message to the chat room
      const messageData = { employeeId, message };
      if (hasImage) {
        messageData.Image = imageUploadResult.url;
      }
      const imageUrl = messageData.Image;
      if (hasDocument) {
        messageData.Document = documentUploadResult.url;
      }
      const documentUrl = messageData.Document;
      if (hasVideo) {
        messageData.video = videoUploadResult.url;
      }
      const videoUrl = messageData.video;
      chatRoom.messages.push(messageData);

      const liveChats = new liveChat({
        group: chatRoom.group,
        grade: chatRoom.grade,
        employeeId: employeeId,
        messages: message,
        image: imageUrl,
        video: videoUrl,
        document: documentUrl,
      });
      await liveChats.save();

      // Save the updated chat room
      await chatRoom.save();

      res.status(201).json({ message: "Message sent successfully" });
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// API endpoint to fetch chat messages for a specific group
app.get("/api/messages", async (req, res) => {
  try {
    const { group, grade } = req.query;

    // Fetch messages only for the specified group and grade
    const messages = await ChatModel.findOne({ group, grade });

    if (!messages) {
      return res
        .status(404)
        .json({ error: "Messages not found for the specified group" });
    }

    res.json(messages); // Send the messages as JSON response
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route for creating a new chat room
app.post("/api/groups", async (req, res) => {
  try {
    const { group, grade, department } = req.body;

    // Check if a chat room with the given group name and grade already exists
    let chatRoom = await ChatModel.findOne({ group, grade, department });
    if (chatRoom) {
      return res.status(400).json({
        error: `Chat room with group "${group}" and grade "${grade}"  and department "${department}" already exists`,
      });
    }

    // Create a new chat room
    chatRoom = new ChatModel({
      group,
      grade,
      department,
      messages: [],
    });

    // Save the new chat room to the database
    await chatRoom.save();

    res.status(201).json({ message: "Chat room created successfully" });
  } catch (error) {
    console.error("Error creating chat room:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to delete a chat room
app.delete("/api/groups/:group/:grade", async (req, res) => {
  try {
    const { group, grade } = req.params;

    // Delete the chat room from the database
    const result = await ChatModel.findOneAndDelete({
      group,
      grade,
    });

    if (!result) {
      return res
        .status(404)
        .json({ error: "Chat room not found with the specified group" });
    }

    res.json({ message: "Chat room deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat room:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/groups", async (req, res) => {
  try {
    const groups = await ChatModel.aggregate([
      {
        $group: {
          _id: { group: "$group", grade: "$grade" },
          group: { $first: "$group" },
          grade: { $first: "$grade" },
          documentId: { $first: "$_id" },
          department: { $first: "$department" },
        },
      },
      {
        $project: {
          _id: "$documentId",
          group: 1,
          grade: 1,
          department: 1,
        },
      },
    ]);
    res.json(groups); // Send the distinct group names and grades as JSON response
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ error: "Internal server error" }); // Send 500 status code in case of error
  }
});

/// Mounting routes for admin and employee registration
app.use("/api/employeeRegistration", require("./src/routes/employeeRegRoutes"));

// one tp one chat
app.use("/api", messageRouter);

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
app.use("/api/announce", announceRoutes);
app.use("/api/announcements", announcementDepartmentWiseRoutes);
app.use("/api/videoCall", videoCallRoute);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Adjust the origin to your frontend URL in production
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle joining a room by user ID (can be email or a unique identifier)
  socket.on("join-room", (userId) => {
    socket.join(userId);
    console.log(`${socket.id} joined room: ${userId}`);
  });

  // Handle initiating a call from AdminId to User1
  socket.on("call-user", ({ to, offer }) => {
    console.log(`Calling user: ${to} from ${socket.id}`);
    io.to(to).emit("incoming-call", { from: socket.id, offer });
  });

  // Handle answering the call by User1
  socket.on("answer-call", ({ to, answer }) => {
    console.log(`Answering call from ${to}`);
    io.to(to).emit("call-answered", { answer });
  });

  // Handle rejecting the call
  socket.on("reject-call", ({ to }) => {
    console.log(`Call rejected by ${socket.id}`);
    io.to(to).emit("call-rejected");
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start the server
server.listen(port, () => {
  console.log("Signaling server running on port 5000");
});

// const server = app.listen(port, () =>
//   console.log(`Server running on port ${port}`)
// );
