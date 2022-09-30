import React from "react";
import "./login.css";

function Login() {
  return (
    <div className="login">
      <form>
        <input type="text" placeholder="username" />
        <input type="password" placeholder="password" />
        <button>Login</button>
      </form>
    </div>
  );
}

export default Login;
