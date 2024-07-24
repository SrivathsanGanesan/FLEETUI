const express = require("express");
const multer = require("multer");
const {
  parseProjectFile,
} = require("../controllers/fileController/projectFileController");
const projectFileRouter = express.Router();
const {
  validateToken,
} = require("../../common/controllers/auth/authController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "proj_assets/projectFile");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

projectFileRouter.post(
  "/upload-project",
  validateToken,
  upload.single("projFile"),
  parseProjectFile
);

module.exports = projectFileRouter;
