const { Map, Robo } = require("../../../application/models/mapSchema");
const { projectModel, siteModel } = require("../../models/projectSchema");

const setGeneralParam = async (req, res) => {
  const { mapId } = req.body;
  try {
    const isMapExist = await Map.findOne({ _id: mapId });
    if (!isMapExist)
      return res.status(422).json({ map: null, msg: "map not found" });
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

const setPlannerParam = async (req, res) => {
  const { mapId } = req.body;
  try {
    const isMapExist = await Map.findOne({ _id: mapId });
    if (!isMapExist)
      return res.status(422).json({ map: null, msg: "map not found" });
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
  const { mapId } = req.body;
  try {
    const isMapExist = await Map.findOne({ _id: mapId });
    if (!isMapExist)
      return res.status(422).json({ map: null, msg: "map not found" });
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
  const { mapId } = req.body;
  try {
    const isMapExist = await Map.findOne({ _id: mapId });
    if (!isMapExist)
      return res.status(422).json({ map: null, msg: "map not found" });
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
  const { mapId } = req.body;
  try {
    const isMapExist = await Map.findOne({ _id: mapId });
    if (!isMapExist)
      return res.status(422).json({ map: null, msg: "map not found" });
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
