import React from "react";
import { MdCall } from "react-icons/md";
import { HiOutlineVideoCamera } from "react-icons/hi";
import default_image from "../sidebar/chatlist/default-image.jpg";
import { BsArrowLeftShort } from "react-icons/bs";
function ChatHeader({
  showOrCloseProfile,
  closeChatArrow,
  windowSize,
  currentChat,
}) {
  return (
    <div className="chat-header">
      <div className="left">
        {windowSize.innerWidth < 700 ? (
          <BsArrowLeftShort
            className="icon"
            onClick={() => closeChatArrow(currentChat._id)}
          />
        ) : (
          ""
        )}
        <div className="image-online-status">
          <img src={default_image} alt="" onClick={showOrCloseProfile} />
        </div>
        <div className="username-status" onClick={showOrCloseProfile}>
          <h3>{currentChat.username}</h3>
        </div>
      </div>
      <div className="right">
        <div className="icon-background">
          <MdCall className="icon" />
        </div>
        <div className="icon-background">
          <HiOutlineVideoCamera className="icon" />
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
