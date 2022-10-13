import React, { useEffect, useState } from "react";
import "./chat.css";
import ChatHeader from "./ChatHeader";
import ChatArea from "./ChatArea";
import SendMessage from "./SendMessage";
import Profile from "./Profile";

function Chat({
  closeChatArrow,
  windowSize,
  currentChat,
  userDetails,
  setUserDetails,
  socket,
  setUpdateSideBar,
  setFriendsDetails,
}) {
  //maintain profile component display
  const [displayProfile, setDisplayProfile] = useState(false);
  const [messages, setMessages] = useState(null);

  //handles how the profile component is displayed or hidden
  const showOrCloseProfile = () => {
    setDisplayProfile(!displayProfile);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("recieve-message", (messageData) => {
        setMessages((prevValue) => [...prevValue, messageData]);
        setUpdateSideBar(true);
      });
    }
  }, [socket, setUpdateSideBar]);

  return (
    <div
      className={`chat ${
        displayProfile ? "chat-with-profile" : "chat-without-profile"
      }`}
    >
      <div className="chat-components">
        <ChatHeader
          windowSize={windowSize}
          showOrCloseProfile={showOrCloseProfile}
          closeChatArrow={closeChatArrow}
          currentChat={currentChat}
        />
        <ChatArea
          userDetails={userDetails}
          currentChat={currentChat}
          setUserDetails={setUserDetails}
          messages={messages}
          setMessages={setMessages}
        />
        <SendMessage
          currentChat={currentChat}
          userDetails={userDetails}
          setUserDetails={setUserDetails}
          socket={socket}
          messages={messages}
          setMessages={setMessages}
          setUpdateSideBar={setUpdateSideBar}
          setFriendsDetails={setFriendsDetails}
        />
      </div>
      {displayProfile ? (
        <Profile
          showOrCloseProfile={showOrCloseProfile}
          currentChat={currentChat}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default Chat;
