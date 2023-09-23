import Alert from "@mui/material/Alert";
import React from "react";
import { generateUniqueId } from "../utils/functions";

function ErrorModal({ errors, closeChatErrorModal }) {
  return (
    <div className="chat__error__modal">
      <Alert variant="filled" severity="error">
        {errors.map((item) => {
          let uniqueId = generateUniqueId();
          return <span key={uniqueId}>{item}</span>;
        })}
      </Alert>
    </div>
  );
}

export default ErrorModal;
