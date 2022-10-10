import React from "react";
import "./sidebar.css";
import SidebarHeader from "./SidebarHeader";
import ChatList from "./chatlist/ChatList";

function Sidebar({
  handleChatClick,
  friendsDetails,
  userDetails,
  setUserDetails,
}) {
  return (
    <div className="sidebar">
      <SidebarHeader />
      <ChatList
        handleChatClick={handleChatClick}
        friendsDetails={friendsDetails}
        userDetails={userDetails}
        setUserDetails={setUserDetails}
      />
    </div>
  );
}

export default Sidebar;
