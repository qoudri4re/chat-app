import React from "react";
import ChatListItem from "./ChatListItem";
import "./chatList.css";

function ChatList({ handleChatClick, friendsDetails }) {
  let ChatListItems = friendsDetails.map((item) => {
    return (
      <ChatListItem
        key={item._id}
        id={item._id}
        username={item.username}
        lastMessage={"last message"}
        unreadMessageCount={5}
        handleChatClick={handleChatClick}
      />
    );
  });
  return <div className="chatlist">{ChatListItems}</div>;
}

export default ChatList;
