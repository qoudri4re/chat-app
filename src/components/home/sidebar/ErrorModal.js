import React from "react";
import { v4 as uuidv4 } from "uuid";
import { AiOutlineClose } from "react-icons/ai";

function ErrorModal({ errors, closeErrorModal }) {
  return (
    <div className="create__group__error__modal">
      <span className="cancel">
        <AiOutlineClose onClick={closeErrorModal} />
      </span>
      {errors.map((error) => {
        return <span key={uuidv4()}>{error}</span>;
      })}
    </div>
  );
}

export default ErrorModal;
