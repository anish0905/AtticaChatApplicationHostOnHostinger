const mongoose = require("mongoose");

const empAdminSenderSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderName: {
      type: String,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      text: {
        type: String,
        required: false,
      },
      originalMessage: {
        type: String,
        required: false,
      },
      replyMsg: {
        type: String,
        required: false,
      },
      image: {
        type: String,
        required: false,
      },
      document: {
        type: String,
        required: false,
      },
      video: {
        type: String,
        required: false,
      },
    },
    locations: [
      {
        longitude: {
          type: Number,
        },
        latitude: {
          type: Number,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmpAdminSender", empAdminSenderSchema);
