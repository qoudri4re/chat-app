import React, { useRef, useState } from "react";
import MessageOptions from "./MessageOptions";
import { BiErrorAlt } from "react-icons/bi";
import AudioPlayer from "./AudioPlayer";
// import AudioPlayer from "./mediaPlayers/Audio/AudioPlayer";
import VideoPlayer from "./VideoPlayer";
import ImageViewer from "./ImageViewer";
import { IoMdDownload } from "react-icons/io";

function Message({
  id,
  senderOrReciever,
  message,
  timeSent,
  showChatMessageOption,
  xYPosition,
  context,
  deleteMessage,
  messageDeleted,
  messageEdit,
  editMessage,
  editedMessage,
  saveEditedMessage,
  cancelEdit,
  messageType,
  messageUrl,
  messageCloudinaryId,
  messageExtension,
  messageName,
}) {
  const [editText, setEditText] = useState(message);
  const downloadRef = useRef();

  function handleEditTyping(e) {
    setEditText(e.target.value);
  }

  function stopPropagation(e) {
    e.stopPropagation();
  }

  function initiateDownload() {
    downloadRef.current.click();
  }

  let displayContext =
    context.display && context.messageId === id && !messageDeleted;

  return (
    <div
      className={`message-container ${senderOrReciever} ${
        displayContext ? "message-container-with-options" : ""
      }`}
      onContextMenu={(e) => showChatMessageOption(e, id)}
    >
      {displayContext ? (
        <MessageOptions
          style={{
            top: xYPosition.y,
            left: xYPosition.x,
          }}
          deleteMessage={deleteMessage}
          messageId={id}
          message={message}
          senderOrReciever={senderOrReciever}
          messageEdit={messageEdit}
          editMessage={editMessage}
          saveEditedMessage={saveEditedMessage}
          editText={editText}
          cancelEdit={cancelEdit}
          messageType={messageType}
        />
      ) : (
        ""
      )}
      <div className={`message ${messageType}__message`}>
        {editMessage?.messageId === id ? (
          <textarea value={editText} onChange={handleEditTyping}></textarea>
        ) : messageDeleted ? (
          <p>
            <i>
              {" "}
              <BiErrorAlt /> this message was deleted
            </i>
          </p>
        ) : messageType === "text" ? (
          <p>{message}</p>
        ) : messageType === "audio" ? (
          <AudioPlayer
            stopPropagation={stopPropagation}
            messageUrl={messageUrl}
            messageExtension={messageExtension}
          />
        ) : messageType === "video" ? (
          <VideoPlayer
            messageUrl={messageUrl}
            messageExtension={messageExtension}
          />
        ) : messageType === "image" ? (
          <ImageViewer messageUrl={messageUrl} />
        ) : messageType === "raw" ? (
          <div className="top">
            <div className="icon__background" onClick={initiateDownload}>
              <IoMdDownload className="icon" />
            </div>
            <div className="download__text">
              <p href={messageUrl} download={messageName}>
                {messageName}
              </p>
              <a
                ref={downloadRef}
                href={messageUrl}
                className="hidden"
                download={messageName}
              >
                {messageName}
              </a>
            </div>
          </div>
        ) : (
          ""
        )}
        {editedMessage && !messageDeleted ? (
          <div className="message__details">
            <span className="edited__message">(edited)</span>
            <span>{timeSent}</span>
          </div>
        ) : (
          <span>{timeSent}</span>
        )}
      </div>
    </div>
  );
}

export default Message;
