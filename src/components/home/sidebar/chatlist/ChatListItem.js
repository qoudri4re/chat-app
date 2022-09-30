import React from "react";
import default_image from "./default-image.jpg";

function ChatList({
  id,
  username,
  lastMessage,
  unreadMessageCount,
  handleChatClick,
}) {
  return (
    <div className="chat-list-item" onClick={() => handleChatClick(id)}>
      <div className="left">
        <div className="image-online-status">
          <img src={default_image} alt="" />
        </div>
        <div className="chat-details">
          <h3>{username}</h3>
          <p>{lastMessage}</p>
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
