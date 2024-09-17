const express = require("express");
const {
  getAgvTelemetry,
  getGrossTaskStatus,
} = require("../controllers/liveStreamController/telemetryController");

const liveStreamRouter = express.Router();
liveStreamRouter.get("/live-AMR-pos/:mapId", getAgvTelemetry);
liveStreamRouter.post("/get-tasks-status/:mapId", getGrossTaskStatus);

module.exports = liveStreamRouter;
