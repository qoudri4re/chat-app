import Home from "./components/home/Home";
import "./app.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/auth/login/Login";
import Signup from "./components/auth/signup/Signup";
import Test from "./components/tests/Test";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
