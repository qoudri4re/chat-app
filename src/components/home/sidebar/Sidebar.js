import React, { useState } from "react";
import "./sidebar.css";
import SidebarHeader from "./SidebarHeader";
import ChatList from "./chatlist/ChatList";
import Settings from "./Settings";
import CreateGroup from "./CreateGroup";
import Groups from "./Groups";

function Sidebar({
  handleChatClick,
  friendsDetails,
  userDetails,
  setUserDetails,
  getAllUsers,
  setSearch,
  search,
  unreadMessagesCount,
  searchResults,
}) {
  const [displaySettings, setDisplaySettings] = useState(false);
  const [displayCreateGroup, setDisplayCreateGroup] = useState(false);
  const [displayChatListOrStatusOrGroup, setDisplayChatListOrStatusOrGroup] =
    useState({ currentDisplay: "chat list" });

  function switchBetweenStatusChatListGroup(view) {
    if (view !== displayChatListOrStatusOrGroup.currentDisplay) {
      setDisplayChatListOrStatusOrGroup({ currentDisplay: view });
    }
  }
  function showOrCloseSettings() {
    setDisplaySettings((prevVal) => !prevVal);
  }
  function showOrCloseCreateGroup() {
    setDisplayCreateGroup((prevVal) => !prevVal);
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
  } else if (displayCreateGroup) {
    return (
      <div className="sidebar sidebar__create__group">
        <CreateGroup
          showOrCloseCreateGroup={showOrCloseCreateGroup}
          friendsDetails={friendsDetails}
          setSearch={setSearch}
          search={search}
          getAllUsers={getAllUsers}
          searchResults={searchResults}
          userDetails={userDetails}
          setUserDetails={setUserDetails}
          switchBetweenStatusChatListGroup={switchBetweenStatusChatListGroup}
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
          showOrCloseCreateGroup={showOrCloseCreateGroup}
          switchBetweenStatusChatListGroup={switchBetweenStatusChatListGroup}
        />
        {displayChatListOrStatusOrGroup.currentDisplay === "chat list" ? (
          <ChatList
            handleChatClick={handleChatClick}
            friendsDetails={friendsDetails}
            userDetails={userDetails}
            setUserDetails={setUserDetails}
            search={search}
            unreadMessagesCount={unreadMessagesCount}
          />
        ) : (
          <Groups userDetails={userDetails} setUserDetails={setUserDetails} />
        )}
      </div>
    );
  }
}

export default Sidebar;
