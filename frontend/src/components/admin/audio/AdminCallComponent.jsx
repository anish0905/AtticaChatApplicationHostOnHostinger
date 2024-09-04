import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const AdminCallComponent = () => {
  const [userId, setUserId] = useState(localStorage.getItem("User1"));
  const [peerConnection, setPeerConnection] = useState(null);

  useEffect(() => {
    const pc = new RTCPeerConnection();
    setPeerConnection(pc);

    socket.on("call-answered", ({ answer }) => {
      pc.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on("call-rejected", () => {
      alert("Call rejected by the user.");
    });

    return () => {
      socket.off("call-answered");
      socket.off("call-rejected");
    };
  }, []);

  const callUser = async () => {
    if (userId) {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      socket.emit("call-user", { to: userId, offer });
    } else {
      alert("No user ID found in localStorage.");
    }
  };

  return (
    <div>
      <button onClick={callUser}>Call User</button>
    </div>
  );
};

export default AdminCallComponent;
