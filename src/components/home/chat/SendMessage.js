import React from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { GrAttachment } from "react-icons/gr";
import { MdKeyboardVoice } from "react-icons/md";
import { TbSend } from "react-icons/tb";
function SendMessage() {
  return (
    <div className="send-message">
      <input type="text" placeholder="message" />
      <div className="right">
        <div className="icon-background">
          <TbSend className="icon" />
        </div>
        <div className="icon-background">
          <BsEmojiSmile className="icon" />
        </div>
        <div className="icon-background">
          <GrAttachment className="icon" />
        </div>
        <div className="icon-background">
          <MdKeyboardVoice className="icon" />
        </div>
      </div>
    </div>
  );
}

export default SendMessage;
