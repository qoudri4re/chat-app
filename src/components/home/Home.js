import React, { useEffect, useState, useRef } from "react";
import Sidebar from "./sidebar/Sidebar";
import Chat from "./chat/Chat";
import "./home.css";
import {
  getWindowSize,
  retrieveUserDetailsFromLocalStorage,
} from "./utils/functions";
import { useNavigate } from "react-router-dom";
import { client, requestHeaderConfig } from "../../utils/axios-request";
import { io } from "socket.io-client";

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
  const [search, setSearch] = useState(false);
  const [searchResults, setSearchResults] = useState(null);

  const getAllUsers = async (searchTerm) => {
    if (search) {
      client
        .get("/all-users", requestHeaderConfig(userDetails.token))
        .then((res) => {
          if ("err" in res.data) {
            setUserDetails(null);
          } else {
            setSearchResults(
              res.data.filter(
                (item) =>
                  item.username.toLowerCase().includes(searchTerm) &&
                  item._id !== userDetails.userID
              )
            );
          }
        })
        .catch((err) => console.log(err));
    }
  };

  //search results are retained even after the user leaves the search bar
  //so i'm clearing it
  useEffect(() => {
    if (!search) {
      setSearchResults(null);
    }
  }, [search]);

  //set back to null, to do loading compontnt
  const [friendsDetails, setFriendsDetails] = useState(null);
  const [updateSideBar, setUpdateSideBar] = useState(false);
  const socket = useRef();

  useEffect(() => {
    //fetch the user's friends details
    if (userDetails) {
      client
        .get(
          `/${userDetails.userID}/friends`,
          requestHeaderConfig(userDetails.token)
        )
        .then((res) => {
          if ("error" in res.data || "tokenError" in res.data) {
            //access token is invalid or the userID param is invalid
            setUserDetails(null);
          } else {
            setFriendsDetails(res.data);
          }
        })
        .catch((err) => console.log(err));
      if (updateSideBar) {
        setUpdateSideBar(false);
      }
    }
  }, [userDetails, setUserDetails, updateSideBar]);

  useEffect(() => {
    if (userDetails) {
      socket.current = io("http://localhost:3001");
      socket.current.emit("add-user", userDetails.userID);
    }
  }, [userDetails]);

  const handleTabClose = (event) => {
    socket.current.emit("close", userDetails.userID);
  };

  window.addEventListener("beforeunload", handleTabClose);

  const handleChatClick = (id) => {
    if (search) {
      setSearch(false);
      const searchResultThatWasClicked = searchResults.filter(
        (item) => item._id === id
      );
      setCurrentChat(searchResultThatWasClicked[0]);

      // setFriendsDetails((prevVal) => [
      //   ...prevVal,
      //   searchResultThatWasClicked[0],
      // ]);
    } else {
      const whichChatWasClicked = friendsDetails.filter(
        (item) => item._id === id
      );
      setCurrentChat(whichChatWasClicked[0]);
    }
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
              userDetails={userDetails}
              setUserDetails={setUserDetails}
              socket={socket}
              setUpdateSideBar={setUpdateSideBar}
              setFriendsDetails={setFriendsDetails}
            />
          ) : (
            <Sidebar
              //returning either search results or users friends
              friendsDetails={search ? searchResults : friendsDetails}
              userDetails={userDetails}
              setUserDetails={setUserDetails}
              handleChatClick={handleChatClick}
              setSearch={setSearch}
              getAllUsers={getAllUsers}
              search={search}
            />
          )}
        </div>
      );
      //display for desktop
    } else {
      return (
        <div className="desktop-view">
          <Sidebar
            //returning either search results or users friends
            friendsDetails={search ? searchResults : friendsDetails}
            userDetails={userDetails}
            setUserDetails={setUserDetails}
            handleChatClick={handleChatClick}
            setSearch={setSearch}
            getAllUsers={getAllUsers}
            search={search}
          />
          {currentChat ? (
            <Chat
              windowSize={windowSize}
              closeChatArrow={closeChatArrow}
              currentChat={currentChat}
              userDetails={userDetails}
              setUserDetails={setUserDetails}
              socket={socket}
              setUpdateSideBar={setUpdateSideBar}
              setFriendsDetails={setFriendsDetails}
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
