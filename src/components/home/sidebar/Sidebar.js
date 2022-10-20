import React, { useState } from "react";
import "./sidebar.css";
import SidebarHeader from "./SidebarHeader";
import ChatList from "./chatlist/ChatList";
import Settings from "./Settings";

function Sidebar({
  handleChatClick,
  friendsDetails,
  userDetails,
  setUserDetails,
  getAllUsers,
  setSearch,
  search,
}) {
  const [displaySettings, setDisplaySettings] = useState(false);

  function showOrCloseSettings() {
    setDisplaySettings((prevVal) => !prevVal);
  }

  if (displaySettings) {
    return (
      <div className="sidebar">
        <Settings
          showOrCloseSettings={showOrCloseSettings}
          userDetails={userDetails}
          setUserDetails={setUserDetails}
        />
      </div>
    );
  } else {
    return (
      <div className="sidebar">
        <SidebarHeader
          getAllUsers={getAllUsers}
          setSearch={setSearch}
          search={search}
          showOrCloseSettings={showOrCloseSettings}
        />
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
}

export default Sidebar;
