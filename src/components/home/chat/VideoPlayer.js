import React from "react";

function VideoPlayer({ messageUrl, messageExtension }) {
  return (
    <video controls loading="lazy">
      <source src={messageUrl} type={`video/${messageExtension}`} />
    </video>
  );
}

export default VideoPlayer;
