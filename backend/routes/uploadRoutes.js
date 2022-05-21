import express from "express";
import path from "path";
import multer from "multer";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const checkFileType = (file, cb) => {
  const filetypes = /jpg|jpeg|png/;
  const extensionName = filetypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = filetypes.test(file.mimetype);

  if (extensionName && mimeType) {
    return cb(null, true);
  } else {
    cb("Images only!");
  }
};

// middleware
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post("/", upload.single("image"), (req, res) => {
  res.send(`/${req.file.path}`);
});

export default router;
