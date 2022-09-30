import React from "react";
import "./sidebar.css";
import SidebarHeader from "./SidebarHeader";
import ChatList from "./chatlist/ChatList";
function Sidebar({ handleChatClick }) {
  return (
    <div className="sidebar">
      <SidebarHeader />
      <ChatList handleChatClick={handleChatClick} />
    </div>
  );
}

export default Sidebar;
