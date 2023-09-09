import React, { useState } from "react";
import { MdCall } from "react-icons/md";
import { HiOutlineVideoCamera } from "react-icons/hi";
import default_image from "../sidebar/chatlist/default-image.jpg";
import { BsArrowLeftShort } from "react-icons/bs";
import Avatar from "@mui/material/Avatar";

function ChatHeader({
  showOrCloseProfile,
  closeChatArrow,
  windowSize,
  currentChat,
}) {
  const [profileImgLoaded, setProfileImgLoaded] = useState(false);

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
          {currentChat.profile_img !== "default-image" ? (
            <img
              src={currentChat.profile_img}
              alt=""
              onLoad={() => setProfileImgLoaded(true)}
              className="hidden-image"
            />
          ) : (
            ""
          )}
          {currentChat.profile_img === "default-image" ? (
            <Avatar
              src={default_image}
              sx={{
                width: 45,
                height: 45,
              }}
              onClick={showOrCloseProfile}
            />
          ) : profileImgLoaded ? (
            <Avatar
              alt="{username}"
              src={currentChat.profile_img}
              onClick={showOrCloseProfile}
            />
          ) : (
            <Avatar
              sx={{
                width: 45,
                height: 45,
              }}
              src={default_image}
              onClick={showOrCloseProfile}
            />
          )}
        </div>
        <div className="username-status" onClick={showOrCloseProfile}>
          <h3>{currentChat.username}</h3>
        </div>
      </div>
      <div className="right">
        <Avatar sx={{ bgcolor: "rgba(255, 255, 255, 0.3)" }}>
          <MdCall className="icon" />
        </Avatar>
        <Avatar sx={{ bgcolor: "rgba(255, 255, 255, 0.3)" }}>
          <HiOutlineVideoCamera className="icon" />
        </Avatar>
      </div>
    </div>
  );
}

export default ChatHeader;
