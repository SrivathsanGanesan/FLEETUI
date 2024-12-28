const { Map, Robo } = require("../../../application/models/mapSchema");
const { projectModel, siteModel } = require("../../models/projectSchema");
const convert = require("xml-js");
 
const getFleetSeriesData = async (FleetMode, ServerIP, ServerPort, MongodbIP, MongoDatabaseName, endpoint) => {
  console.log("fleet data",FleetMode, ServerIP, ServerPort, MongodbIP, MongoDatabaseName, endpoint)
  let response = await fetch(
    `http://${process.env.FLEET_SERVER}:${process.env.FLEET_PORT}/fms/amr/${endpoint}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic cm9vdDp0b29y",
      },
      body: JSON.stringify({FleetMode:FleetMode, ServerIP:ServerIP, ServerPort:ServerPort, MongodbIP:MongodbIP, MongoDatabaseName:MongoDatabaseName}),
    }
  );
  return await response.json();
};
 
const setGeneralParam = async (req, res) => {
  const { projectId, generalParams } = req.body;
  try {
    const isProjExist = await projectModel.findOne({ _id: projectId });
    if (!isProjExist)
      return res.status(422).json({ project: null, msg: "project not found" });
    let updatedProj = await projectModel.findOneAndUpdate(
      { _id: projectId },
      {
        $set: { "fleetParams.General": generalParams },
      },
      { new: true }
    );
    if (!updatedProj)
      return res
        .status(500)
        .json({ isSet: false, project: null, msg: "project not updated..!" });
   
    let fleetGeneral = await getFleetSeriesData(
      updatedProj['fleetParams']['General']['fleetServerMode'],
      updatedProj['fleetParams']['General']['serverIP'],
      updatedProj['fleetParams']['General']['serverPort'],
      updatedProj['fleetParams']['General']['databaseIp'],
      updatedProj['fleetParams']['General']['databaseName'],
      "FMS_Data"
      );
      
    return res.status(200).json({
      isSet: true,
      msg: "data sent",
      project: updatedProj,
    });
  } catch (error) {
    console.error("Error in taskLogs:", error);
    if (error.name === "CastError")
      return res.status(400).json({ msg: "not valid map Id" });
    res
      .status(500)
      .json({ error: error.message, msg: "Internal Server Error" });
  }
};
 
const setPlannerParam = async (req, res) => {
  const { projectId, plannerParams } = req.body;
  try {
    const isProjExist = await projectModel.findOne({ _id: projectId });
    if (!isProjExist)
      return res.status(422).json({ project: null, msg: "project not found" });
    let updatedProj = await projectModel.findOneAndUpdate(
      { _id: projectId },
      {
        $set: { "fleetParams.Planner": plannerParams },
      },
      { new: true }
    );
    if (!updatedProj)
      return res
        .status(500)
        .json({ isSet: false, project: null, msg: "project not updated..!" });
    return res.status(200).json({
      isSet: true,
      msg: "data sent",
      map: true,
    });
  } catch (error) {
    console.error("Error in taskLogs:", error);
    if (error.name === "CastError")
      return res.status(400).json({ msg: "not valid map Id" });
    res
      .status(500)
      .json({ error: error.message, msg: "Internal Server Error" });
  }
};
 
const setTaskParam = async (req, res) => {
  const { projectId, taskParams } = req.body;
  try {
    const isProjExist = await projectModel.findOne({ _id: projectId });
    if (!isProjExist)
      return res.status(422).json({ project: null, msg: "project not found" });
    let updatedProj = await projectModel.findOneAndUpdate(
      { _id: projectId },
      {
        $set: { "fleetParams.Task": taskParams },
      },
      { new: true }
    );
    if (!updatedProj)
      return res
        .status(500)
        .json({ isSet: false, project: null, msg: "project not updated..!" });
    return res.status(200).json({
      isSet: true,
      msg: "data sent",
      map: true,
    });
  } catch (error) {
    console.error("Error in taskLogs:", error);
    if (error.name === "CastError")
      return res.status(400).json({ msg: "not valid map Id" });
    res
      .status(500)
      .json({ error: error.message, msg: "Internal Server Error" });
  }
};
 
const setBatteryParam = async (req, res) => {
  const { projectId, batteryParams } = req.body;
  try {
    const isProjExist = await projectModel.findOne({ _id: projectId });
    if (!isProjExist)
      return res.status(422).json({ project: null, msg: "project not found" });
    let updatedProj = await projectModel.findOneAndUpdate(
      { _id: projectId },
      {
        $set: { "fleetParams.Battery": batteryParams },
      },
      { new: true }
    );
    if (!updatedProj)
      return res
        .status(500)
        .json({ isSet: false, project: null, msg: "project not updated..!" });
    return res.status(200).json({
      isSet: true,
      msg: "data sent",
      map: true,
    });
  } catch (error) {
    console.error("Error in taskLogs:", error);
    if (error.name === "CastError")
      return res.status(400).json({ msg: "not valid map Id" });
    res
      .status(500)
      .json({ error: error.message, msg: "Internal Server Error" });
  }
};
 
const setCommunicationParam = async (req, res) => {
  const { projectId, communicationParams } = req.body;
  try {
    const isProjExist = await projectModel.findOne({ _id: projectId });
    if (!isProjExist)
      return res.status(422).json({ project: null, msg: "project not found" });
    let updatedProj = await projectModel.findOneAndUpdate(
      { _id: projectId },
      {
        $set: { "fleetParams.Communication": communicationParams },
      },
      { new: true }
    );
    if (!updatedProj)
      return res
        .status(500)
        .json({ isSet: false, project: null, msg: "project not updated..!" });
    return res.status(200).json({
      isSet: true,
      msg: "data sent",
      map: true,
    });
  } catch (error) {
    console.error("Error in taskLogs:", error);
    if (error.name === "CastError")
      return res.status(400).json({ msg: "not valid map Id" });
    res
      .status(500)
      .json({ error: error.message, msg: "Internal Server Error" });
  }
};
 
/* let json = {
  root: { serverIp: "127.0.0.1", serverPort: 3300 },
};
let xmlData = convert.json2xml(json, {
  compact: true,
  ignoreComment: true,
  spaces: 4,
});
console.log(xmlData); */
 
module.exports = {
  setGeneralParam,
  setPlannerParam,
  setTaskParam,
  setBatteryParam,
  setCommunicationParam,
};