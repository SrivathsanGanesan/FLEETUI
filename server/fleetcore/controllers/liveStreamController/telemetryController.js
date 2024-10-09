const amqp = require("amqplib");
const { Map, Robo } = require("../../../application/models/mapSchema");
require("dotenv").config();

// let mqttClient = null;
// let endResponse = null;

let rabbitMqClient = null;
let rabbitMQChannel = null;

const eventStreamHeader = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
};

const initRabbitMQConnection = async () => {
  try {
    // "http://13.202.100.211:15672/"
    rabbitMqClient = await amqp.connect(
      `amqp://${process.env.RABBITMQ_SERVER}:${process.env.RABBITMQ_PORT}`
    );
    rabbitMQChannel = await rabbitMqClient.createChannel();
  } catch (error) {
    console.error("Error while connecting rabbitmq :", error.message);
  }
};

const receiveMessage = async (exchange, queueName, routingKey, req, res) => {
  if (!rabbitMQChannel) return;
  // remove previous or existing event listenr to prevent memory leaks.. which overwhelmed bcz of listeners..
  /* req.removeListener("close", () => {
    return res.end();
  }); */
  req.on("close", () => {
    return res.end();
  });
  try {
    // topic or direct or fanout, which describes what type of exchange it is..
    let exchangeInfo = await rabbitMQChannel.assertExchange(exchange, "topic", {
      durable: true,
    });

    let queueInfo = await rabbitMQChannel.assertQueue(queueName, {
      durable: true, // queue remains even rabbitmq server restarts..
    });
    await rabbitMQChannel.bindQueue(queueName, exchange, routingKey); // bind queue with exchange with routing key..
    // if (!queueInfo.messageCount) {
    //   let resInfo = {
    //     messageCount: queueInfo.messageCount,
    //     msg: "queue is empty!",
    //   };
    //   res.write(`data: ${JSON.stringify(resInfo)}\n\n`);
    //   return res.end();
    // } else
    rabbitMQChannel.consume(queueName, (msg) => {
      if (msg) {
        const messageContent = msg.content.toString();
        let robos = JSON.parse(messageContent);
        res.write(`data: ${JSON.stringify(robos)}\n\n`);

        rabbitMQChannel.ack(msg);
      }
    });
  } catch (error) {
    console.error("Error connection messages :", error);
    if (error.code === 406 && error.message.includes("PRECONDITION_FAILED")) {
      console.error("Queue properties mismatch. Please verify queue settings.");
    }
    return res.status(500).json({
      errInReceivingMsg: true,
      error: error.message,
      msg: "Error while receiving message",
    });
  }
};

const fetchFleetInfo = async ({ endpoint, bodyData, method = "GET" }) => {
  try {
    let response = await fetch(
      `http://${process.env.FLEET_SERVER}:${process.env.FLEET_PORT}/fms/amr/${endpoint}`,
      {
        method: method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic cm9vdDp0b29y",
        },
        body: JSON.stringify(bodyData),
      }
    );
    /* if (!response.ok) {
      console.log("failed while fetching fleet data.. might tasks!");
      return null;
    } */
    return await response.json();
  } catch (error) {
    if (error.cause) return error.cause?.code;
    console.log("Err while sending data to fleet : ", error);
  }
};

// initMqttConnection();
// initRabbitMQConnection();

const initializeRobo = async (req, res) => {
  const { mapId, initializeRobo } = req.body;
  // console.log(initializeRobo);

  try {
    let isMapExists = await Map.exists({ _id: mapId });
    if (!isMapExists)
      return res.status(400).json({ msg: "Map not found!", map: null });
    let initRoboPos = await fetchFleetInfo({
      endpoint: "initialise",
      bodyData: initializeRobo,
      method: "POST",
    });

    /* let showsplinePos = null;
    if (initRoboPos.errorCode === 1000)
      showsplinePos = await fetchFleetInfo({
        endpoint: "showSpline",
        bodyData: { robotId: initializeRobo.id, enable: true },
        method: "POST",
      }); */

    if (initRoboPos.errorCode === 1000)
      //&& showsplinePos.errorCode === 1000
      return res.status(200).json({
        isInitialized: true,
        fleet_response: initRoboPos,
        msg: "data sent",
      });
    return res.status(400).json({
      isInitialized: false,
      amrId: null,
      msg: "data not attained by fleet",
    });
  } catch (err) {
    console.error("Error in getAgvTelemetry:", err);
    res.status(500).json({ error: err.message, msg: "Internal Server Error" });
  }
};

const getRoboPos = async (req, res) => {
  const exchange = "amq.topic";
  const queueName = "FMS.CONFIRM-TASK"; // queue name...
  const routingKey = "FMS";
  const mapId = req.params.mapId;
  try {
    let isMapExists = await Map.exists({ _id: mapId });
    if (!isMapExists)
      return res.status(400).json({ msg: "Map not found!", map: null });
    res.writeHead(200, eventStreamHeader);
    await receiveMessage(exchange, queueName, routingKey, req, res);
    // const map = await Map.findOne({ _id: mapId });
    // return res.status(200).json({ roboPos: null, data: "msg sent" });
  } catch (error) {
    console.error("Error in getAgvTelemetry:", error);
    res
      .status(500)
      .json({ error: error.message, msg: "Internal Server Error" });
  }
};

const showSpline = async (req, res) => {
  const { mapId } = req.body;
  let splineData = {
    robotId: 0,
    enable: true,
  };
  let splineRes = await fetchFleetInfo("showSpline", splineData);
  if (splineRes.errorCode !== 1000) {
    res.status(500).json({ isShowSplined: false, msg: "not attained" });
  }
  try {
    let isMapExists = await Map.exists({ _id: mapId });
    if (!isMapExists)
      return res
        .status(400)
        .json({ isShowSplined: false, msg: "Map not found!", map: null });
    return res.status(200).json({ isShowSplined: true, msg: "path set!" });
  } catch (error) {
    console.error("Error in show_spline  :", err);
    res.status(500).json({ error: err.message, msg: "Internal Server Error" });
  }
};

const enableRobo = async (req, res) => {
  const { mapId, roboToEnable } = req.body;

  try {
    let isMapExists = await Map.exists({ _id: mapId });
    if (!isMapExists)
      return res
        .status(400)
        .json({ isShowSplined: false, msg: "Map not found!", map: null });

    let enableRoboRes = await fetchFleetInfo({
      endpoint: "enableRobot",
      bodyData: roboToEnable,
      method: "POST",
    });

    if (enableRoboRes.errorCode !== 1000)
      return res
        .status(500)
        .json({ isRoboEnabled: false, msg: "not attained" });

    return res.status(200).json({ isRoboEnabled: true, msg: "path set!" });
  } catch (error) {
    console.error("Error in enable_robot  :", error);
    res
      .status(500)
      .json({ error: error.message, msg: "Internal Server Error" });
  }
};

const getGrossTaskStatus = async (req, res) => {
  const mapId = req.params.mapId;
  const mapData = req.body;
  let { timeStamp1, timeStamp2 } = mapData;
  try {
    let isMapExists = await Map.exists({ _id: mapId });
    if (!isMapExists)
      return res.status(400).json({ msg: "Map not found!", map: null });
    const map = await Map.findOne({ _id: mapId });
    let timeStamp = {
      timeStamp1: timeStamp1,
      timeStamp2: timeStamp2,
    };
    /* let tasks = await fetchFleetInfo({
      endpoint: "get_tasks_list",
      bodyData: timeStamp,
      method: "POST",
    }); */

    let tasksStatus = [];
    for (let i of [1, 2, 3, 4, 5]) {
      tasksStatus.push(Math.floor(Math.random() * 10));
    }

    return res.status(200).json({
      tasksStatus: tasksStatus,
      // tasks: tasks.tasks ? tasks.tasks : tasks.default_columns,
      map: map,
      msg: "data sent!",
    });
  } catch (error) {
    console.error("Error in getting tasks status :", error);
    res
      .status(500)
      .json({ error: error.message, msg: "Internal Server Error" });
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
        battery: Math.floor(Math.random() * 80).toString() + "",
        temperature: Math.floor(Math.random() * 40).toString() + "",
        networkstrength: Math.floor(Math.random() * 80),
        robotutilization: Math.floor(Math.random() * 80).toString() + "",
        cpuutilization: Math.floor(Math.random() * 80).toString() + "",
        memory: Math.floor(Math.random() * 70).toString() + "",
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
  initializeRobo,
  getGrossTaskStatus,
  getRoboStateCount,
  getRoboActivities,
  getRoboDetails,
  getRoboPos,
  showSpline,
  enableRobo,
  rabbitMqClient,
  rabbitMQChannel,
};
