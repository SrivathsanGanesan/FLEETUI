const express = require("express");
const graphRouter = express.Router();
const {
  getFleetThroughput,
  throughput,
  getFleetStarvation,
  starvationRate,
} = require("../controllers/liveStreamController/graphController");

// throughputRouter.get("/:mapId", getFleetThroughput, throughput); // when switch to fleet test..
graphRouter.post("/throughput/:mapId", throughput);
graphRouter.post("/starvationrate/:mapId", starvationRate);

module.exports = graphRouter;
