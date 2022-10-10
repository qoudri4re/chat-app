import React from "react";

function Message({ senderOrReciever, message, timeSent }) {
  return (
    <div className={`message-container ${senderOrReciever}`}>
      <div className={"message"}>
        <p>{message}</p>
        <span></span>
      </div>
    </div>
  );
}

export default Message;
