const express = require("express");
const graphRouter = express.Router();
const {
  // getFleetThroughput,
  throughput,
  starvationRate,
  pickAccuracy,
  errRate,
  getCpuUtilization,
  getRoboUtilization,
  getBatteryStat,
  getMemoryStat,
  getNetworkStat,
  getIdleTime,
  getRoboErr,
  throughPut_starvation,
  throughPut_pickAccuracy,
  throughPut_errorRate
} = require("../controllers/liveStreamController/graphController");

// throughputRouter.get("/:mapId", getFleetThroughput, throughput); // when switch to fleet test..
graphRouter.post("/throughput/:mapId", throughput);
graphRouter.post("/starvationrate/:mapId",  throughPut_starvation);
graphRouter.post("/pickaccuracy/:mapId", throughPut_pickAccuracy);
graphRouter.post("/err-rate/:mapId", throughPut_errorRate);

// robo graph..
graphRouter.post("/cpu-utilization/:mapId", getCpuUtilization);
graphRouter.post("/robo-utilization/:mapId", getRoboUtilization);
graphRouter.post("/battery/:mapId", getBatteryStat);
graphRouter.post("/memory/:mapId", getMemoryStat);
graphRouter.post("/network/:mapId", getNetworkStat);
graphRouter.post("/idle-time/:mapId", getIdleTime);
graphRouter.post("/robo-err/:mapId", getRoboErr);

module.exports = graphRouter;
