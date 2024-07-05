// controllers/messageController.js
const MessageRes = require("../model/EmpAdminSenderModel.js");
const { use } = require("../routes/messageRoutes.js");
const { uploadOnCloudinary } = require("../utils/cloudinary.js");
const { ObjectId } = require("mongodb");
const fs = require("fs");
const Notification = require("../model/notificationModel.js");
const cron = require("node-cron");

const createMessage = async (req, res) => {
  const { sender, recipient, text, lat, lng, senderName } = req.body;

  try {
    let content = { text };
    let locations = {}; // Initialize locations object outside the conditional

    if (lat) { // Check if lat is provided
      locations = {
        longitude: parseFloat(lng),
        latitude: parseFloat(lat),
      };
    }

    const fileTypes = ['image', 'document', 'video'];
    for (const fileType of fileTypes) {
      if (req.files && req.files[fileType]) {
        const localPath = req.files[fileType][0].path;
        if (!fs.existsSync(localPath)) {
          console.error(`${fileType} file does not exist at path: ${localPath}`);
          return res.status(400).json({ error: `${fileType} file not found at path: ${localPath}` });
        }
        const uploadResult = await uploadOnCloudinary(localPath);
        if (!uploadResult || !uploadResult.url) {
          console.error(`${fileType} upload failed:`, uploadResult?.error || "Unknown error");
          return res.status(400).json({ error: `${fileType} upload failed. Please try again.` });
        }
        content[fileType] = uploadResult.url;
      }
    }

   if(lat){
    const message = new MessageRes({
      sender,
      senderName,
      recipient,
      content,
      locations, 
    });
   }
   const message = new MessageRes({
    sender,
    senderName,
    recipient,
    content,
   
  });

    await message.save();

    const notification = new Notification({
      sender,
      recipient,
      senderName,
      content,
    });

    await notification.save();
    
    res.status(201).json({ message: "Message sent", data: message });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const getMessagesEmp = async (req, res) => {
  const { userId1, userId2 } = req.params;

  if (!ObjectId.isValid(userId1) || !ObjectId.isValid(userId2)) {
    return res.status(400).json({ message: "Invalid user IDs" });
  }

  try {
    const twoHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000); // 2 hours in milliseconds

    const messages = await MessageRes.find({
      $or: [
        {
          sender: userId1,
          recipient: userId2,
          createdAt: { $gte: twoHoursAgo },
        },
        {
          sender: userId2,
          recipient: userId1,
          createdAt: { $gte: twoHoursAgo },
        },
      ],
    }).sort({ createdAt: 1 });
    

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const getAdminMessages = async (req, res) => {
  const { userId1, userId2 } = req.params;

  if (!ObjectId.isValid(userId1) || !ObjectId.isValid(userId2)) {
    return res.status(400).json({ message: "Invalid user ids" });
  }

  try {
    const messages = await MessageRes.find({
      $or: [
        { sender: userId1, recipient: userId2 },
        { sender: userId2, recipient: userId1 },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllEmployee = async (req, res) => {
  try {
    const user = await MessageRes.find();
    if (!user) {
      res.status(400).json({ message: error.message || "user is not exists" });
    }

    res
      .status(200)
      .json(user, { message: "use fetch sucessfully", suceess: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllEmployeeById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await MessageRes.findById({ _id: id });
    if (!user) {
      res.status(400).json({ message: error.message || "user is not exists" });
    }

    res
      .status(200)
      .json(user, { message: "use fetch sucessfully", suceess: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const markMessagesRead = async (req, res) => {
  const userId = req.params.userId;
  try {
    
    const recipientObjectId = new ObjectId(userId);
  

    const result = await MessageRes.aggregate([
      {
        $match: {
          recipient: recipientObjectId,
        },
      },
      {
        $sort: {
          updatedAt: -1, // Sort by updatedAt in descending order
        },
      },
      {
        $limit: 1, // Limit the result to one document
      },
    ]);

    

    res.json(result);
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const markMessagesReadEmp = async (req, res) => {
  const userId = req.params.userId;
  try {
   
    const recipientObjectId = new ObjectId(userId);
    

    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours in milliseconds

    const result = await MessageRes.aggregate([
      {
        $match: {
          recipient: recipientObjectId,
          createdAt: { $gte: twoHoursAgo },
        },
      },
      {
        $sort: {
          updatedAt: -1, // Sort by updatedAt in descending order
        },
      },
      {
        $limit: 1, // Limit the result to one document
      },
    ]);

    

    res.json(result);
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const forwardMessage = async (req, res) => {
  try {
    const { messageId, newRecipients ,sender } = req.body;
    // console.log(newRecipients);
    const originalMessage = await MessageRes.findById(messageId);

    if (!originalMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    const forwardedMessages = await Promise.all(
      newRecipients.map(async (recipient) => {
        const forwardedMessage = new MessageRes({
          sender,
          recipient: [recipient], // Store recipients as an array
          content: originalMessage.content,
        });
        await forwardedMessage.save();
        return forwardedMessage;
      })
    );

    res.status(201).json(forwardedMessages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const replyToMessage = async (req, res) => {
  try {
    const { parentMessageId, sender, recipient, text, image, document, video } =
      req.body;

    // Find the parent message by ID
    const parentMessage = await MessageRes.findById(parentMessageId);

    // Check if the parent message exists
    if (!parentMessage) {
      return res.status(404).json({ error: "Parent message not found" });
    }

    // Create the reply message
    const replyMessage = new MessageRes({
      sender,
      recipient,
      content: {
        text,
        image,
        document,
        video,
        originalMessage:
          parentMessage.content.text ||
          parentMessage.content.originalMessage ||
          "",
      },
      parentMessage: parentMessageId, // Reference to the parent message
    });

    // Save the reply message
    await replyMessage.save();

    res.status(201).json(replyMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createMessage,
  getMessagesEmp,
  getAdminMessages,
  getAllEmployee,
  getAllEmployeeById,
  markMessagesRead,
  markMessagesReadEmp,
  forwardMessage,
  replyToMessage,
};
