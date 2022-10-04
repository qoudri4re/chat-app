import { v4 as uuidv4 } from "uuid";

/**
 * sets error and filters out redundant error messages
 * @param {string} errorType
 * @param {string} errorMessage
 * @param {setState} setErrors
 */
const setErrorAndFilter = (errorType, errorMessage, setErrors) => {
  setErrors((prevVal) => {
    //filter out redundant error message
    const newVal = prevVal.filter((item) => {
      return item.errorType !== errorType;
    });
    return [
      ...newVal,
      {
        id: uuidv4(),
        errorType: errorType,
        errorMessage: errorMessage,
      },
    ];
  });
};

/**
 * saves user details {username, id, auth token} to local storage
 * @param {*} userDetails -> the details to save
 * @param {*} timeToLive -> expiry time
 */
function saveUserDetailsToLocalStorage(userDetails, timeToLive) {
  const itemToSave = {
    ...userDetails,
    expiry: new Date().getTime() + timeToLive,
  };
  localStorage.setItem("userDetails", JSON.stringify(itemToSave));
}

function retrieveUserDetailsFromLocalStorage() {
  const userDetailsStr = localStorage.getItem("userDetails");

  //if the item dosen't exist
  if (!userDetailsStr) {
    return null;
  }

  const userDetails = JSON.parse(userDetailsStr);
  const now = new Date();

  if (now.getTime() >= userDetails.expiry) {
    //details has expired
    localStorage.removeItem("userDetails");
    return null;
  }
  return userDetails;
}

export {
  setErrorAndFilter,
  saveUserDetailsToLocalStorage,
  retrieveUserDetailsFromLocalStorage,
};
