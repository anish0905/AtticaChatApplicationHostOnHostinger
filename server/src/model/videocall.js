const mongoose = require('mongoose');

const videoCallSchema = new mongoose.Schema({
    senderId: {
        type: String,
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    roomId: {
        type: String,
        required: true
    },
    senderName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'ended'],
        default: 'pending'
    },
    link: {
        type: String,
        required: false // Link is optional, depending on your logic
    }
}, { timestamps: true });

module.exports = mongoose.model('VideoCall', videoCallSchema);
