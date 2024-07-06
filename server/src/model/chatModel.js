const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
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
    originalMessage: {
      type: String,
      required: false,
    },
    replyMsg: {
      type: String,
      required: false,
    },
  },
  { _id: false }
);

const chatSchema = new mongoose.Schema(
  {
    group: {
      type: String,
      required: true,
    },
    grade: {
      type: String,
      required: true,
    },
    messages: [messageSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
