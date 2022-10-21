import React, { useState } from "react";
import default_image from "./default-image.jpg";

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
          <img
            src={
              profile_img === "default-image"
                ? default_image
                : profileImgLoaded
                ? profile_img
                : default_image
            }
            alt=""
          />
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
