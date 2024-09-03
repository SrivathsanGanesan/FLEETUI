const express = require("express");
const throughputRouter = express.Router();
const {
  getFleetThroughput,
  throughput,
} = require("./../controllers/liveStreamController/graphController");

// throughputRouter.get("/:mapId", getFleetThroughput, throughput); // when switch to fleet test..
throughputRouter.get("/:mapId", throughput);

module.exports = throughputRouter;
