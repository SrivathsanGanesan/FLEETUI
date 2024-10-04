const express = require("express");
const {
  getTasks,
  getCurrTasksActivities,
} = require("../controllers/liveStreamController/tasksController");

const tasksRouter = express.Router();
tasksRouter.post("/", getTasks);
tasksRouter.post("/curr-task-activities", getCurrTasksActivities);

module.exports = tasksRouter;
