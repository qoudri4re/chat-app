import React from "react";

function Message({ senderOrReciever, message, timeSent }) {
  console.log(timeSent);
  return (
    <div className={`message-container ${senderOrReciever}`}>
      <div className={"message"}>
        <p>{message}</p>
        <span>{timeSent}</span>
      </div>
    </div>
  );
}

export default Message;
