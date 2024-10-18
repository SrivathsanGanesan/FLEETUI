const express = require("express");
const {
  initializeRobo,
  getRoboStateCount,
  getRoboActivities,
  getRoboDetails,
  getRoboPos,
  showSpline,
  enableRobo,
  getLiveRobos,
} = require("../controllers/liveStreamController/telemetryController");

const liveStreamRouter = express.Router();
// liveStreamRouter.get("/live-AMR-pos/:mapId", getAgvTelemetry); // yet to gothrough..
liveStreamRouter.post("/get-fms-amrs", getRoboDetails);
liveStreamRouter.post("/initialize-robot", initializeRobo);
liveStreamRouter.post("/enable-robot", enableRobo);
liveStreamRouter.get("/get-live-robos/:mapId", getLiveRobos);
liveStreamRouter.get("/live-AMR-pos/:mapId", getRoboPos);
liveStreamRouter.post("/get-robos-state/:mapId", getRoboStateCount);
liveStreamRouter.post("/get-robo-activities", getRoboActivities);
liveStreamRouter.post("/show-spline", showSpline);

module.exports = liveStreamRouter;
