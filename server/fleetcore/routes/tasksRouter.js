const express = require("express");
const {
  getFleetTask,
  getTasks,
  getCurrTasksActivities,
} = require("../controllers/liveStreamController/tasksController");

const tasksRouter = express.Router();
// tasksRouter.get("/:mapId", getFleetTask, getTasks);
tasksRouter.post("/", getTasks);
tasksRouter.post("/curr-task-activities", getCurrTasksActivities);

module.exports = tasksRouter;
