import React, { useEffect, useState } from "react";
import { client, requestHeaderConfig } from "../../../utils/axios-request";
import Message from "./Message";
import WaveLoading from "../../loaders/WaveLoading";
import EmptyChat from "../../empty/EmptyChat";

function ChatArea({
  userDetails,
  currentChat,
  setUserDetails,
  messages,
  setMessages,
  scrollRef,
  setMessagesUpdate,
  socket,
}) {
  const [context, setContext] = useState({ display: false, messageId: null });
  const [xYPosition, setXYPosition] = useState({ x: 0, y: 0 });
  const [editMessage, setEditMessage] = useState({ messageId: null });

  function cancelEdit() {
    setEditMessage({ messageId: null });
    setContext({ display: false, messageId: null });
  }
  function messageEdit(messageId) {
    setEditMessage((prevValue) => {
      if (prevValue?.messageId === messageId) {
        return { messageId: null };
      } else {
        return { messageId };
      }
    });
  }

  function showChatMessageOption(e, messageId) {
    e.preventDefault();
    if (context.display) {
      if (editMessage.messageId) setEditMessage({ messageId: null });
      if (messageId === context.messageId) {
        // if (editMessage?.messageId === messageId)
        //   setEditMessage({ messageId: null });
        setContext({ display: false, messageId: null });
      } else {
        setContext({ ...context, messageId: messageId });
      }
    } else {
      setXYPosition({ x: e.pageX, y: e.pageY });
      setContext({ display: true, messageId: messageId });
    }
  }

  useEffect(() => {
    client
      .post(
        "/getMessages",
        {
          to: currentChat._id,
          from: userDetails.userID,
        },
        requestHeaderConfig(userDetails.token)
      )
      .then((res) => {
        if ("error" in res.data) {
          setUserDetails(null);
        } else {
          setMessages(res.data);
        }
      })
      .catch((error) => console.log(error));
  }, [currentChat, userDetails, setUserDetails, setMessages]);

  function saveEditedMessage(messageId, message) {
    client
      .put(
        `/editMessage/${messageId}`,
        {
          message,
        },
        requestHeaderConfig(userDetails.token)
      )
      .then((res) => {
        if ("tokenError" in res.data) {
          setUserDetails(null);
        } else if ("notFound" in res.data) {
          //impossible
        } else if ("error" in res.data) {
          //server error, modal needed
        } else {
          setEditMessage({ messageId: null });
          setMessagesUpdate({ updated: true });
          setMessages(
            messages.map((item) => {
              if (item._id === messageId) {
                return res.data.updatedMessageDoc;
              } else {
                return item;
              }
            })
          );
          setContext({ display: false, messageId: null });
          socket.current.emit("messageEdited", {
            to: currentChat._id,
            from: userDetails.userID,
            editedMessage: res.data.updatedMessageDoc,
          });
        }
      })
      .catch((error) => console.log(error));
  }

  function deleteMessage(messageId) {
    client
      .get(
        `/deleteMessage/${messageId}`,
        requestHeaderConfig(userDetails.token)
      )
      .then((res) => {
        if ("tokenError" in res.data) {
          setUserDetails(null);
        } else if ("error" in res.data) {
          //server error, modal needed
        } else if ("notFound" in res.data) {
          //impossible
        } else {
          setMessagesUpdate({ updated: true });
          setMessages(
            messages.map((item) => {
              if (item._id === messageId) {
                return res.data.updatedDoc;
              } else {
                return item;
              }
            })
          );
          socket.current.emit("delete-message", {
            to: currentChat._id,
            from: userDetails.userID,
            deletedMessage: res.data.updatedDoc,
          });
        }
      });
  }

  if (messages) {
    if (messages.length > 0) {
      return (
        <div className="chat-area" ref={scrollRef}>
          {messages.map((item) => {
            if (item.senderID === userDetails.userID) {
              return (
                <Message
                  senderOrReciever={"sender"}
                  key={item._id}
                  id={item._id}
                  message={item.message}
                  timeSent={item.timeSent}
                  messageDeleted={item.deleted}
                  editedMessage={item.edited}
                  messageType={item.messageType}
                  messageUrl={item.messageUrl}
                  messageCloudinaryId={item.messageCloudinaryId}
                  messageName={item.messageName}
                  messageExtension={item.messageExtension}
                  showChatMessageOption={showChatMessageOption}
                  xYPosition={xYPosition}
                  context={context}
                  deleteMessage={deleteMessage}
                  messageEdit={messageEdit}
                  editMessage={editMessage}
                  saveEditedMessage={saveEditedMessage}
                  cancelEdit={cancelEdit}
                />
              );
            } else {
              return (
                <Message
                  senderOrReciever={"receiver"}
                  key={item._id}
                  id={item._id}
                  message={item.message}
                  timeSent={item.timeSent}
                  editedMessage={item.edited}
                  messageType={item.messageType}
                  messageUrl={item.messageUrl}
                  messageCloudinaryId={item.messageCloudinaryId}
                  messageName={item.messageName}
                  messageExtension={item.messageExtension}
                  messageDeleted={item.deleted}
                  showChatMessageOption={showChatMessageOption}
                  xYPosition={xYPosition}
                  context={context}
                  deleteMessage={deleteMessage}
                  messageEdit={messageEdit}
                  editMessage={editMessage}
                  saveEditedMessage={saveEditedMessage}
                  cancelEdit={cancelEdit}
                />
              );
            }
          })}
        </div>
      );
    } else {
      return (
        <div className="chat-area">
          <EmptyChat whereEmpty="chat-area" />
        </div>
      );
    }
  } else {
    return (
      <div className="chat-area">
        <WaveLoading loadFor="loading-for-chat-area" />
      </div>
    );
  }
}

export default ChatArea;
