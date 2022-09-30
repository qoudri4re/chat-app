import React from "react";

function Message({ senderOrReciever }) {
  return (
    <div className={`message-container ${senderOrReciever}`}>
      <div className={"message"}>
        <p>this is a message</p>
        <span>11:30am</span>
      </div>
    </div>
  );
}

export default Message;
