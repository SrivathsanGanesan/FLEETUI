const { Map, Robo } = require("../../../application/models/mapSchema");
const { projectModel } = require("../../models/projectSchema");

const getUptime = (fleetRecords) => {
  let records = fleetRecords.map((fleetStatus) => {
    let endTime = fleetStatus.endTime
      ? Math.floor(new Date(fleetStatus.endTime).getTime() / 1000)
      : Math.floor(Date.now() / 1000);
    if (!Object.keys(fleetStatus).length) return null;
    return {
      startTime: Math.floor(new Date(fleetStatus.startTime).getTime() / 1000),
      endTime: endTime,
    };
  });
  return records;
};

// <<-----------------[ Middleware ]----------------->>

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
  const { projectId } = req.body;
  try {
    const project = await projectModel.findOne({ _id: projectId });
    if (!project)
      return res.status(422).json({ project: null, msg: "project not found" });
    
    let { fleetRecords, createdAt } = project;
    let uptimeRecord = getUptime(fleetRecords);
    createdAt = Math.floor(new Date(createdAt).getTime() / 1000);
    let currentTime = Math.floor(Date.now() / 1000);

    // reducer will only return one value
    // const totalActiveTime = uptimeRecord.reduce((total, log) => {
    //   return total + (log.endTime - log.startTime);
    // }, 0); // 0 => initial value!
    let totalActiveTime = 0;
    for (let i = 0; i < uptimeRecord.length; i++){
      if (uptimeRecord !== null)
        totalActiveTime += Math.abs(uptimeRecord[i].endTime - uptimeRecord[i].startTime);
    }
    // console.log(totalActiveTime, uptimeRecord);
    
    const uptimePercentage = (totalActiveTime / (currentTime - createdAt)) * 100;
    
    return res.status(200).json({
      systemUptime: uptimePercentage.toFixed(2),
      msg: "data sent",
      project: true,
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
  getAverageSpeed, // no need anymore..
  getTotalDistance,
  getRoboUtilization,
  getNetworkConnection,
};
