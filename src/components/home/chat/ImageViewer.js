import React from "react";

function ImageViewer({ messageUrl }) {
  return (
    <img
      src={messageUrl}
      alt="a pic"
      className="message__item message__image"
      loading="lazy"
    />
  );
}

export default ImageViewer;
