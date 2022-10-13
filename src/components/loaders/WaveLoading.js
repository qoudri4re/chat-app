import React from "react";
import "./style.css";

function WaveLoading({ loadFor }) {
  return (
    <div className={`loading waveloader ${loadFor}`}>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
    </div>
  );
}

export default WaveLoading;
