const express = require("express");
const {
  getFleetTaskErrLogs,
  getTaskErrLogs,
  getFleetRoboErrLogs,
  getRoboErrLogs,
  getFleetCoreErrLogs,
  getFleetErrLogs,
  getTaskError
} = require("../controllers/liveStreamController/errorLogController");

const errLogRouter = express.Router();
errLogRouter.post("/task-logs/:mapId", getTaskErrLogs);
errLogRouter.post("/robo-logs/:mapId", getRoboErrLogs);
errLogRouter.post("/fleet-logs/:mapId", getFleetErrLogs);
errLogRouter.post("/task-error-log",getTaskError)

module.exports = errLogRouter;
