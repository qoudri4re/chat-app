import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar/Sidebar";
import Chat from "./chat/Chat";
import "./home.css";
import {
  getWindowSize,
  retrieveUserDetailsFromLocalStorage,
} from "./utils/functions";
import { useNavigate } from "react-router-dom";

function Home() {
  let navigate = useNavigate();

  //might need this later, who knows?
  // const [userDetails, setUserDetails] = useState(
  //   retrieveUserDetailsFromLocalStorage()
  // );

  //determine wether to redirect user to auth page according to saved details
  const userDetails = retrieveUserDetailsFromLocalStorage();
  useEffect(() => {
    if (!userDetails) {
      console.log("redirecting");
      navigate("/login");
    } else {
      console.log("not redirecting");
    }
  }, [navigate, userDetails]);
  const [windowSize, setWindowSize] = useState(getWindowSize());
  const [currentChat, setCurrentChat] = useState(null);

  const handleChatClick = (id) => {
    setCurrentChat(id);
  };

  const closeChatArrow = () => {
    setCurrentChat(null);
  };

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  if (userDetails) {
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
}

export default Home;
