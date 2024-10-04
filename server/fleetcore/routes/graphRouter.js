const express = require("express");
const graphRouter = express.Router();
const {
  // getFleetThroughput,
  throughput,
  getFleetStarvation,
  starvationRate,
  getFleetPickAccuracy,
  pickAccuracy,
  getFleetErrRate,
  errRate,
  getRoboFleetGraph,
  getCpuUtilization,
  getRoboUtilization,
  getBatteryStat,
  getMemoryStat,
  getNetworkStat,
  getIdleTime,
  getRoboErr,
} = require("../controllers/liveStreamController/graphController");

// throughputRouter.get("/:mapId", getFleetThroughput, throughput); // when switch to fleet test..
graphRouter.post("/throughput/:mapId", throughput);
graphRouter.post("/starvationrate/:mapId", starvationRate);
graphRouter.post("/pickaccuracy/:mapId", pickAccuracy);
graphRouter.post("/err-rate/:mapId", errRate);

// robo graph..
graphRouter.post("/cpu-utilization/:mapId", getCpuUtilization);
graphRouter.post("/robo-utilization/:mapId", getRoboUtilization);
graphRouter.post("/battery/:mapId", getBatteryStat);
graphRouter.post("/memory/:mapId", getMemoryStat);
graphRouter.post("/network/:mapId", getNetworkStat);
graphRouter.post("/idle-time/:mapId", getIdleTime);
graphRouter.post("/robo-err/:mapId", getRoboErr);

module.exports = graphRouter;
