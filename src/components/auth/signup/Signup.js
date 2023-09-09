import React, { useState, useEffect } from "react";
import "../auth.css";
import "./signup.css";
import { Link, useNavigate } from "react-router-dom";
import { client } from "../../../utils/axios-request";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { FaUser, FaLock } from "react-icons/fa";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

import {
  retrieveUserDetailsFromLocalStorage,
  setErrorAndFilter,
  saveUserDetailsToLocalStorage,
} from "../utils/functions";

function Signup() {
  let navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    setUserDetails(retrieveUserDetailsFromLocalStorage());
  }, []);

  useEffect(() => {
    if (userDetails) {
      navigate("/");
    }
  }, [navigate, userDetails]);

  useEffect(() => {});
  const [formDetails, setFormDetails] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState([]);
  const [registrationStatus, setRegistrationStatus] = useState(false);
  const [displayLoaderAfterSubmiting, setDisplayLoadAfterSubmiting] =
    useState(false);

  //handle onchange event
  const handleChange = (e) => {
    setFormDetails({ ...formDetails, [e.target.name]: e.target.value });
  };

  //handle submit event
  const handleSubmit = (e) => {
    e.preventDefault();
    let errorCount = 0;
    if (
      formDetails.email === "" ||
      formDetails.password === "" ||
      formDetails.username === ""
    ) {
      errorCount += 1;
      setErrorAndFilter("blank-field", "All fields must be filled!", setErrors);
    } else {
      if (formDetails.username.length > 20) {
        errorCount += 1;
        setErrorAndFilter(
          "usernameError",
          "Username must be less than 20 characters",
          setErrors
        );
      } else {
        //removing the error from the array, if it's there
        setErrors((preVal) =>
          preVal.filter((item) => item.errorType !== "usernameError")
        );
      }
      if (formDetails.password.length < 8) {
        errorCount += 1;
        setErrorAndFilter(
          "passwordError",
          "Password must be 8 characters or more",
          setErrors
        );
      } else {
        setErrors((preVal) =>
          preVal.filter((item) => item.errorType !== "passwordError")
        );
      }
    }
    if (errorCount === 0) {
      //safe to send request to backend
      setDisplayLoadAfterSubmiting(true);
      client
        .post("/signup", {
          username: formDetails.username,
          email: formDetails.email,
          password: formDetails.password,
        })
        .then((res) => {
          if ("error" in res.data) {
            //something went wrong at the backend
            setDisplayLoadAfterSubmiting(false);
            let errorTypes = ["emailExist", "usernameExist", "serverError"];
            //remove previous errors
            setErrors((preVal) =>
              preVal.filter((item) => errorTypes.indexOf(item.errorType) === -1)
            );
            res.data.error.map((item) => {
              setErrorAndFilter(item.errorType, item.errorMessage, setErrors);
              return item;
            });
          } else {
            //everything is ok
            setDisplayLoadAfterSubmiting(false);
            setRegistrationStatus(true);
            //saved recieved details into local storage
            saveUserDetailsToLocalStorage(res.data, 3600000);
            //redirect to home page
            setTimeout(() => navigate("/"), 1000);
          }
        })
        .catch((err) => console.log(err));
    }
  };
  if (!userDetails) {
    return (
      <div className="signup form-container">
        <div className="left">
          <h2>Welcome to Chat App!</h2>
          <p>
            Login or sign up to start chatting with your friends, family, and
            colleagues. Stay connected and never miss a conversation. Join now!
          </p>
        </div>
        <div className="right">
          {
            <div
              className={
                "msg error" + (errors.length === 0 ? " hide-error-div" : "")
              }
            >
              {errors.map((item) => (
                <Alert variant="filled" severity="error" key={item.id}>
                  {item.errorMessage}
                </Alert>
              ))}
            </div>
          }
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="username"
              value={formDetails.username}
              onChange={handleChange}
              name="username"
            />
            <FaUser className="user__icon icon" />
            <input
              type="email"
              placeholder="email"
              value={formDetails.email}
              name="email"
              onChange={handleChange}
              required
            />
            <MdOutlineAlternateEmail className="email__icon icon" />
            <input
              type="password"
              placeholder="password"
              value={formDetails.password}
              name="password"
              onChange={handleChange}
            />
            <FaLock className="lock__icon icon" />
            <button disabled={registrationStatus}>
              {displayLoaderAfterSubmiting ? (
                <Box sx={{ display: "flex" }}>
                  <CircularProgress />
                </Box>
              ) : (
                "SIGNUP"
              )}
            </button>
            <span className="text">
              Have an account?{" "}
              <Link to="/login">
                <span>LOGIN</span>
              </Link>
            </span>
          </form>
        </div>
      </div>
    );
  }
}

export default Signup;
