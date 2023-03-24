import React from "react";
import ChatListItem from "./ChatListItem";
import "./chatList.css";
import EmptyChat from "../../../empty/EmptyChat";
import EmptySearch from "../../../empty/EmptySearch";
import WaveLoading from "../../../loaders/WaveLoading";

function ChatList({
  handleChatClick,
  friendsDetails,
  search,
  unreadMessagesCount,
}) {
  if (friendsDetails) {
    if (friendsDetails.length === 0 && !search) {
      return <EmptyChat />;
    } else if (friendsDetails.length === 0 && search) {
      return <EmptySearch />;
    } else {
      let ChatListItems = friendsDetails.map((item) => {
        let unreadMessages = unreadMessagesCount.filter(
          (message) => message.friendChatId === item._id
        ).length;

        return (
          <ChatListItem
            key={item._id}
            id={item._id}
            username={item.username}
            lastMessage={"last message"}
            unreadMessageCount={unreadMessages}
            handleChatClick={handleChatClick}
            profile_img={item.profile_img}
          />
        );
      });
      return <div className="chatlist">{ChatListItems}</div>;
    }
  } else if (!friendsDetails && search) {
    return <div className="search-bar-msg">type any keyword to search</div>;
  } else {
    return <WaveLoading loadFor={"loading-for-chatList"} />;
  }
}

export default ChatList;
