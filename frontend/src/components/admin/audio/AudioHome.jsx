import React from "react";
import AdminCallComponent from "../audio/AdminCallComponent";
import UserReceiveCallComponent from "../audio/UserReceiveCallComponent";

const AudioHome = () => {
  const isAdmin = localStorage.getItem("isAdmin");
  return (
    <div>
      <div>
        {isAdmin === "true" ? (
          <AdminCallComponent />
        ) : (
          <UserReceiveCallComponent />
        )}
      </div>
    </div>
  );
};

export default AudioHome;
