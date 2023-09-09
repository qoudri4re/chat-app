import React, { useEffect, useRef, useState } from "react";
import "./chat.css";
import ChatHeader from "./ChatHeader";
import ChatArea from "./ChatArea";
import SendMessage from "./SendMessage";
import Profile from "./Profile";
import ErrorModal from "./ErrorModal";

function Chat({
  closeChatArrow,
  windowSize,
  currentChat,
  userDetails,
  setUserDetails,
  socket,
  setUpdateSideBar,
  setFriendsDetails,
  setUnreadMessagesCount,
  view,
  messagesUpdates,
  setMessagesUpdate,
}) {
  //maintain profile component display
  const [displayProfile, setDisplayProfile] = useState(false);
  const [messages, setMessages] = useState(null);
  // const [messagesUpdates, setMessagesUpdate] = useState({ updated: false });
  const [errors, setErrors] = useState(null);
  //handles how the profile component is displayed or hidden
  const showOrCloseProfile = () => {
    setDisplayProfile(!displayProfile);
  };

  function closeChatErrorModal() {
    setErrors(null);
  }

  useEffect(() => {
    let timeoutId;
    if (errors) {
      timeoutId = setTimeout(() => {
        setErrors(null);
      }, 9000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [errors]);

  useEffect(() => {
    setMessages(null);
  }, [currentChat]);

  const scrollRef = useRef(null);
  useEffect(() => {
    if (scrollRef.current && !messagesUpdates.updated) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    setMessagesUpdate({ updated: false });
  }, [messages]);
  const currentChatRef = useRef();
  currentChatRef.current = currentChat;
  useEffect(() => {
    if (socket.current) {
      socket.current.on("recieve-message", (messageData) => {
        if (currentChatRef.current._id === messageData.from) {
          setMessages((prevValue) => {
            const isAlreadyExist = prevValue.some(
              (item) => item._id === messageData._id
            );
            if (!isAlreadyExist) {
              return [...prevValue, messageData];
            }
            return prevValue;
          });
          // setMessages((prevValue) => [...prevValue, messageData]);
          if (view === "desktop") {
            setUnreadMessagesCount((prevValue) =>
              prevValue.filter((item) => item.friendChatId !== currentChat._id)
            );
          }
          setUpdateSideBar(true);
        } else {
          setUnreadMessagesCount((prevValue) => {
            const isAlreadyExist = prevValue.some(
              (item) => item.messageId === messageData._id
            );
            if (!isAlreadyExist) {
              return [
                ...prevValue,
                { friendChatId: messageData.from, messageId: messageData._id },
              ];
            }
            return prevValue;
          });
        }
      });
      socket.current.on("recieveFileMessage", (messageData) => {
        if (currentChatRef.current._id === messageData.from) {
          setMessages((prevValue) => [
            ...prevValue,
            ...messageData.uploadedFiles,
          ]);
          if (view === "desktop") {
            setUnreadMessagesCount((prevValue) =>
              prevValue.filter((item) => item.friendChatId !== currentChat._id)
            );
          }
        } else {
          setUnreadMessagesCount((prevValue) => {
            const isAlreadyExist = prevValue.some(
              (item) => item.messageId === messageData.uniqueId
            );
            if (!isAlreadyExist) {
              return [
                ...prevValue,
                {
                  friendChatId: messageData.from,
                  messageId: messageData.uniqueId,
                },
              ];
            }
            return prevValue;
          });
        }
      });
    }
  }, [socket]);

  useEffect(() => {
    if (socket.current && messages) {
      socket.current.on("recieve-deleted-message", (messageData) => {
        if (messageData && currentChatRef.current._id === messageData.from) {
          setMessagesUpdate({ updated: true });
          setMessages(
            messages.map((item) => {
              if (
                item._id === messageData.deletedMessage._id &&
                item.deleted !== messageData.deletedMessage.deleted
              ) {
                return messageData.deletedMessage;
              }
              return item;
            })
          );
        }
      });
      socket.current.on("recieveEditedMessage", (messageData) => {
        if (currentChatRef.current._id === messageData.from) {
          setMessagesUpdate({ updated: true });
          setMessages(
            messages.map((item) => {
              if (item._id === messageData.editedMessage._id) {
                return messageData.editedMessage;
              }
              return item;
            })
          );
        }
      });
    }
  }, [socket, messages]);
  return (
    <div
      className={`chat ${
        displayProfile ? "chat-with-profile" : "chat-without-profile"
      }`}
    >
      {errors ? (
        <ErrorModal errors={errors} closeChatErrorModal={closeChatErrorModal} />
      ) : (
        ""
      )}
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
          scrollRef={scrollRef}
          setMessagesUpdate={setMessagesUpdate}
          socket={socket}
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
          setErrors={setErrors}
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
