import React from "react";

function AudioPlayer({ stopPropagation, messageUrl, messageExtension }) {
  return (
    <audio controls onContextMenu={stopPropagation} className="audio__player">
      <source src={messageUrl} type={`audio/${messageExtension}`} />
      your browser does not support audio
    </audio>
  );
}

export default AudioPlayer;
