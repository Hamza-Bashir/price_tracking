const multer = require("multer")
const path = require("path")


const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, "uploads/")
    },
    filename:(req,file,cb)=>{
        const ext = path.extname(file.originalname)
        const filename = `${Date.now()} - ${ext}`
        cb(null, filename)
    }
})

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPEG/PNG allowed."), false);
    }
  };


const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 1024 * 1024 * 2, // 2MB limit
    },
  });
  
module.exports = upload;