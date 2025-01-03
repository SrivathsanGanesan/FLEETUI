const express = require("express");
const {
  initializeRobo,
  getRoboStateCount,
  getRoboDetails,
  getRoboPos,
  getAsserts,
  sendTasks,
  getRabbitmqStatus,
  showSpline,
  enableRobo,
  getLiveRobos,
  getFleetStatus,
} = require("../controllers/liveStreamController/telemetryController");

const liveStreamRouter = express.Router();
// liveStreamRouter.get("/live-AMR-pos/:mapId", getAgvTelemetry); // yet to gothrough..
liveStreamRouter.post("/get-fms-amrs", getRoboDetails);
liveStreamRouter.post("/initialize-robot", initializeRobo);
liveStreamRouter.post("/enable-robot", enableRobo);
liveStreamRouter.get("/get-live-robos/:mapId", getLiveRobos);
liveStreamRouter.get("/live-AMR-pos/:mapId", getRoboPos);
liveStreamRouter.get("/live-assets/:mapId", getAsserts);
liveStreamRouter.post("/send-task/:mapId", sendTasks);
liveStreamRouter.get("/rabbitmq-status/:projId", getRabbitmqStatus);
liveStreamRouter.post("/show-spline", showSpline);
liveStreamRouter.post("/get-robos-state/:mapId", getRoboStateCount);
liveStreamRouter.get("/get-fleet-status", getFleetStatus);

module.exports = liveStreamRouter;
