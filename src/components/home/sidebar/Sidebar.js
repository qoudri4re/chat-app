import React from "react";
import "./sidebar.css";
import SidebarHeader from "./SidebarHeader";
import ChatList from "./chatlist/ChatList";

function Sidebar({ handleChatClick, friendsDetails }) {
  return (
    <div className="sidebar">
      <SidebarHeader />
      <ChatList
        handleChatClick={handleChatClick}
        friendsDetails={friendsDetails}
      />
    </div>
  );
}

export default Sidebar;
