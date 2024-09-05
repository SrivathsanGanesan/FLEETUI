const express = require("express");
const {
  getTaskErrLogs,
} = require("../controllers/liveStreamController/errorLogController");

const errLogRouter = express.Router();
errLogRouter.post("/task-logs/:mapId", getTaskErrLogs);

module.exports = errLogRouter;
