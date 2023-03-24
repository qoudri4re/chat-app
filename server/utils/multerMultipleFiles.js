const multer = require("multer");
const path = require("path");

const extensions = [
  ".mp3",
  ".wav",
  ".flac",
  ".aac",
  ".ogg",
  ".wma",
  ".m4a",
  ".aiff",
  ".au",
  ".amr",
  ".jpg",
  ".png",
  ".jpeg",
  ".mp4",
  ".avi",
  ".wmv",
  ".mov",
  ".flv",
  ".mkv",
  ".mpg",
  ".webm",
  ".rmvb",
  ".m4v",
  ".docx",
  ".pdf",
  ".gif",
];
module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (!extensions.includes(ext)) {
      return cb(new Error("File type is not supported", false));
    }
    cb(null, true);
  },
}).array("files", [5]);
