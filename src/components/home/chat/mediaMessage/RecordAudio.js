import React, { useEffect, useRef, useState } from "react";
import Avatar from "@mui/material/Avatar";
import { AiOutlinePause } from "react-icons/ai";
import { BsStopFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { TbSend } from "react-icons/tb";
import { VscDebugContinueSmall } from "react-icons/vsc";
import "./style.css";
import { useReactMediaRecorder } from "react-media-recorder";

function RecordAudio({ toogleRecordAudio, sendAudioMessage }) {
  const [recordingTime, setRecordingTime] = useState(0);
  const [isRecording, setIsRecording] = useState(true);
  const [recordingStopped, setRecordingStopped] = useState(false);
  const [send, setSend] = useState(false);

  const {
    // status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    pauseRecording,
    resumeRecording,
  } = useReactMediaRecorder({ audio: true });
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isRecording]);

  useEffect(() => {
    startRecording();
  }, []);

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedTime = `${minutes
      .toString()
      .padStart(2, "0")} : ${remainingSeconds.toString().padStart(2, "0")}`;

    return formattedTime;
  }

  function deleteRecording() {
    stopRecording();
    setIsRecording(false);
    setRecordingTime(0);
    toogleRecordAudio();
  }

  function stopRecordingAudio() {
    stopRecording();
    setIsRecording(false);
    setRecordingStopped(true);
  }

  function pauseRecordingAudio() {
    pauseRecording();
    setIsRecording(false);
  }

  function continueRecordingAudio() {
    resumeRecording();
    setIsRecording(true);
  }

  useEffect(() => {
    if (!isRecording && send) {
      if (mediaBlobUrl) {
        sendAudioMessage(mediaBlobUrl);
        toogleRecordAudio();
      }
    }
  }, [mediaBlobUrl]);

  function sendRecordedAudio() {
    stopRecording();
    setSend(true);
    setIsRecording(false);
    setRecordingStopped(true);
    setRecordingTime(0);
  }

  return (
    <div className="record__audio">
      <Avatar sx={{ bgcolor: "rgba(255, 255, 255, 0.3)", color: "white" }}>
        <MdDelete className="icon" onClick={deleteRecording} />
      </Avatar>
      {isRecording ? (
        <Avatar sx={{ bgcolor: "rgba(255, 255, 255, 0.3)", color: "white" }}>
          <AiOutlinePause className="icon" onClick={pauseRecordingAudio} />
        </Avatar>
      ) : !recordingStopped ? (
        <Avatar sx={{ bgcolor: "rgba(255, 255, 255, 0.3)", color: "white" }}>
          <VscDebugContinueSmall
            onClick={continueRecordingAudio}
            className="icon"
          />
        </Avatar>
      ) : (
        ""
      )}
      <div className="audio__record__length">{formatTime(recordingTime)}</div>
      {isRecording ? (
        <Avatar sx={{ bgcolor: "rgba(255, 255, 255, 0.3)", color: "white" }}>
          <BsStopFill className="icon" onClick={stopRecordingAudio} />
        </Avatar>
      ) : (
        ""
      )}
      <Avatar sx={{ bgcolor: "rgba(255, 255, 255, 0.3)", color: "white" }}>
        <TbSend onClick={sendRecordedAudio} className="icon" />
      </Avatar>
    </div>
  );
}

export default RecordAudio;
