const mongoose = require("mongoose");

const employeeRegSchema = mongoose.Schema(
  {
    // user_id:{
    //   type: mongoose.Schema.Types.ObjectId,
    //   required:true,
    //   ref:"User",
    //  },
    name: {
      type: String,
      required: [true, "Please add the user nam address"],
    },
    password: {
      type: String,
      required: [true, "Please add the user password"],
    },

    confirmPassword: {
      type: String,
      required: [true, "Please add the user confirm password"],
    },
    employeeId: {
      type: String,
      required: [true, "Please add the user employee code address"],
      // unique:true
    },
    state: {
      type: String,
     
      
    },
    language: {
      type: String,
      default: "",
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
    
    isActive: {
      type: Boolean,
      default: false,
    },
    access: {
      type: Boolean,
      default: true, 
    },
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("EmployeeRegistration", employeeRegSchema);
