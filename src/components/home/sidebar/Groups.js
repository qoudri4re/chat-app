import React, { useEffect, useState } from "react";
import { client, requestHeaderConfig } from "../../../utils/axios-request";
import Group from "./Group";

function Groups({ userDetails, setUserDetails }) {
  const [groups, setGroups] = useState(null);

  useEffect(() => {
    client
      //:userId/groups
      .get(
        `/${userDetails.userID}/groups`,
        requestHeaderConfig(userDetails.token)
      )
      .then((res) => {
        if ("tokenError" in res.data) {
          setUserDetails(null);
        } else if ("serverError" in res.data) {
        } else {
          setGroups(res.data.groups);
        }
      });
  }, []);

  if (groups) {
    return (
      <div className="groups">
        {groups.map((item) => {
          return (
            <Group
              groupName={item.groupName}
              profileImage={item.groupProfileImage}
              key={item._id}
              groupId={item._id}
              participants={item.participantsId}
            />
          );
        })}
      </div>
    );
  }
}

export default Groups;
