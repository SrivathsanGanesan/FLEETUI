const express = require("express");
const {
  systemThroughput,
  systemUptime,
  successRate,
  systemResponsiveness,
  getAverageSpeed,
  getTotalDistance,
  getRoboUtilization,
  getNetworkConnection,
} = require("../controllers/configuration/fleetGrossStatus");

const fleetGrossStatusRouter = express.Router();

// operation part..
fleetGrossStatusRouter.post("/system-throughput", systemThroughput);
fleetGrossStatusRouter.post("/system-uptime", systemUptime);
fleetGrossStatusRouter.post("/success-rate", successRate);
fleetGrossStatusRouter.post("/system-responsiveness", systemResponsiveness);

// robo part..
fleetGrossStatusRouter.post("/average-speed", getAverageSpeed);
fleetGrossStatusRouter.post("/total-distance", getTotalDistance);
fleetGrossStatusRouter.post("/robo-util", getRoboUtilization);
fleetGrossStatusRouter.post("/network-conn", getNetworkConnection);

module.exports = fleetGrossStatusRouter;
