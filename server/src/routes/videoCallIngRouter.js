const express = require('express');
const router = express.Router();
const { SendVideoCallRequest, GetVideoCallRequests, AcceptVideoCall, RejectVideoCall } = require('../controllers/videoCallingController');

router.post('/video-call/request', SendVideoCallRequest);
router.get('/video-call/requests/:receiverId', GetVideoCallRequests);
router.post('/video-call/accept/:videoCallRequestId', AcceptVideoCall);
router.post('/video-call/reject/:videoCallRequestId', RejectVideoCall);

module.exports = router;
