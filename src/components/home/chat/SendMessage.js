import React, { useEffect, useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { GrAttachment } from "react-icons/gr";
import { MdKeyboardVoice } from "react-icons/md";
import { TbSend } from "react-icons/tb";
import { client, requestHeaderConfig } from "../../../utils/axios-request";
import { generateUniqueId } from "../utils/functions";

function SendMessage({
  currentChat,
  userDetails,
  setUserDetails,
  socket,
  setMessages,
  setUpdateSideBar,
  setFriendsDetails,
  setErrors,
}) {
  const [message, setMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState(null);

  const sendMessage = (e) => {
    if (e.type === "click" || (e.type === "keypress" && e.key === "Enter")) {
      if (message !== "") {
        setMessage("");
        client
          .post(
            "/sendMessage",
            {
              from: userDetails.userID,
              to: currentChat._id,
              message,
            },
            requestHeaderConfig(userDetails.token)
          )
          .then((res) => {
            if ("error" in res.data) {
              setUserDetails(null);
            } else {
              socket.current.emit("send-message", {
                to: currentChat._id,
                from: userDetails.userID,
                message,
                ...res.data,
              });

              setFriendsDetails((prevVal) => {
                const isAlreadyExist = prevVal.some(
                  (item) => item._id === currentChat._id
                );
                if (!isAlreadyExist) {
                  return [...prevVal, currentChat];
                }
                return prevVal;
              });
              setMessages((prevValue) => [...prevValue, res.data]);
              setUpdateSideBar(true);
            }
          })
          .catch((err) => console.log(err));
      }
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };
  function selectImageForUpload() {
    document.getElementById("file__upload").click();
  }
  function fileOnChange(e) {
    //files without anay of these extension must not reach the server at all cost
    //it'll crash the server
    const supportedFileFormats = {
      audio: [
        "mp3",
        "wav",
        "flac",
        "aac",
        "ogg",
        "wma",
        "m4a",
        "aiff",
        "au",
        "amr",
      ],
      image: ["jpg", "png", "jpeg"],
      video: [
        "mp4",
        "avi",
        "wmv",
        "mov",
        "flv",
        "mkv",
        "mpg",
        "webm",
        "rmvb",
        "m4v",
        "gif",
      ],
      document: ["docx", "pdf"],
    };
    let filesToUpload = [];
    let rejectedFiles = [];
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const split_filename = file.name.split(".");
      const extension = split_filename[split_filename.length - 1];

      if (supportedFileFormats.audio.includes(extension)) {
        if (file.size / 1048576 <= 5) {
          filesToUpload.push(file);
        } else {
          rejectedFiles.push([
            `The file ${file.name} is too large, beyond 5MB`,
          ]);
        }
      } else if (supportedFileFormats.document.includes(extension)) {
        rejectedFiles.push([`The file ${file.name} format is not supported`]);
        // if (file.size / 1048576 <= 5) {
        //   filesToUpload.push(file);
        // } else {
        //   rejectedFiles.push([
        //     `The file ${file.name} is too large, beyond 5MB`,
        //   ]);
        // }
      } else if (supportedFileFormats.image.includes(extension)) {
        if (file.size / 1048576 <= 5) {
          filesToUpload.push(file);
        } else {
          rejectedFiles.push([
            `The file ${file.name} is too large, beyond 5MB`,
          ]);
        }
      } else if (supportedFileFormats.video.includes(extension)) {
        if (file.size / 1048576 <= 10) {
          filesToUpload.push(file);
        } else {
          rejectedFiles.push([
            `The file ${file.name} is too large, beyond 10MB`,
          ]);
        }
      } else {
        rejectedFiles.push([`This file: ${file.name} is not supported`]);
      }
    }
    e.target.value = "";
    if (rejectedFiles.length) {
      setErrors(rejectedFiles);
    }
    if (filesToUpload.length) {
      setUploadedFiles(filesToUpload);
    }
  }
  useEffect(() => {
    if (uploadedFiles) {
      const formData = new FormData();

      for (let i = 0; i < uploadedFiles.length; i++) {
        formData.append("files", uploadedFiles[i]);
      }
      formData.append("from", userDetails.userID);
      formData.append("to", currentChat._id);
      client
        .post("/uploadMultipleFiles", formData, {
          headers: {
            "content-type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (res.data.errors.length) {
            setErrors(res.data.errors);
          }
          if (res.data.uploadedFiles.length) {
            socket.current.emit("sendFileMessage", {
              to: currentChat._id,
              from: userDetails.userID,
              uniqueId: generateUniqueId(),
              uploadedFiles: res.data.uploadedFiles,
            });
            setMessages((prevValue) => [
              ...prevValue,
              ...res.data.uploadedFiles,
            ]);
          }
          setUploadedFiles(null);
        })
        .catch((err) => console.log(err));
    }
  }, [uploadedFiles]);
  return (
    <div className="send-message">
      <input
        type="text"
        placeholder="type a message..."
        name="message"
        value={message}
        onKeyPress={sendMessage}
        onChange={handleInputChange}
      />
      <input
        type="file"
        id="file__upload"
        name="image"
        onChange={fileOnChange}
        multiple
      />
      <div className="right">
        <div className="icon-background">
          <TbSend className="icon" onClick={sendMessage} />
        </div>
        <div className="icon-background">
          <BsEmojiSmile className="icon" />
        </div>
        <div className="icon-background">
          <GrAttachment className="icon" onClick={selectImageForUpload} />
        </div>
        <div className="icon-background">
          <MdKeyboardVoice className="icon" />
        </div>
      </div>
    </div>
  );
}

export default SendMessage;
