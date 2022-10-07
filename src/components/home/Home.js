import React, { useEffect, useState } from "react";
import Sidebar from "./sidebar/Sidebar";
import Chat from "./chat/Chat";
import "./home.css";
import {
  getWindowSize,
  retrieveUserDetailsFromLocalStorage,
} from "./utils/functions";
import { useNavigate } from "react-router-dom";
import { client, requestHeaderConfig } from "../../utils/axios-request";

function Home() {
  let navigate = useNavigate();

  //determine wether to redirect user to auth page according to saved details
  const [userDetails, setUserDetails] = useState(
    retrieveUserDetailsFromLocalStorage()
  );

  useEffect(() => {
    if (!userDetails) {
      navigate("/login");
    }
  }, [navigate, userDetails]);
  const [windowSize, setWindowSize] = useState(getWindowSize());
  const [currentChat, setCurrentChat] = useState(null);

  //set back to null, to do loading compontnt
  const [friendsDetails, setFriendsDetails] = useState([]);

  //TODO clean up useffect
  useEffect(() => {
    //fetch the user's friends details
    if (userDetails) {
      client
        .get(
          `/${userDetails.userID}/friends`,
          requestHeaderConfig(userDetails.token)
        )
        .then((res) => {
          setFriendsDetails(res.data);
          if ("error" in res.data || "tokenError" in res.data) {
            //access token is invalid or the userID param is invalid
            setUserDetails(null);
          } else {
            setFriendsDetails(res.data);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [userDetails, setUserDetails]);

  const handleChatClick = (id) => {
    const whichChatWasClicked = friendsDetails.filter(
      (item) => item._id === id
    );
    setCurrentChat(whichChatWasClicked[0]);
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
            <Chat
              closeChatArrow={closeChatArrow}
              windowSize={windowSize}
              currentChat={currentChat}
            />
          ) : (
            <Sidebar
              friendsDetails={friendsDetails}
              userDetails={userDetails}
              setUserDetails={setUserDetails}
              handleChatClick={handleChatClick}
            />
          )}
        </div>
      );
      //display for desktop
    } else {
      return (
        <div className="desktop-view">
          <Sidebar
            friendsDetails={friendsDetails}
            userDetails={userDetails}
            setUserDetails={setUserDetails}
            handleChatClick={handleChatClick}
          />
          {currentChat ? (
            <Chat
              windowSize={windowSize}
              closeChatArrow={closeChatArrow}
              currentChat={currentChat}
            />
          ) : (
            ""
          )}
        </div>
      );
    }
  }
}

export default Home;
