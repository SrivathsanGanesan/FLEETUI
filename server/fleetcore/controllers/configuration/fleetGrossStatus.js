const { Map, Robo } = require("../../../application/models/mapSchema");

// for operations..
const systemThroughput = async (req, res) => {
  const { mapId } = req.body;
  try {
    const isMapExist = await Map.findOne({ _id: mapId });
    if (!isMapExist)
      return res.status(422).json({ map: null, msg: "map not found" });
    return res.status(200).json({
      systemThroughput: Math.floor(Math.random() * 70),
      msg: "data sent",
      // map: true,
    });
  } catch (error) {
    console.error("Error in taskLogs:", error.message);
    if (error.name === "CastError")
      return res.status(400).json({ msg: "not valid map Id" });
    res
      .status(500)
      .json({ error: error.message, msg: "Internal Server Error" });
  }
};

const systemUptime = async (req, res) => {
  const { mapId } = req.body;
  try {
    const isMapExist = await Map.findOne({ _id: mapId });
    if (!isMapExist)
      return res.status(422).json({ map: null, msg: "map not found" });
    return res.status(200).json({
      systemUptime: Math.floor(Math.random() * 4) + 95,
      msg: "data sent",
      map: true,
    });
  } catch (error) {
    console.error("Error in taskLogs:", error.message);
    if (error.name === "CastError")
      return res.status(400).json({ msg: "not valid map Id" });
    res
      .status(500)
      .json({ error: error.message, msg: "Internal Server Error" });
  }
};

const successRate = async (req, res) => {
  const { mapId } = req.body;
  try {
    const isMapExist = await Map.findOne({ _id: mapId });
    if (!isMapExist)
      return res.status(422).json({ map: null, msg: "map not found" });
    return res.status(200).json({
      successRate: Math.floor(Math.random() * 90),
      msg: "data sent",
      map: true,
    });
  } catch (error) {
    console.error("Error in taskLogs:", error.message);
    if (error.name === "CastError")
      return res.status(400).json({ msg: "not valid map Id" });
    res
      .status(500)
      .json({ error: error.message, msg: "Internal Server Error" });
  }
};

const systemResponsiveness = async (req, res) => {
  const { mapId } = req.body;
  try {
    const isMapExist = await Map.findOne({ _id: mapId });
    if (!isMapExist)
      return res.status(422).json({ map: null, msg: "map not found" });
    return res.status(200).json({
      systemResponsiveness: Math.floor(Math.random() * 90),
      msg: "data sent",
      map: true,
    });
  } catch (error) {
    console.error("Error in taskLogs:", error.message);
    if (error.name === "CastError")
      return res.status(400).json({ msg: "not valid map Id" });
    res
      .status(500)
      .json({ error: error.message, msg: "Internal Server Error" });
  }
};

// for robo..
const getAverageSpeed = async (req, res) => {
  const { mapId } = req.body;
  try {
    const isMapExist = await Map.findOne({ _id: mapId });
    if (!isMapExist)
      return res.status(422).json({ map: null, msg: "map not found" });
    return res.status(200).json({
      averageSpeed: Math.floor(Math.random() * 20),
      msg: "data sent",
      map: true,
    });
  } catch (error) {
    console.error("Error in taskLogs:", error.message);
    if (error.name === "CastError")
      return res.status(400).json({ msg: "not valid map Id" });
    res
      .status(500)
      .json({ error: error.message, msg: "Internal Server Error" });
  }
};

const getTotalDistance = async (req, res) => {
  const { mapId } = req.body;
  try {
    const isMapExist = await Map.findOne({ _id: mapId });
    if (!isMapExist)
      return res.status(422).json({ map: null, msg: "map not found" });
    return res.status(200).json({
      totalDistance: Math.floor(Math.random() * 100),
      msg: "data sent",
      map: true,
    });
  } catch (error) {
    console.error("Error in taskLogs:", error.message);
    if (error.name === "CastError")
      return res.status(400).json({ msg: "not valid map Id" });
    res
      .status(500)
      .json({ error: error.message, msg: "Internal Server Error" });
  }
};

const getRoboUtilization = async (req, res) => {
  const { mapId } = req.body;
  try {
    const isMapExist = await Map.findOne({ _id: mapId });
    if (!isMapExist)
      return res.status(422).json({ map: null, msg: "map not found" });
    return res.status(200).json({
      roboUtilization: Math.floor(Math.random() * 90),
      msg: "data sent",
      map: true,
    });
  } catch (error) {
    console.error("Error in taskLogs:", error.message);
    if (error.name === "CastError")
      return res.status(400).json({ msg: "not valid map Id" });
    res
      .status(500)
      .json({ error: error.message, msg: "Internal Server Error" });
  }
};

const getNetworkConnection = async (req, res) => {
  const { mapId } = req.body;
  try {
    const isMapExist = await Map.findOne({ _id: mapId });
    if (!isMapExist)
      return res.status(422).json({ map: null, msg: "map not found" });
    return res.status(200).json({
      networkConnection: Math.floor(Math.random() * 80),
      msg: "data sent",
      map: true,
    });
  } catch (error) {
    console.error("Error in taskLogs:", error.message);
    if (error.name === "CastError")
      return res.status(400).json({ msg: "not valid map Id" });
    res
      .status(500)
      .json({ error: error.message, msg: "Internal Server Error" });
  }
};

module.exports = {
  systemThroughput,
  systemUptime,
  successRate,
  systemResponsiveness,
  getAverageSpeed,
  getTotalDistance,
  getRoboUtilization,
  getNetworkConnection,
};
