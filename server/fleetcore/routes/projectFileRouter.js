const express = require("express");
const {
  parseProjectFile,
} = require("../controllers/fileController/projectFileController");
const projectFileRouter = express.Router();

projectFileRouter.post("/import-project", parseProjectFile);

module.exports = projectFileRouter;
