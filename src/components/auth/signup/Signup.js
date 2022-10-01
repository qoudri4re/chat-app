import React, { useState } from "react";
import "./signup.css";
import { Link } from "react-router-dom";
const functions = require("../utils/functions");

function Signup() {
  const [formDetails, setFormDetails] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState([]);

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
      functions.setErrorAndFilter(
        "blank-field",
        "All fields must be filled!",
        setErrors
      );
    } else {
      if (formDetails.username.length > 20) {
        errorCount += 1;
        functions.setErrorAndFilter(
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
        functions.setErrorAndFilter(
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
      console.log("all goood");
    }
  };
  return (
    <div className="signup">
      <div className="left">
        <h2>Lorem ipsum cit elo dolorrum emosito amet</h2>
        <p>
          Lorem ipsum elor cit doremk ji plocato jdu rty tyi mono gro proco to
          blo mo crudito duid, see how oyhej dyf yryrr rfr yyry ryryr yryg gjghg
          hfhfh fyfyfy fhyfyf
        </p>
      </div>
      <div className="right">
        <div
          className={
            "error-msg" + (errors.length === 0 ? " hide-error-div" : "")
          }
        >
          {errors.map((item) => (
            <span key={item.id}>{item.errorMessage}</span>
          ))}
        </div>
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
          <button>LOGIN</button>
          <span>
            Have an account? <Link to="/login">LOGIN</Link>
          </span>
        </form>
      </div>
    </div>
  );
}

export default Signup;
