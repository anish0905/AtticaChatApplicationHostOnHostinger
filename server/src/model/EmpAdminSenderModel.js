const mongoose = require("mongoose");

const empAdminSender = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderName:{
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
        type: "string",

        required: false,
      },
      replyMsg: {
        type: "string",

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
    locations: [{
      longitude: { type: Number, required: true },
      latitude: { type: Number, required: true },
    
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmpAdminSender", empAdminSender);
