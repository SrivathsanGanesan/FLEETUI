const express = require("express");
const { scanIp } = require("../controllers/configuration/fleetConfiguration");
const configurationRouter = express.Router();

configurationRouter.get("/scan-ip", scanIp);

module.exports = configurationRouter;
