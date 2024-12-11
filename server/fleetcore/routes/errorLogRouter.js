const express = require("express");
const {
  getTaskErrLogs,
  getRoboErrLogs,
  getFleetErrLogs,
} = require("../controllers/liveStreamController/errorLogController");

const errLogRouter = express.Router();
errLogRouter.post("/task-logs/:mapId", getTaskErrLogs);
errLogRouter.post("/robo-logs/:mapId", getRoboErrLogs);
errLogRouter.post("/fleet-logs/:mapId", getFleetErrLogs);

module.exports = errLogRouter;
