import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      const name = file.originalname;
      cb(null, name);
    }
  })
  
export const upload = multer({ 
    storage,
    limits: {
      fileSize: 100000000, // File size limit (100MB in bytes)
    },
 })