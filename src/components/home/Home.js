import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar/Sidebar";
import Chat from "./chat/Chat";
import "./home.css";
const functions = require("./../../utils/functions");

function Home() {
  const [windowSize, setWindowSize] = useState(functions.getWindowSize());
  const [currentChat, setCurrentChat] = useState(null);

  const handleChatClick = (id) => {
    setCurrentChat(id);
  };

  const closeChatArrow = () => {
    setCurrentChat(null);
  };

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(functions.getWindowSize());
    }
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  //display for mobile
  if (windowSize.innerWidth < 700) {
    return (
      <div className="mobile-view">
        {currentChat ? (
          <Chat closeChatArrow={closeChatArrow} windowSize={windowSize} />
        ) : (
          <Sidebar handleChatClick={handleChatClick} />
        )}
      </div>
    );
    //display for desktop
  } else {
    return (
      <div className="desktop-view">
        <Sidebar handleChatClick={handleChatClick} />
        {currentChat ? (
          <Chat windowSize={windowSize} closeChatArrow={closeChatArrow} />
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default Home;
