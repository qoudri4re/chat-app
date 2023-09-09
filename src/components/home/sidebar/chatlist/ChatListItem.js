import React, { useState } from "react";
import default_image from "./default-image.jpg";
import Avatar from "@mui/material/Avatar";

function ChatList({
  id,
  username,
  lastMessage,
  unreadMessageCount,
  handleChatClick,
  profile_img,
}) {
  const [profileImgLoaded, setProfileImgLoaded] = useState(false);

  return (
    <div className="chat-list-item" onClick={() => handleChatClick(id)}>
      <div className="left">
        <div className="image-online-status">
          {profile_img !== "default-image" ? (
            <img
              src={profile_img}
              alt=""
              onLoad={() => setProfileImgLoaded(true)}
              className="hidden-image"
            />
          ) : (
            ""
          )}
          {profile_img === "default-image" ? (
            <Avatar
              src={default_image}
              sx={{
                width: 50,
                height: 50,
              }}
            />
          ) : profileImgLoaded ? (
            <Avatar alt="{username}" src={profile_img} />
          ) : (
            <Avatar
              sx={{
                width: 50,
                height: 50,
              }}
              src={default_image}
            />
          )}
        </div>
        <div className="chat-details">
          <h3>{username}</h3>
        </div>
      </div>
      {unreadMessageCount > 0 ? (
        <div className="new-message-count">
          <span>{unreadMessageCount}</span>
        </div>
      ) : (
        <div className="new-message-count hide-message-count">
          <span>{unreadMessageCount}</span>
        </div>
      )}
    </div>
  );
}

export default ChatList;
