import React, { useState, useEffect } from "react";
import "../auth.css";
import { Link, useNavigate } from "react-router-dom";
import client from "../axios-request";

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
      client
        .post("/signup", {
          username: formDetails.username,
          email: formDetails.email,
          password: formDetails.password,
        })
        .then((res) => {
          if ("error" in res.data) {
            //something went wrong at the backend
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
          <h2>Lorem ipsum cit elo dolorrum emosito amet</h2>
          <p>
            Lorem ipsum elor cit doremk ji plocato jdu rty tyi mono gro proco to
            blo mo crudito duid, see how oyhej dyf yryrr rfr yyry ryryr yryg
            gjghg hfhfh fyfyfy fhyfyf
          </p>
        </div>
        <div className="right">
          {registrationStatus ? (
            <div className="msg success">
              <span>Registration successful. Redirecting...</span>
            </div>
          ) : (
            <div
              className={
                "msg error" + (errors.length === 0 ? " hide-error-div" : "")
              }
            >
              {errors.map((item) => (
                <span key={item.id}>{item.errorMessage}</span>
              ))}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="username"
              value={formDetails.username}
              onChange={handleChange}
              name="username"
            />
            <input
              type="email"
              placeholder="email"
              value={formDetails.email}
              name="email"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              placeholder="password"
              value={formDetails.password}
              name="password"
              onChange={handleChange}
            />
            <button disabled={registrationStatus}>SIGNUP</button>
            <span>
              Have an account? <Link to="/login">LOGIN</Link>
            </span>
          </form>
        </div>
      </div>
    );
  }
}

export default Signup;
