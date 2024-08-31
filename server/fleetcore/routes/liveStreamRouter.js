const express = require("express");
const {
  getAgvTelemetry,
} = require("../controllers/liveStreamController/telemetryController");

const liveStreamRouter = express.Router();
liveStreamRouter.post("/live-AMR-pos", getAgvTelemetry);

module.exports = liveStreamRouter;
