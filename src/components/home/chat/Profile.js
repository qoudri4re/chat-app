import React from "react";
import default_image from "../sidebar/chatlist/default-image.jpg";
import { GrClose } from "react-icons/gr";
import { IoMdNotifications } from "react-icons/io";
import { BiUser } from "react-icons/bi";
import { MdCall } from "react-icons/md";

function Profile({ showOrCloseProfile }) {
  return (
    <div className="profile">
      <div className="profile-item head">
        <GrClose className="close-icon icon" onClick={showOrCloseProfile} />
      </div>
      <div className="profile-item picture">
        <img src={default_image} alt="" />
        <div className="details">
          <h3>Richard Henfrics</h3>
          <span>online</span>
        </div>
      </div>
      <div className="profile-item user-info">
        <div className="user-info-item">
          <MdCall className="icon" />
          <div className="info">
            <span>08238485</span>
            <span>phone number</span>
          </div>
        </div>
        <div className="user-info-item">
          <BiUser className="icon" />
          <div className="info">
            <span>08238485</span>
            <span>username</span>
          </div>
        </div>
        <div className="user-info-item">
          <IoMdNotifications className="icon" />
          <div className="info">
            <span>08238485</span>
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
