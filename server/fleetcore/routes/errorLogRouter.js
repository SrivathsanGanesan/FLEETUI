const express = require("express");
const {
  getFleetTaskErrLogs,
  getTaskErrLogs,
  getFleetRoboErrLogs,
  getRoboErrLogs,
} = require("../controllers/liveStreamController/errorLogController");

const errLogRouter = express.Router();
errLogRouter.post("/task-logs/:mapId", getTaskErrLogs);
errLogRouter.post("/robo-logs/:mapId", getRoboErrLogs);

module.exports = errLogRouter;
