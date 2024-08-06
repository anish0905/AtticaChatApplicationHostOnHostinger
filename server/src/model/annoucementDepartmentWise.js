const mongoose = require('mongoose');

const announceDepartmentWiseSchema = new mongoose.Schema({
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
            "Cashier"
          ],
    },

    userId:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    text:{
        type: String,
        required: true
    }
},{timeseries: true})

module.exports = mongoose.model('AnnounceDepartmentWise', announceDepartmentWiseSchema);


