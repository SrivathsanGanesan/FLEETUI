const express = require("express");
const graphRouter = express.Router();
const {
  getFleetThroughput,
  throughput,
  getFleetStarvation,
  starvationRate,
  getFleetPickAccuracy,
  pickAccuracy,
  getFleetErrRate,
  errRate,
} = require("../controllers/liveStreamController/graphController");

// throughputRouter.get("/:mapId", getFleetThroughput, throughput); // when switch to fleet test..
graphRouter.post("/throughput/:mapId", throughput);
graphRouter.post("/starvationrate/:mapId", starvationRate);
graphRouter.post("/pickaccuracy/:mapId", pickAccuracy);
graphRouter.post("/err-rate/:mapId", errRate);

module.exports = graphRouter;
