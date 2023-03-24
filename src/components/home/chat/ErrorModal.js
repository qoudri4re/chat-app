import React from "react";
import { GrClose } from "react-icons/gr";
import { generateUniqueId } from "../utils/functions";

function ErrorModal({ errors, closeChatErrorModal }) {
  return (
    <div className="chat__error__modal">
      <span className="close__icon">
        <GrClose onClick={closeChatErrorModal} />
      </span>
      {errors.map((item) => {
        let uniqueId = generateUniqueId();
        return <span key={uniqueId}>{item}</span>;
      })}
    </div>
  );
}

export default ErrorModal;
