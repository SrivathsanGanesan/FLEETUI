const express = require("express");
const { createProject } = require("../controllers/createProject/createProj");

const projectRouter = express.Router();
projectRouter.post("/project", createProject);

module.exports = projectRouter;
