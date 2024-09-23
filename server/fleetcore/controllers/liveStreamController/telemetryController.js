const mqtt = require("mqtt");
const { Map, Robo } = require("../../../application/models/mapSchema");
require("dotenv").config();

let mqttClient = null;
let endResponse = null;
let factScheetAmr = [];

const initMqttConnection = () => {
  if (mqttClient) mqttClient.end();
  mqttClient = mqtt.connect(
    `mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`
  ); // .connect(host,  {username: , password:  })

  mqttClient.on("connect", () => {
    // mqttClient.subscribe("maps/map1", { qos: 0 });
    console.log("Mqtt client connected");
  });

  mqttClient.on("error", (err) => {
    console.log("Mqtt Err occured : ", err);
    mqttClient.end();
    endResponse.end();
  });

  mqttClient.on("disconnect", () => {
    console.log("Mqtt client disconnected");
    endResponse.end();
  });
};

const eventStreamHeader = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
};

const fetchGetAmrLoc = async ({ endpoint, bodyData }) => {
  let response = await fetch(`http://192.168.1.6:8080/fms/amr/${endpoint}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic cm9vdDp0b29y",
    },
    body: JSON.stringify(bodyData),
  });
  if (!response.ok) {
    console.log("failed while sending node graph");
    return null;
  }
  let data = await response.json();
  return data;
};
//..

// initMqttConnection();
const getAgvTelemetry = (req, res) => {
  const mapId = req.params.mapId;
  initMqttConnection();
  endResponse = res;
  try {
    res.writeHead(200, eventStreamHeader);

    res.on("close", () => {
      res.end();
    });

    mqttClient.subscribe("map/map1", { qos: 0 });
    mqttClient.on("message", (topic, message) => {
      let pos = { topic: topic, message: message.toString("utf8") };
      res.write(`data: ${JSON.stringify(pos)}\n\n`);
      // console.log(topic, message.toString("utf8"));
    });
  } catch (err) {
    console.error("Error in getAgvTelemetry:", err);
    res.status(500).json({ error: err.message, msg: "Internal Server Error" });
  }
};

const getRoboPos = async (req, res) => {
  const mapId = req.params.mapId;
  try {
    let isMapExists = await Map.exists({ _id: mapId });
    if (!isMapExists)
      return res.status(400).json({ msg: "Map not found!", map: null });
    // const map = await Map.findOne({ _id: mapId });
    let roboPos = await fetchGetAmrLoc({
      endpoint: "get_AMR_Locations",
      bodyData: {},
    });
    return res.status(200).json({ roboPos: roboPos, data: "msg sent" });
  } catch (error) {
    console.error("Error in getAgvTelemetry:", error);
    res
      .status(500)
      .json({ error: error.message, msg: "Internal Server Error" });
  }
};

const getGrossTaskStatus = async (req, res) => {
  const mapId = req.params.mapId;
  try {
    let isMapExists = await Map.exists({ _id: mapId });
    if (!isMapExists)
      return res.status(400).json({ msg: "Map not found!", map: null });
    const map = await Map.findOne({ _id: mapId });
    let tasksStatus = [];
    for (let i of [1, 2, 3, 4, 5]) {
      tasksStatus.push(Math.floor(Math.random() * 10));
    }
    return res
      .status(200)
      .json({ tasksStatus: tasksStatus, map: map, msg: "data sent!" });
  } catch (error) {
    console.error("Error in getting tasks status :", err);
    res.status(500).json({ error: err.message, msg: "Internal Server Error" });
  }
};

const getRoboStateCount = async (req, res) => {
  const mapId = req.params.mapId;
  try {
    let isMapExists = await Map.exists({ _id: mapId });
    if (!isMapExists)
      return res.status(400).json({ msg: "Map not found!", map: null });
    const map = await Map.findOne({ _id: mapId });
    let roboStates = [];
    for (let i of [1, 2, 3]) {
      roboStates.push(Math.floor(Math.random() * 60));
    }
    return res
      .status(200)
      .json({ roboStates: roboStates, map: map, msg: "data sent!" });
  } catch (error) {
    console.error("Error in getting tasks status :", err);
    res.status(500).json({ error: err.message, msg: "Internal Server Error" });
  }
};

const getRoboActivities = async (req, res) => {
  const { mapId } = req.body;
  try {
    let isMapExists = await Map.exists({ _id: mapId });
    if (!isMapExists)
      return res.status(400).json({ msg: "Map not found!", map: null });
    const map = await Map.findOne({ _id: mapId });
    let roboActivities = [
      {
        roboId: 1,
        roboName: "AMR-001",
        task: "PICK SCREWS",
        taskStatus: "In Progress",
        desc: "N/A",
      },
      {
        roboId: 2,
        roboName: "AMR-002",
        task: "DROP SCREWS",
        taskStatus: "In Progress",
        desc: "N/A",
      },
    ];
    return res
      .status(200)
      .json({ roboActivities: roboActivities, map: map, msg: "data sent!" });
  } catch (error) {
    console.error("Error in getting tasks status :", err);
    res.status(500).json({ error: err.message, msg: "Internal Server Error" });
  }
};

const getRoboFactSheet = async (req, res) => {};

const getRoboDetails = async (req, res) => {
  const { mapId } = req.body;
  try {
    let isMapExists = await Map.exists({ _id: mapId });
    if (!isMapExists)
      return res.status(400).json({ msg: "Map not found!", map: null });
    const { robots } = await Map.findOne(
      { _id: mapId },
      { robots: 1 }
    ).populate({
      // findeOne({filter doc},{projection doc})..
      path: "robots.roboId",
      model: Robo,
    });
    factScheetAmr = robots.map((robo) => {
      let robot = robo.roboId;

      return {
        id: robot._id.toString().slice(20),
        serialNumber: robot._id.toString().slice(18),
        name: robot.roboName,
        imageUrl: "",
        status: "Active",
        battery: Math.floor(Math.random() * 80).toString() + " %",
        temperature: Math.floor(Math.random() * 40).toString() + " C",
        networkstrength: Math.floor(Math.random() * 80),
        robotutilization: Math.floor(Math.random() * 80).toString() + " %",
        cpuutilization: Math.floor(Math.random() * 80).toString() + " %",
        memory: Math.floor(Math.random() * 70).toString() + " %",
        error: Math.floor(Math.random() * 50).toString(),
        batteryPercentage: Math.floor(Math.random() * 100),
        isCharging: Math.floor(Math.random() * 40) > 20 ? true : false,
        totalPicks: Math.floor(Math.random() * 40).toString(),
        totalDrops: Math.floor(Math.random() * 40).toString(),
        SignalStrength: "",
        averagedischarge: Math.floor(Math.random() * 40),
        averageChargingTime: Math.floor(Math.random() * 8).toString(),
        currentspeed: Math.floor(Math.random() * 5).toString(),
        averagespeed: Math.floor(Math.random() * 5).toString(),
        maximumspeed: Math.floor(Math.random() * 7).toString(),
        averagetransfertime: Math.floor(Math.random() * 6).toString(),
        averagedockingtime: Math.floor(Math.random() * 7).toString(),
      };
    });
    return res.status(200).json({
      robots: factScheetAmr,
      msg: "data sent!",
    });
  } catch (error) {
    console.error("Error in getting tasks status :", error);
    res
      .status(500)
      .json({ error: error.message, msg: "Internal Server Error" });
  }
};

module.exports = {
  getAgvTelemetry,
  getGrossTaskStatus,
  getRoboStateCount,
  getRoboActivities,
  getRoboFactSheet,
  getRoboDetails,
  getRoboPos,
  mqttClient,
};
