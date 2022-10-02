import React, { useReducer, useRef, useState } from "react";

function Test() {
  const initialState = {
    count: 0,
  };
  const inputElement = useRef("");
  const [name, setName] = useState("");
  const reducer = (state, action) => {
    switch (action.type) {
      case "increment":
        return { count: state.count + 1 };
      case "decrement":
        return { count: state.count - 1 };
      default:
    }
  };
  function handleChange(e) {
    setName(e.target.value);
    console.log(inputElement);
  }
  function clear() {
    setName("");
  }
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <div>
      <p>first counter: {state.count}</p>
      <button onClick={() => dispatch({ type: "increment" })}>increment</button>
      <button onClick={() => dispatch({ type: "decrement" })}>decrement</button>
      <p>My name is:{name}</p>
      <input
        type="text"
        name="name"
        value={name}
        onChange={handleChange}
        ref={inputElement}
      />
      <button onClick={clear}>reset</button>
    </div>
  );
}
//abort controller useeffect
export default Test;
