import React from "react";
import emptyChat from "./images/emptyChat.png";
import "./style.css";

function EmptyChat({ whereEmpty }) {
  if (whereEmpty === "chat-area") {
    return (
      <div className="empty-container empty-chat-area">
        <div className="content">
          <img src={emptyChat} alt="" />
          <span>
            chat is empty... start by sending a message and they'll be added to
            your friends list
          </span>
        </div>
      </div>
    );
  } else {
    return (
      <div className="empty-container">
        <div className="content">
          <img src={emptyChat} alt="" />
          <span>You have no friends</span>
        </div>
      </div>
    );
  }
}

export default EmptyChat;
