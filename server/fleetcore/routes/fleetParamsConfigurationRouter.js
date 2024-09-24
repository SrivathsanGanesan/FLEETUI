const express = require("express");
const {
  setGeneralParam,
  setPlannerParam,
  setTaskParam,
  setBatteryParam,
  setCommunicationParam,
} = require("../controllers/configuration/fleetParamsConfiguration");

const fleetParamsConfigurationRouter = express.Router();

fleetParamsConfigurationRouter.post("/general", setGeneralParam);
fleetParamsConfigurationRouter.post("/planner", setPlannerParam);
fleetParamsConfigurationRouter.post("/task", setTaskParam);
fleetParamsConfigurationRouter.post("/battery", setBatteryParam);
fleetParamsConfigurationRouter.post("/communication", setCommunicationParam);

module.exports = fleetParamsConfigurationRouter;
