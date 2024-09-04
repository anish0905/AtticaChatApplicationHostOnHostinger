import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const UserReceiveCallComponent = () => {
  const [callIncoming, setCallIncoming] = useState(false);
  const [peerConnection, setPeerConnection] = useState(null);
  const [fromUser, setFromUser] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("User1");
    const pc = new RTCPeerConnection();
    setPeerConnection(pc);

    socket.emit("join-room", userId);

    socket.on("incoming-call", ({ from, offer }) => {
      setCallIncoming(true);
      setFromUser(from);
      pc.setRemoteDescription(new RTCSessionDescription(offer));
    });

    return () => {
      socket.off("incoming-call");
    };
  }, []);

  const acceptCall = async () => {
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    socket.emit("answer-call", { to: fromUser, answer });
    setCallIncoming(false);
  };

  const rejectCall = () => {
    socket.emit("reject-call", { to: fromUser });
    setCallIncoming(false);
  };

  return (
    <div>
      {callIncoming && (
        <div>
          <h3>Incoming Call...</h3>
          <button onClick={acceptCall}>Accept</button>
          <button onClick={rejectCall}>Decline</button>
        </div>
      )}
    </div>
  );
};

export default UserReceiveCallComponent;
