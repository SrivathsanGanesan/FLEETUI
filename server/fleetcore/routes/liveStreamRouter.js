const express = require("express");
const {
  initializeRobo,
  getGrossTaskStatus,
  getRoboStateCount,
  getRoboActivities,
  getRoboDetails,
  getRoboPos,
  showSpline,
  enableRobo,
} = require("../controllers/liveStreamController/telemetryController");

const liveStreamRouter = express.Router();
// liveStreamRouter.get("/live-AMR-pos/:mapId", getAgvTelemetry); // yet to gothrough..
liveStreamRouter.get("/live-AMR-pos/:mapId", getRoboPos);
liveStreamRouter.post("/get-tasks-status/:mapId", getGrossTaskStatus);
liveStreamRouter.post("/get-robos-state/:mapId", getRoboStateCount);
liveStreamRouter.post("/get-robo-activities", getRoboActivities);
liveStreamRouter.post("/initialize-robot", initializeRobo);
liveStreamRouter.post("/get-fms-amrs", getRoboDetails);
liveStreamRouter.post("/show-spline", showSpline);
liveStreamRouter.post("/enable-robot", enableRobo);

module.exports = liveStreamRouter;
