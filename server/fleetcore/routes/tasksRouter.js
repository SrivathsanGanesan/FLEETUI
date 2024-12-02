const express = require("express");
const {
  getTasks,
  getCurrTasksActivities,
  getRobotUtilization,
} = require("../controllers/liveStreamController/tasksController");

const tasksRouter = express.Router();
tasksRouter.post("/", getTasks);
tasksRouter.post("/curr-task-activities", getCurrTasksActivities);
tasksRouter.post("/get_robot_utilization",getRobotUtilization) //get robot utilization

module.exports = tasksRouter;
