const Announce = require("../model/AnnounceModel");
const mongoose = require("mongoose");

const createMessage = async (req, res) => {
  const { sender, text, senderName } = req.body;

  if (!sender) {
    return res.status(400).json({ message: "Sender is required." });
  }

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
          content.image = imageUploadResult.url;
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
        const documentUploadResult = await uploadOnCloudinary(
          documentLocalPath
        );
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

    // Create a new message without a specific recipient
    const message = new Announce({
      sender,
      senderName,
      content,
    });

    await message.save();

    // Notify all users (implement your notification logic here)
    // For example, send a notification to all connected users using WebSockets

    res.status(201).json({ message: "Message sent", data: message });
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(400).json({ message: error.message });
  }
};

//   const getAnnouncementById = async (req, res) => {
//     const { id } = req.params; // Assuming the ID is passed as a route parameter
//     console.log("Received sender ID:", id);

//     try {
//         // Fetch announcements by sender ID
//         const announcements = await Announce.find({ sender: id });

//         if (announcements.length === 0) {
//             return res.status(404).json({ message: "Announcement not found" });
//         }

//         res.status(200).json(announcements);
//     } catch (error) {
//         console.error("Error fetching the Announcement:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// };

const getAnnouncementById = async (req, res) => {
  const { id } = req.params;

  try {
    const messages = await Announce.find({ sender: id }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllAnnouncements = async (req, res) => {
  try {
    // Fetch all announcements
    const allAnnouncements = await Announce.find();

    if (allAnnouncements.length === 0) {
      return res.status(404).json({ message: "No Announcements found" });
    }

    res.status(200).json(allAnnouncements);
  } catch (error) {
    console.error("Error fetching the Announcements:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const delAllAnouncementsbySender = async (req, res) => {
  try {
    const { id } = req.params;

    await Announce.deleteMany({ sender: id });

    res.status(200).json({ message: "Announcements deleted successfully" });
  } catch (error) {}
};

const deletebyId = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAnnouncement = await Announce.findByIdAndDelete(id);
    res.status(200).json({
      message: "Announcement deleted successfully",
      deletedAnnouncement,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    // Check if the announcement exists
    const announcement = await Announce.findById(id);

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    // Update the announcement
    announcement.content.text = text; // Assuming 'text' is the field you want to update
    const updatedAnnouncement = await announcement.save();

    res.status(200).json({
      message: "Announcement updated successfully",
      updatedAnnouncement,
    });
  } catch (error) {
    console.error("Error updating the Announcement:", error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  updateAnnouncement,
};



module.exports = {
  getAnnouncementById,
  createMessage,
  getAllAnnouncements,
  delAllAnouncementsbySender,
  deletebyId,
  updateAnnouncement,
};
