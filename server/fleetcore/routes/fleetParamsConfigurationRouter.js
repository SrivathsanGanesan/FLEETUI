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
fleetParamsConfigurationRouter.post("/planner", setGeneralParam);
fleetParamsConfigurationRouter.post("/task", setGeneralParam);
fleetParamsConfigurationRouter.post("/battery", setGeneralParam);
fleetParamsConfigurationRouter.post("/communication", setGeneralParam);

module.exports = fleetParamsConfigurationRouter;
