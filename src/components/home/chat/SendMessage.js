import React, { useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { GrAttachment } from "react-icons/gr";
import { MdKeyboardVoice } from "react-icons/md";
import { TbSend } from "react-icons/tb";
import { client, requestHeaderConfig } from "../../../utils/axios-request";

function SendMessage({
  currentChat,
  userDetails,
  setUserDetails,
  socket,
  setMessages,
  setUpdateSideBar,
}) {
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (message !== "") {
      setMessage("");
      client
        .post(
          "/sendMessage",
          {
            from: userDetails.userID,
            to: currentChat._id,
            message,
          },
          requestHeaderConfig(userDetails.token)
        )
        .then((res) => {
          if ("error" in res.data) {
            setUserDetails(null);
          } else {
            socket.current.emit("send-message", {
              to: currentChat._id,
              message,
              ...res.data,
            });

            setMessages((prevValue) => [...prevValue, res.data]);
            setUpdateSideBar(true);
          }
        })
        .catch((err) => console.log(err));
    } else {
      console.log("empty");
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };
  return (
    <div className="send-message">
      <input
        type="text"
        placeholder="message"
        name="message"
        value={message}
        onChange={handleInputChange}
      />
      <div className="right">
        <div className="icon-background">
          <TbSend className="icon" onClick={sendMessage} />
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
