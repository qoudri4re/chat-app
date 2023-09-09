import React from "react";
import Skeleton from "@mui/material/Skeleton";

function ChatListSkeleton() {
  return (
    <div className="chat-list-item skeleton__loading">
      <div className="left">
        <Skeleton animation="wave" variant="circular" width={50} height={50} />
        <Skeleton animation="wave" height={25} width="50%" />
      </div>
      <div className="right">
        <Skeleton animation="wave" variant="circular" width={15} height={15} />
      </div>
    </div>
  );
}

export default ChatListSkeleton;
