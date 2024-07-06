const ChatModel = require("../model/chatModel");
const LiveChat = require("../model/liveChatModel");
const Notification = require("../model/notificationModel");
const { uploadOnCloudinary } = require("../utils/cloudinary.js");

exports.sendMessage = async (req, res) => {
  try {
    const { employeeId, message, group, grade } = req.body;

    // Find the chat room by group name and grade
    let chatRoom = await ChatModel.findOne({ group, grade });

    if (!chatRoom) {
      return res.status(400).json({
        error: `Chat room with group "${group}" and grade "${grade}" does not exist`,
      });
    }

    // Check if image, document, and video files are provided
    const hasImage = req.files && req.files.image;
    const hasDocument = req.files && req.files.document;
    const hasVideo = req.files && req.files.video;

    let imageUrl, documentUrl, videoUrl;

    if (hasImage) {
      const imageLocalPath = req.files.image[0].path;
      const imageUploadResult = await uploadOnCloudinary(imageLocalPath);
      if (!imageUploadResult || !imageUploadResult.url) {
        return res
          .status(400)
          .json({ error: "Image upload failed. Please try again." });
      }
      imageUrl = imageUploadResult.url;
    }

    if (hasDocument) {
      const documentLocalPath = req.files.document[0].path;
      const documentUploadResult = await uploadOnCloudinary(documentLocalPath);
      if (!documentUploadResult || !documentUploadResult.url) {
        return res
          .status(400)
          .json({ error: "Document upload failed. Please try again." });
      }
      documentUrl = documentUploadResult.url;
    }

    if (hasVideo) {
      const videoLocalPath = req.files.video[0].path;
      const videoUploadResult = await uploadOnCloudinary(videoLocalPath);
      if (!videoUploadResult || !videoUploadResult.url) {
        return res
          .status(400)
          .json({ error: "Video upload failed. Please try again." });
      }
      videoUrl = videoUploadResult.url;
    }

    const messageData = {
      employeeId,
      message,
      image: imageUrl,
      document: documentUrl,
      video: videoUrl,
    };
    chatRoom.messages.push(messageData);
    await chatRoom.save();

    const liveChat = new LiveChat({
      group: chatRoom.group,
      grade: chatRoom.grade,
      employeeId,
      messages: message,
      image: imageUrl,
      document: documentUrl,
      video: videoUrl,
    });
    await liveChat.save();

    const notification = new Notification({
      sender: "system", // Replace with actual sender logic
      recipient: "all", // Replace with actual recipient logic
      content: "New message posted",
    });
    await notification.save();

    // const notification = new Notification({
    //   sender,
    //   recipient,
    //   content,
    // });

    // const result = await notification.save();

    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
