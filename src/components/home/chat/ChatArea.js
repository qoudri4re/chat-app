import React, { useEffect } from "react";
import { client, requestHeaderConfig } from "../../../utils/axios-request";
import Message from "./Message";

function ChatArea({
  userDetails,
  currentChat,
  setUserDetails,
  messages,
  setMessages,
}) {
  useEffect(() => {
    client
      .post(
        "/getMessages",
        {
          to: currentChat._id,
          from: userDetails.userID,
        },
        requestHeaderConfig(userDetails.token)
      )
      .then((res) => {
        if ("error" in res.data) {
          setUserDetails(null);
        } else {
          setMessages(res.data);
        }
      })
      .catch((error) => console.log(error));
  }, [currentChat, userDetails, setUserDetails, setMessages]);

  return (
    <div className="chat-area">
      {messages.map((item) => {
        if (item.senderID === userDetails.userID) {
          return (
            <Message
              senderOrReciever={"sender"}
              key={item._id}
              message={item.message}
              timeSent={item.time}
            />
          );
        } else {
          return (
            <Message
              senderOrReciever={"receiver"}
              key={item._id}
              message={item.message}
              timeSent={item.createdAt}
            />
          );
        }
      })}
    </div>
  );
}

export default ChatArea;
