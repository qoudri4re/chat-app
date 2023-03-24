import React, { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { AiFillEdit } from "react-icons/ai";
import { MdContentCopy, MdOutlineEditOff } from "react-icons/md";
import { BiSelectMultiple } from "react-icons/bi";
import { BiSave } from "react-icons/bi";

function MessageOptions({
  deleteMessage,
  messageId,
  message,
  senderOrReciever,
  messageEdit,
  editMessage,
  saveEditedMessage,
  editText,
  cancelEdit,
  messageType,
}) {
  const [messageCopied, setMessageCopied] = useState(false);

  function copyToClipBoard(text) {
    navigator.clipboard.writeText(text);
    setMessageCopied(true);
  }

  function saveEditedMessageWrapper() {
    if (message !== editText) {
      saveEditedMessage(messageId, editText);
    }
  }
  useEffect(() => {
    let timeoutId;
    if (messageCopied) {
      timeoutId = setTimeout(() => {
        setMessageCopied(false);
      }, 1000);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [messageCopied]);

  return (
    <div className="message__options">
      {senderOrReciever === "sender" ? (
        <>
          <div
            className="icon__background"
            onClick={() => deleteMessage(messageId)}
          >
            <AiFillDelete className="icon" />
          </div>
          {editMessage?.messageId ? (
            <>
              <div className="icon__background">
                <BiSave className="icon" onClick={saveEditedMessageWrapper} />
              </div>

              <div className="icon__background">
                <MdOutlineEditOff className="icon" onClick={cancelEdit} />
              </div>
            </>
          ) : messageType === "text" ? (
            <div className="icon__background">
              <AiFillEdit
                className="icon"
                onClick={() => messageEdit(messageId)}
              />
            </div>
          ) : (
            ""
          )}
        </>
      ) : (
        ""
      )}
      <div className="icon__background">
        {messageCopied ? (
          <BiSelectMultiple className="icon" />
        ) : (
          <MdContentCopy
            className="icon"
            onClick={() => copyToClipBoard(message)}
          />
        )}
      </div>
    </div>
  );
}

export default MessageOptions;
