import React, { useEffect } from "react";
import { client, requestHeaderConfig } from "../../../utils/axios-request";
import Message from "./Message";
import WaveLoading from "../../loaders/WaveLoading";
import EmptyChat from "../../empty/EmptyChat";

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

  if (messages) {
    if (messages.length > 0) {
      return (
        <div className="chat-area">
          {messages.map((item) => {
            if (item.senderID === userDetails.userID) {
              return (
                <Message
                  senderOrReciever={"sender"}
                  key={item._id}
                  message={item.message}
                  timeSent={item.timeSent}
                />
              );
            } else {
              return (
                <Message
                  senderOrReciever={"receiver"}
                  key={item._id}
                  message={item.message}
                  timeSent={item.timeSent}
                />
              );
            }
          })}
        </div>
      );
    } else {
      return (
        <div className="chat-area">
          <EmptyChat whereEmpty="chat-area" />
        </div>
      );
    }
  } else {
    return (
      <div className="chat-area">
        <WaveLoading loadFor="loading-for-chat-area" />
      </div>
    );
  }
}

export default ChatArea;
