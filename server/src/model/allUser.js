const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    access: {
      type: Boolean,
      default: true,
    },
    group: [
      {
        name: { 
          type: String,
        },
        grade: {
          type: String,
        },
      }
    ],
    grade:{
      type:String

    },

    role: {
      type: String,
      enum: [
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
        "Cashier"
      ],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("allUser", userSchema);
