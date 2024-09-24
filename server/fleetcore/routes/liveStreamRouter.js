const express = require("express");
const {
  getAgvTelemetry,
  getGrossTaskStatus,
  getRoboStateCount,
  getRoboActivities,
  getRoboFactSheet,
  getRoboDetails,
  getRoboPos,
} = require("../controllers/liveStreamController/telemetryController");

const liveStreamRouter = express.Router();
// liveStreamRouter.get("/live-AMR-pos/:mapId", getAgvTelemetry); // yet to gothrough..
liveStreamRouter.get("/live-AMR-pos/:mapId", getRoboPos);
liveStreamRouter.post("/get-tasks-status/:mapId", getGrossTaskStatus);
liveStreamRouter.post("/get-robos-state/:mapId", getRoboStateCount);
liveStreamRouter.post("/get-robo-activities", getRoboActivities);
liveStreamRouter.post("/get-fms-amrs", getRoboDetails);

module.exports = liveStreamRouter;
