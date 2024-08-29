const express = require("express");
const trackMapFleetRouter = express.Router();
const {
  startFleetLogTime,
  stopFleetLogTime,
} = require("../controllers/trackMapFleetController");

trackMapFleetRouter.post("/start-FleetLog-time", startFleetLogTime);
trackMapFleetRouter.post("/stop-FleetLog-time", stopFleetLogTime);

module.exports = trackMapFleetRouter;
