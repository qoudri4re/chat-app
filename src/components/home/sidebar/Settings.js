import React, { useEffect, useState } from "react";
import { BiCamera } from "react-icons/bi";
import image from "./chatlist/default-image.jpg";
import { client, requestHeaderConfig } from "../../../utils/axios-request";
import { v4 as uuidv4 } from "uuid";
import { saveUserDetailsToLocalStorage } from "../../auth/utils/functions";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

function Settings({ showOrCloseSettings, userDetails, setUserDetails }) {
  const [userInfo, setUserInfo] = useState(null);
  const [newDetails, setNewDetails] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [errors, setErrors] = useState([]);
  const [updateStatus, setUpdateStatus] = useState(false);
  const [displayLoader, setDisplayLoader] = useState(false);
  const [showUploadButton, setShowUploadButton] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchUserDetails = () => {
      client
        .get(`/${userDetails.userID}`, requestHeaderConfig(userDetails.token))
        .then((res) => {
          if ("error" in res) {
            setUserDetails(null);
          } else if ("tokenError" in res.data) {
            setUserDetails(null);
          } else {
            setUserInfo(res.data);
          }
        })
        .catch((error) => console.log(error));
    };
    fetchUserDetails();
  }, [userDetails, setUserDetails]);

  useEffect(() => {
    if (updateStatus) {
      setTimeout(() => {
        setUpdateStatus(false);
      }, 3000);
    }
  }, [updateStatus]);

  useEffect(() => {
    if (errors.length) {
      setTimeout(() => {
        setErrors([]);
      }, 3000);
    }
  }, [errors]);

  function update() {
    setDisplayLoader(true);
    setUpdateStatus(false);
    setErrors([]);
    const dataToSend = {
      username: {
        value: newDetails.username,
        changed:
          newDetails.username === "" ||
          newDetails.username === userInfo.username
            ? false
            : true,
      },
      email: {
        value: newDetails.email,
        changed:
          newDetails.email === "" || newDetails.email === userInfo.email
            ? false
            : true,
      },
      password: {
        value: newDetails.password,
        changed:
          newDetails.password === "" ||
          newDetails.password === userInfo.password
            ? false
            : true,
      },
      userID: userInfo._id,
    };
    client
      .post("/update-user", dataToSend, requestHeaderConfig(userDetails.token))
      .then((res) => {
        if ("tokenError" in res.data) {
          setDisplayLoader(false);
        } else if ("existErrors" in res.data) {
          setDisplayLoader(false);
          setErrors([...res.data.existErrors]);
        } else if ("serverError" in res.data) {
          setDisplayLoader(false);
          setErrors([...res.data.serverError]);
        } else {
          saveUserDetailsToLocalStorage(res.data);
          setUserDetails(res.data);
          setDisplayLoader(false);
          setUpdateStatus(true);
          setButtonDisabled(true);
        }
      })
      .catch((err) => console.log(err));
  }
  function handleOnchange(e) {
    let changes = [];
    setNewDetails({ ...newDetails, [e.target.name]: e.target.value });
    if (e.target.name === "username") {
      if (
        (e.target.value !== userInfo.username && e.target.value !== "") ||
        (newDetails.email !== "" && newDetails.email !== userInfo.email) ||
        (newDetails.password !== "" &&
          newDetails.password !== userInfo.password)
      ) {
        changes.push(true);
      }
    }
    if (e.target.name === "email") {
      if (
        (e.target.value !== userInfo.email && e.target.value !== "") ||
        (newDetails.password !== "" &&
          newDetails.password !== userInfo.password) ||
        (newDetails.username !== "" &&
          newDetails.username !== userInfo.username)
      ) {
        changes.push(true);
      }
    }
    if (e.target.name === "password") {
      if (
        (e.target.value !== userInfo.password && e.target.value !== "") ||
        (newDetails.username !== "" &&
          newDetails.username !== userInfo.username) ||
        (newDetails.email !== "" && newDetails.email !== userInfo.email)
      ) {
        changes.push(true);
      }
    }

    if (changes.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }
  function clickFileUploadInput() {
    document.getElementById("upload").click();
  }
  function fileOnchange(e) {
    if (e.target.length !== 0) {
      const split_filename = e.target.files[0].name.split(".");
      const extension = split_filename[split_filename.length - 1];
      if (extension !== "jpg" && extension !== "png" && extension !== "jpeg") {
        e.target.value = "";
        setErrors(["please upload an image file"]);
      } else {
        setShowUploadButton(true);
        setUploadedImage(e.target.files[0]);
        document.getElementById("image").style.width = "147px";
        document.getElementById("image").style.height = "147px";
      }
    }
  }
  function upload() {
    setDisplayLoader(true);
    client
      .post(
        "/upload",
        { image: uploadedImage, userID: userDetails.userID },
        {
          headers: {
            "content-type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        if ("error" in res.data) {
          setDisplayLoader(false);
          setUpdateStatus(false);
          setErrors(["something went wrong please try again"]);
        } else if ("tokenError" in res.data) {
          setDisplayLoader(false);
          setUserDetails(null);
        } else {
          setDisplayLoader(false);
          setUpdateStatus(true);
          setShowUploadButton(false);
        }
      })
      .catch((err) => {
        setDisplayLoader(false);
        setErrors("something went wrong, please try again");
      });
  }
  if (userInfo) {
    return (
      <div className="settings">
        {updateStatus ? (
          <Alert variant="filled" className="msg" severity="success">
            Updated!
          </Alert>
        ) : errors.length > 0 ? (
          <Alert variant="filled" className="msg" severity="error">
            {errors.map((item) => (
              <span key={uuidv4()}>{item}</span>
            ))}
          </Alert>
        ) : (
          ""
        )}

        <div className="settings-header">
          <MdCancel onClick={showOrCloseSettings} className="icon" />
        </div>
        <div className="upload-image">
          {!uploadedImage ? (
            userInfo.profile_img !== "default-image" ? (
              <img
                src={userInfo.profile_img}
                alt=""
                onLoad={() => setImageLoaded(true)}
                className="hidden-image"
              />
            ) : (
              ""
            )
          ) : (
            ""
          )}
          <img
            src={
              uploadedImage
                ? URL.createObjectURL(uploadedImage)
                : userInfo.profile_img !== "default-image"
                ? imageLoaded
                  ? userInfo.profile_img
                  : image
                : image
            }
            alt=""
            id="image"
            width="147"
            height="147"
          />
          <form>
            <input
              type="file"
              id="upload"
              name="image"
              onChange={fileOnchange}
            />
          </form>
          <Avatar className="icon">
            {showUploadButton ? (
              <AiOutlineCloudUpload onClick={upload} />
            ) : (
              <BiCamera onClick={clickFileUploadInput} />
            )}
          </Avatar>
        </div>
        <div className="form-row">
          <p>Username</p>
          <input
            type="text"
            defaultValue={userInfo.username || ""}
            onChange={handleOnchange}
            name="username"
          />
        </div>
        <div className="form-row">
          <p>Email</p>
          <input
            type="email"
            defaultValue={userInfo.email || ""}
            onChange={handleOnchange}
            name="email"
          />
        </div>
        <div className="form-row">
          <p>Password</p>
          <input
            type="password"
            defaultValue={userInfo.password || ""}
            onChange={handleOnchange}
            name="password"
          />
        </div>
        <button disabled={buttonDisabled} onClick={update}>
          {displayLoader ? <CircularProgress /> : "Save changes"}
        </button>
      </div>
    );
  } else {
    return (
      <div className="loading-wave">
        <CircularProgress />
      </div>
    );
  }
}

export default Settings;
