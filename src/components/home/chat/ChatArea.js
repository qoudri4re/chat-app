import React from "react";
import Message from "./Message";

function ChatArea() {
  return (
    <div className="chat-area">
      <Message senderOrReciever={"sender"} />
      <Message senderOrReciever={"receiver"} />
      <Message senderOrReciever={"sender"} />
      <Message senderOrReciever={"receiver"} />
      <Message senderOrReciever={"sender"} />
      <Message senderOrReciever={"receiver"} />
      <Message senderOrReciever={"sender"} />
      <Message senderOrReciever={"receiver"} />
    </div>
  );
}

export default ChatArea;
