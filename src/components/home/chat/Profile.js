import React, { useState } from "react";
import default_image from "../sidebar/chatlist/default-image.jpg";
import { GrClose } from "react-icons/gr";
import { IoMdNotifications } from "react-icons/io";
import { BiUser } from "react-icons/bi";
import { MdCall } from "react-icons/md";

function Profile({ showOrCloseProfile, currentChat }) {
  const [profileImageLoaded, setProfileImageLoaded] = useState(false);

  return (
    <div className="profile">
      <div className="profile-item head">
        <GrClose className="close-icon icon" onClick={showOrCloseProfile} />
      </div>
      <div className="profile-item picture">
        {currentChat.profile_img !== "default-image" ? (
          <img
            src={currentChat.profile_img}
            alt=""
            onLoad={() => setProfileImageLoaded(true)}
            className="hidden-image"
          />
        ) : (
          ""
        )}
        <img
          src={
            currentChat.profile_img === "default-image"
              ? default_image
              : profileImageLoaded
              ? currentChat.profile_img
              : default_image
          }
          alt=""
          onClick={showOrCloseProfile}
        />
        <div className="details">
          <h3>{currentChat.username}</h3>
          <span>online</span>
        </div>
      </div>
      <div className="profile-item user-info">
        <div className="user-info-item">
          <MdCall className="icon" />
          <div className="info">
            <span>{currentChat.email}</span>
            <span>email</span>
          </div>
        </div>
        <div className="user-info-item">
          <BiUser className="icon" />
          <div className="info">
            <span>{currentChat.username}</span>
            <span>username</span>
          </div>
        </div>
        <div className="user-info-item">
          <IoMdNotifications className="icon" />
          <div className="info">
            <span>{currentChat.username}</span>
            <span>notification</span>
          </div>
        </div>
      </div>
      <div className="profile-item media">
        <div className="header">
          <span>Media</span>
          <span>files</span>
          <span>links</span>
          <span>voice</span>
        </div>
        <div className="items image">
          <div className="image-container">
            <img src={default_image} alt="" />
          </div>
          <div className="image-container">
            <img src={default_image} alt="" />
          </div>
          <div className="image-container">
            <img src={default_image} alt="" />
          </div>
          <div className="image-container">
            <img src={default_image} alt="" />
          </div>
          <div className="image-container">
            <img src={default_image} alt="" />
          </div>
          <div className="image-container">
            <img src={default_image} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
