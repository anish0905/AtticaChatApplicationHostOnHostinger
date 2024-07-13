// controllers/messageController.js
const MessageRes = require("../model/EmpAdminSenderModel.js");
const { use } = require("../routes/messageRoutes.js");
const { uploadOnCloudinary } = require("../utils/cloudinary.js");
const { ObjectId } = require("mongodb");
const fs = require("fs");
const Notification = require("../model/notificationModel.js");
const cron = require("node-cron");
const mongoose = require('mongoose');

const createMessage = async (req, res) => {
  const { sender, recipient, text, latitude, longitude, senderName  } = req.body;
  console.log(latitude,longitude)

  try {
    let content = { text };

    const hasImage = req.files && req.files.image;
    const hasDocument = req.files && req.files.document;
    const hasVideo = req.files && req.files.video;

    if (hasImage) {
      const imageLocalPath = req.files.image[0].path;
      if (fs.existsSync(imageLocalPath)) {
        const imageUploadResult = await uploadOnCloudinary(imageLocalPath);
        if (imageUploadResult?.url) {
          // content.image = imageUploadResult.url;
          if (latitude && longitude) {
            content.imageWithLocation = JSON.stringify({
              url: imageUploadResult.url,
              latitude: parseFloat(latitude),
              longitude: parseFloat(longitude),
            });
          } else {
            content.image = imageUploadResult.url;
          }
        } else {
          return res
            .status(400)
            .json({ error: "Image upload failed. Please try again." });
        }
      } else {
        return res
          .status(400)
          .json({ error: `Image file not found at path: ${imageLocalPath}` });
      }
    }

    if (hasDocument) {
      const documentLocalPath = req.files.document[0].path;
      if (fs.existsSync(documentLocalPath)) {
        const documentUploadResult = await uploadOnCloudinary(documentLocalPath);
        if (documentUploadResult?.url) {
          content.document = documentUploadResult.url;
        } else {
          return res
            .status(400)
            .json({ error: "Document upload failed. Please try again." });
        }
      } else {
        return res.status(400).json({
          error: `Document file not found at path: ${documentLocalPath}`,
        });
      }
    }

    if (hasVideo) {
      const videoLocalPath = req.files.video[0].path;
      if (fs.existsSync(videoLocalPath)) {
        const videoUploadResult = await uploadOnCloudinary(videoLocalPath);
        if (videoUploadResult?.url) {
          content.video = videoUploadResult.url;
        } else {
          return res
            .status(400)
            .json({ error: "Video upload failed. Please try again." });
        }
      } else {
        return res
          .status(400)
          .json({ error: `Video file not found at path: ${videoLocalPath}` });
      }
    }

    

    const message = new  MessageRes({
      sender,
      senderName,
      recipient,
      content,
      
    });

    const result =await message.save();

    console.log(result)



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

const getuserAllMessagesNotification = async (req, res) => {
  const userId = req.params.userId;

  // Validate the userId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const messages = await MessageRes.find({ recipient: userId }); // Fetch messages where recipient matches userId
    res.status(200).json(messages); // Send the messages as JSON response
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal server error' }); // Send 500 status code in case of error
  }
}

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
  getuserAllMessagesNotification
};
