import React from "react";
import ChatListItem from "./ChatListItem";
import "./chatList.css";
import chatData from "../../../../data/chatData";

function ChatList({ handleChatClick }) {
  let ChatListItems = chatData.map((item) => {
    return (
      <ChatListItem
        key={item.id}
        id={item.id}
        username={item.username}
        lastMessage={item.lastMessage}
        unreadMessageCount={item.unreadMessageCount}
        handleChatClick={handleChatClick}
      />
    );
  });
  return <div className="chatlist">{ChatListItems}</div>;
}

export default ChatList;
