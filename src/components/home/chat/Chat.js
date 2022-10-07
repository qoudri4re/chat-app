import React, { useState } from "react";
import "./chat.css";
import ChatHeader from "./ChatHeader";
import ChatArea from "./ChatArea";
import SendMessage from "./SendMessage";
import Profile from "./Profile";

function Chat({ closeChatArrow, windowSize, currentChat }) {
  //maintain profile component display
  const [displayProfile, setDisplayProfile] = useState(false);

  //handles how the profile component is displayed or hidden
  const showOrCloseProfile = () => {
    setDisplayProfile(!displayProfile);
  };

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
        <ChatArea />
        <SendMessage />
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
