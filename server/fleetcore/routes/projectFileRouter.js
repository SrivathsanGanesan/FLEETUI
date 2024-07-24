const express = require("express");
const {
  parseProjectFile,
} = require("../controllers/fileController/projectFileController");
const projectFileRouter = express.Router();
const {
  validateToken,
} = require("../../common/controllers/auth/authController");

projectFileRouter.post("/upload-project", validateToken, parseProjectFile);

module.exports = projectFileRouter;
