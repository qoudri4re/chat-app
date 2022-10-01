import React, { useState } from "react";
import "./login.css";
import { Link } from "react-router-dom";
const functions = require("../utils/functions");

function Login() {
  const [formDetails, setFormDetails] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState([]);

  //handle onchange event
  const handleChange = (e) => {
    setFormDetails({ ...formDetails, [e.target.name]: e.target.value });
  };

  //handle the submit event
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formDetails.username === "" || formDetails.password === "") {
      functions.setErrorAndFilter(
        "blank-field",
        "All fields must be filled!",
        setErrors
      );
    } else {
      console.log("all good");
    }
  };
  return (
    <div className="login">
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
            name="username"
            onChange={handleChange}
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
            Don't have an account?
            <Link to="/signup">SIGNUP</Link>
          </span>
        </form>
      </div>
    </div>
  );
}

export default Login;
