import multer from "multer";
import path from "path";

// Define your file size limit in bytes
const FILE_SIZE_LIMIT = 2 * 1024 * 1024 * 1024; // 2 GB in bytes

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    const fileName = path.basename(file.originalname, extension);
    cb(null, `${fileName}${extension}`);
  },
});

// Configure Multer with the file size limit and proper error handling
export const upload = multer({
  storage,
  limits: {
    fileSize: FILE_SIZE_LIMIT, // File size limit (2GB in bytes)  
  },
});
