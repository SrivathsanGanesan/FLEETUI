const express = require("express");
const {
  getFleetTask,
  getTasks,
} = require("../controllers/liveStreamController/tasksController");

const tasksRouter = express.Router();
// tasksRouter.get("/:mapId", getFleetTask, getTasks);
tasksRouter.post("/:mapId", getTasks);

module.exports = tasksRouter;
