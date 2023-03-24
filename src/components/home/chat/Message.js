import React, { useState } from "react";
import MessageOptions from "./MessageOptions";
import { BiErrorAlt } from "react-icons/bi";
import AudioPlayer from "./AudioPlayer";
import VideoPlayer from "./VideoPlayer";
import ImageViewer from "./ImageViewer";
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

  function handleEditTyping(e) {
    setEditText(e.target.value);
  }

  function stopPropagation(e) {
    e.stopPropagation();
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
      <div className={"message"}>
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
          <a href={messageUrl} download={messageName}>
            Download file {messageName}
          </a>
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
