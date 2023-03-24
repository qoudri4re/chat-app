import React, { useState } from "react";
import { BsCheckLg, BsPlusLg } from "react-icons/bs";
import defaultImage from "./chatlist/default-image.jpg";

function PotentialGroupMember({
  id,
  username,
  profile_image,
  added,
  addMember,
}) {
  const [profileImageLoaded, setProfileImageLoaded] = useState(false);
  return (
    <div className="potential__member">
      <div className="left">
        <div className="image__background">
          {profile_image !== "default-image" ? (
            <img
              src={profile_image}
              alt=""
              onLoad={() => setProfileImageLoaded(true)}
              className="hidden-image"
            />
          ) : (
            ""
          )}
          <img
            src={
              profile_image === "default-image"
                ? defaultImage
                : profileImageLoaded
                ? profile_image
                : defaultImage
            }
            alt=""
          />
        </div>
        <h4>{username}</h4>
      </div>
      <div className="right" onClick={() => addMember(id)}>
        {added ? <BsCheckLg /> : <BsPlusLg />}
      </div>
    </div>
  );
}

export default PotentialGroupMember;
