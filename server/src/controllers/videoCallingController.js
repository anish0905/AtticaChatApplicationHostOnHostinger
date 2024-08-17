const VideoCall = require("../model/videocall");

// Send a video call request
const SendVideoCallRequest = async (req, res) => {
    const { senderId, receiverId, roomId, senderName,link } = req.body;
    try {
        const videoCallRequest = new VideoCall({
            senderId,
            receiverId,
            roomId,
            senderName,
            status: 'pending',
            link: link
        });
        await videoCallRequest.save();
        res.status(200).json({ message: "Video call request sent successfully" });
    } catch (error) {
        console.error("Error sending video call request:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get video call requests for a user
const GetVideoCallRequests = async (req, res) => {
    const { receiverId } = req.params;

    try {
        if (!receiverId) {
            return res.status(400).json({ error: "Missing receiverId parameter" });
        }

        const videoCallRequests = await VideoCall
            .find({ receiverId, status: 'pending' })
            .sort({ createdAt: -1 });

        res.status(200).json({ videoCallRequests });
    } catch (error) {
        console.error("Error fetching video call requests:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Accept a video call request
const AcceptVideoCall = async (req, res) => {
    const { videoCallRequestId } = req.params;

    try {
        const videoCall = await VideoCall.findById(videoCallRequestId);
        if (!videoCall) {
            return res.status(404).json({ error: "Video call request not found" });
        }

        videoCall.status = 'accepted';
        await videoCall.save();

        // Optionally, you can notify the sender that the call has been accepted

        res.status(200).json({ message: "Video call accepted", videoCall });
    } catch (error) {
        console.error("Error accepting video call:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Reject a video call request
const RejectVideoCall = async (req, res) => {
    const { videoCallRequestId } = req.params;

    try {
        const videoCall = await VideoCall.findById(videoCallRequestId);
        if (!videoCall) {
            return res.status(404).json({ error: "Video call request not found" });
        }

        videoCall.status = 'rejected';
        await videoCall.save();

        // Optionally, you can notify the sender that the call has been rejected

        res.status(200).json({ message: "Video call rejected", videoCall });
    } catch (error) {
        console.error("Error rejecting video call:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { SendVideoCallRequest, GetVideoCallRequests, AcceptVideoCall, RejectVideoCall };
