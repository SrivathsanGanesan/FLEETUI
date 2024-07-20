const express = require("express");
const {
  createProject,
} = require("../controllers/projectController/createProjController");
const {
  getProject,
} = require("../controllers/projectController/getProjectController");
const {
  validateToken,
} = require("../../common/controllers/auth/authController");

const projectRouter = express.Router();
projectRouter.post("/project", validateToken, createProject);
projectRouter.get("/:projectName", validateToken, getProject);

module.exports = projectRouter;
