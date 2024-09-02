const express = require("express");
const throughputRouter = express.Router();
const {
  throughput,
} = require("./../controllers/liveStreamController/graphController");

throughputRouter.get("/:mapId", throughput);

module.exports = throughputRouter;
