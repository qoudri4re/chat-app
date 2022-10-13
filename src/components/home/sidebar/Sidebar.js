import React from "react";
import "./sidebar.css";
import SidebarHeader from "./SidebarHeader";
import ChatList from "./chatlist/ChatList";

function Sidebar({
  handleChatClick,
  friendsDetails,
  userDetails,
  setUserDetails,
  getAllUsers,
  setSearch,
  search,
}) {
  return (
    <div className="sidebar">
      <SidebarHeader getAllUsers={getAllUsers} setSearch={setSearch} />
      <ChatList
        handleChatClick={handleChatClick}
        friendsDetails={friendsDetails}
        userDetails={userDetails}
        setUserDetails={setUserDetails}
        search={search}
      />
    </div>
  );
}

export default Sidebar;
