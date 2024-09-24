const { Map, Robo } = require("../../../application/models/mapSchema");
const { projectModel, siteModel } = require("../../models/projectSchema");

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

module.exports = {
  setGeneralParam,
  setPlannerParam,
  setTaskParam,
  setBatteryParam,
  setCommunicationParam,
};
