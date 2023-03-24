import React, { useState } from "react";
import default_image from "../icons/icons8-user-groups-64.png";

function Group({ groupId, groupName, profileImage, participants }) {
  const [profileImgLoaded, setProfileImgLoaded] = useState(false);
  const unreadMessageCount = 2;
  const participantsNames = participants
    .map((participant) => participant.username)
    .join(", ");
  return (
    <div className="chat-list-item">
      <div className="left">
        <div className="image-online-status">
          {profileImage !== "default-image" ? (
            <img
              src={profileImage}
              alt=""
              onLoad={() => setProfileImgLoaded(true)}
              className="hidden-image"
            />
          ) : (
            ""
          )}
          <img
            src={
              profileImage === "default-image"
                ? default_image
                : profileImgLoaded
                ? profileImage
                : default_image
            }
            alt=""
          />
        </div>
        <div className="chat-details">
          <h3>{groupName}</h3>
          <span>
            {participantsNames.length > 34
              ? participantsNames.slice(0, 34) + "..."
              : participantsNames}
          </span>
        </div>
      </div>
      {unreadMessageCount > 0 ? (
        <div className="new-message-count">
          <span>{unreadMessageCount}</span>
        </div>
      ) : (
        <div className="new-message-count hide-message-count">
          <span>{unreadMessageCount}</span>
        </div>
      )}
    </div>
  );
}

export default Group;
