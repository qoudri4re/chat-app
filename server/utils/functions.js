/**
 * Intercepts requests on specified endpoints.
 * checks the jwt token on request headers, then sets req.token.
 * Token format -> Authorization <jwt token>
 */
function verifyHeaderToken(req, res, next) {
  //get the auth header value
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const jwtToken = bearer[1];
    req.token = jwtToken;
    next();
  } else {
    res.send({ tokenError: "invalid request header token" });
  }
}

function formatDateTime(dateTime) {
  let amOrPm;
  let hours;
  let minutes =
    dateTime.getMinutes() > 9
      ? dateTime.getMinutes()
      : `0${dateTime.getMinutes()}`;
  if (dateTime.getHours() >= 12) {
    amOrPm = "pm";
    hours = dateTime.getHours() - 12;
  } else {
    amOrPm = "am";
    hours = dateTime.getHours();
  }

  return `${hours}:${minutes} ${amOrPm}`;
}

const supportedFileFormats = {
  audio: [
    "mp3",
    "wav",
    "flac",
    "aac",
    "ogg",
    "wma",
    "m4a",
    "aiff",
    "au",
    "amr",
  ],
  image: ["jpg", "png", "jpeg"],
  video: [
    "mp4",
    "avi",
    "wmv",
    "mov",
    "flv",
    "mkv",
    "mpg",
    "webm",
    "rmvb",
    "m4v",
  ],
  document: ["docx", "pdf"],
};

module.exports = { verifyHeaderToken, formatDateTime, supportedFileFormats };
