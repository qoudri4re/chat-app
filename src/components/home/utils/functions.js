function getWindowSize() {
  const { innerWidth, innerHeight } = window;
  return { innerWidth, innerHeight };
}

/**
 *
 * @returns saved user details or null if it dosen't exist or has expired
 */
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

export {
  retrieveUserDetailsFromLocalStorage,
  getWindowSize,
  saveUserDetailsToLocalStorage,
};
