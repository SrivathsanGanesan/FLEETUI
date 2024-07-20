const express = require("express");
const { createProject } = require("../controllers/createProject/createProj");
const {
  validateToken,
} = require("../../common/controllers/auth/authController");

const projectRouter = express.Router();
projectRouter.post("/project", validateToken, createProject);

module.exports = projectRouter;
