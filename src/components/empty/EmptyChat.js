import React from "react";
import emptyChat from "./images/emptyChat.png";
import "./style.css";

function EmptyChat() {
  return (
    <div className="empty-container">
      <div className="content">
        <img src={emptyChat} alt="" />
        <span>You have no friends</span>
      </div>
    </div>
  );
}

export default EmptyChat;
