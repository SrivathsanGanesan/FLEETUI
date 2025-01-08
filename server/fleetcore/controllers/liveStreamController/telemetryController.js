const amqp = require("amqplib");
const { Map, Robo } = require("../../../application/models/mapSchema");
const { projectModel } = require("../../models/projectSchema");
const EventEmitter = require("events");
require("dotenv").config();

let rabbitMqClient = null;
let rabbitMQChannel = null;
let rabbitMQConfirmChannel = null; // return acknowledgement for published message ( channel for publishing )

const consumeAMQP = new EventEmitter();
const consumeRabbitqpAsset = new EventEmitter();

let currentRobos = [];
let rabbitmqConsumerTag = null;
let assertConsumerTag = null;

const noLiveRoboPos = {
  count: 0,
  robots: [],
};

const noAssets = {
  assets: [],
};

const eventStreamHeader = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
};

const initRabbitMQConnection = async () => {
  try {
    rabbitMqClient = await amqp.connect(
      `amqp://${process.env.RABBITMQ_SERVER}:${process.env.RABBITMQ_PORT}`
    );
    rabbitMqClient.on("error", (err) => {
      console.log("rabbitmq connection error:", err.message);
    });
    rabbitMqClient.on("close", () => {
      console.log("rabbitmq connection closed");
    });
    rabbitMQChannel = await rabbitMqClient.createChannel();
    rabbitMQConfirmChannel = await rabbitMqClient.createConfirmChannel();
    await consumeMessage();
    await consumeAssets();
    // await sendTaks();
  } catch (error) {
    console.error("Error while connecting rabbitmq :", error);
  }
};

const consumeMessage = async () => {
  if (!rabbitMQChannel) return;
  const exchange = "FMS.UI-Data";
  const queueName = "FMS.UI-Data"; // queue name...
  const routingKey = "UI";
  try {
    // topic or direct or fanout, which describes what type of exchange it is..
    let exchangeInfo = await rabbitMQChannel.assertExchange(exchange, "topic", {
      durable: true,
    });

    let queueInfo = await rabbitMQChannel.assertQueue(queueName, {
      durable: true, // queue remains even rabbitmq server restarts..
    });

    await rabbitMQChannel.bindQueue(queueName, exchange, routingKey); // bind queue with exchange with routing key..

    rabbitmqConsumerTag = await rabbitMQChannel.consume(queueName, (msg) => {
      currentRobos = []; // take a look..
      if (msg) {
        const messageContent = msg.content.toString();
        let robos = JSON.parse(messageContent);
        // res.write(`data: ${JSON.stringify(robos)}\n\n`);
        consumeAMQP.emit("amqp-data", robos);
        currentRobos = robos;

        rabbitMQChannel.ack(msg);
      }
    });
  } catch (error) {
    console.error("Error connection messages :", error);
    if (error.code === 406 && error.message.includes("PRECONDITION_FAILED")) {
      console.error("Queue properties mismatch. Please verify queue settings.");
    }
  }
};

const consumeAssets = async () => {
  if (!rabbitMQChannel) return;
  const exchange = "amq.topic";
  const queueName = "AMS.TASK"; // queue name...
  const routingKey = "AMS";
  try {
    // topic or direct or fanout, which describes what type of exchange it is..
    let assertExchangeInfo = await rabbitMQChannel.assertExchange(
      exchange,
      "topic",
      {
        durable: true,
      }
    );

    let assertQueueInfo = await rabbitMQChannel.assertQueue(queueName, {
      durable: true, // queue remains even rabbitmq server restarts..
    });

    await rabbitMQChannel.bindQueue(queueName, exchange, routingKey); // bind queue with exchange with routing key..

    assertConsumerTag = await rabbitMQChannel.consume(queueName, (msg) => {
      if (msg) {
        const messageContent = msg.content.toString();
        let assets = JSON.parse(messageContent);

        // res.write(`data: ${JSON.stringify(robos)}\n\n`);
        consumeRabbitqpAsset.emit("amqp-assets", assets);

        rabbitMQChannel.ack(msg);
      }
    });
  } catch (error) {
    console.error("Error connection messages :", error);
    if (error.code === 406 && error.message.includes("PRECONDITION_FAILED")) {
      console.error("Queue properties mismatch. Please verify queue settings.");
    }
  }
};

const publishTasks = async (bodyData) => {
  if (!rabbitMQConfirmChannel) return false;
  const exchange = "amq.topic";
  const queueName = "FMS.RECEIVE-TASK"; // queue name...
  const routingKey = "FMS";
  try {
    // topic or direct or fanout, which describes what type of exchange it is..
    await rabbitMQConfirmChannel.assertExchange(exchange, "topic", {
      durable: true, // exchange will survive, even server restarts..
    });

    await rabbitMQConfirmChannel.assertQueue(queueName, {
      durable: true, // queue remains even rabbitmq server restarts..
    });

    await rabbitMQConfirmChannel.bindQueue(queueName, exchange, routingKey); // bind queue with exchange with routing key..

    // if normal channel / without confirmChannel, only returns boolean immediately (not reliable status)
    // publish mehtod only indicates( return ) that the RabbitMQ accepted the message, not verify that the message was successfully routed to a queue.
    rabbitMQConfirmChannel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(bodyData)), // only in Buffer (Binary) which rabbit accepts..
      {
        persistent: true, // message saved to disk not in memory/RAM(ig), cz even if server crash/restarts it retrieves
      },
      (err) => {
        // if (!err) return true;
        if (err) console.log(err);
        return false;
      }
    );
    return true;
  } catch (error) {
    console.error("Error connection messages :", error);
    if (error.code === 406 && error.message.includes("PRECONDITION_FAILED")) {
      console.error("Queue properties mismatch. Please verify queue settings.");
    }
    return false;
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
    if (!response.ok) {
      // console.log("failed while splining..");
      return null;
    }
    return await response.json();
  } catch (error) {
    if (error.cause) return error.cause?.code;
    console.log("Err while sending data to fleet : ", error);
  }
};

initRabbitMQConnection();

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
  const mapId = req.params.mapId;
  try {
    let isMapExists = await Map.exists({ _id: mapId });
    if (!isMapExists)
      return res.status(400).json({ msg: "Map not found!", map: null });

    if (!rabbitmqConsumerTag) return res.end();

    res.writeHead(200, eventStreamHeader);

    const listenerCallback = (robos) => {
      res.write(`data: ${JSON.stringify(robos)}\n\n`);
    };
    req.on("close", () => {
      consumeAMQP.removeListener("amqp-data", listenerCallback); // to prevent the memory leak, which the listeners stacked..
      return res.end();
    });

    consumeAMQP.on("amqp-data", listenerCallback);

    // take a look.. just to initiate the live on client by sending empty robo pose.
    res.write(`data: ${JSON.stringify(noLiveRoboPos)}\n\n`); // wanna exucute only once...
  } catch (error) {
    console.error("Error in getAgvTelemetry:", error);
    res
      .status(500)
      .json({ error: error.message, msg: "Internal Server Error" });
  }
};

const getAsserts = async (req, res) => {
  const mapId = req.params.mapId;
  try {
    let isMapExists = await Map.exists({ _id: mapId });
    if (!isMapExists)
      return res.status(400).json({ msg: "Map not found!", map: null });

    if (!assertConsumerTag) return res.end();

    res.writeHead(200, eventStreamHeader);

    const listenerCallback = (assets) => {
      res.write(`data: ${JSON.stringify(assets)}\n\n`);
    };
    req.on("close", () => {
      consumeRabbitqpAsset.removeListener("amqp-assets", listenerCallback); // to prevent the memory leak, which the listeners stacked..
      return res.end();
    });

    consumeRabbitqpAsset.on("amqp-assets", listenerCallback);

    // take a look.. just to initiate the live on client by sending empty robo pose.
    res.write(`data: ${JSON.stringify(noAssets)}\n\n`); // wanna exucute only once...
  } catch (error) {
    console.error("Error in getAgvTelemetry:", error);
    res
      .status(500)
      .json({ error: error.message, msg: "Internal Server Error" });
  }
};

const sendTasks = async (req, res) => {
  const mapId = req.params.mapId;
  const { taskId, agentId, Priority, sourceLocation, taskType } = req.body;
  try {
    let isMapExists = await Map.exists({ _id: mapId });
    if (!isMapExists)
      return res.status(400).json({ msg: "Map not found!", map: null });

    let isTaskSent = await publishTasks({
      taskId,
      agentId: parseInt(agentId),
      Priority,
      sourceLocation,
      taskType,
      robotType: "RTP",
    });

    if (isTaskSent)
      return res.status(200).json({ msg: "Task sent", isTaskSent: true });
    return res.status(417).json({ msg: "Task not sent", isTaskSent: false }); // 417 - expectation falied
  } catch (error) {
    console.error("Error in sending tasks :", error);
    res
      .status(500)
      .json({ error: error.message, msg: "Internal Server Error" });
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
        .status(400)
        .json({ isRoboEnabled: false, msg: "not attained" });

    return res.status(200).json({ isRoboEnabled: true, msg: "path set!" });
  } catch (error) {
    console.error("Error in enable_robot  :", error);
    res
      .status(500)
      .json({ error: error.message, msg: "Internal Server Error" });
  }
};

const getLiveRobos = async (req, res) => {
  // neet to purge all previous robo dets in rabbitmq topic..
  const mapId = req.params.mapId;
  try {
    let isMapExists = await Map.exists({ _id: mapId });
    if (!isMapExists)
      return res.status(400).json({ msg: "Map not found!", map: null });
    res.json({
      msg: "live robos has been sent",
      map: true,
      robos: currentRobos,
    });
    res.on("finish", () => {
      currentRobos = []; // just reset the robos after sent to the client!
    });
  } catch (error) {
    console.error("Error in getting live robos  :", error);
    res
      .status(500)
      .json({ error: error.message, msg: "Internal Server Error" });
  }
};

// middleware no longer in use... ig
const getRabbitmqStatus = async (req, res) => {
  const projId = req.params.projId;
  try {
    let isProjExist = await projectModel.exists({ _id: projId });
    if (!isProjExist)
      return res.status(400).json({ msg: "Project not found!", project: null });

    if (!rabbitmqConsumerTag)
      return res
        .status(503) // 503 - Service Unavailable
        .json({
          rabbitmqStatus: false,
          msg: "RabbitMq is currently unavailabe",
        });

    return res
      .status(200)
      .json({ rabbitmqStatus: true, msg: "RabbitMq is in Up" });
  } catch (error) {
    console.error("Error in getting rabbitMq status  :", error);
    res
      .status(500)
      .json({ error: error.message, msg: "Internal Server Error" });
  }
};

const showSpline = async (req, res) => {
  const { mapId, roboId } = req.body;
  try {
    let isMapExists = await Map.exists({ _id: mapId });
    if (!isMapExists)
      return res
        .status(400)
        .json({ isShowSplined: false, msg: "Map not found!", map: null });

    let splineData = {
      robotId: roboId,
      enable: true,
    };

    let splineRes = await fetchFleetInfo({
      endpoint: "showSpline",
      bodyData: splineData,
      method: "POST",
    });

    if (!splineRes || splineRes.errorCode !== 1000) {
      return res
        .status(500)
        .json({ isShowSplined: false, msg: "not attained" });
    }

    return res.status(200).json({ isShowSplined: true, msg: "path set!" });
  } catch (error) {
    console.error("Error in show_spline  :", error);
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
        id: robot.amrId,
        serialNumber: robot.grossInfo.serialNumber,
        name: robot.roboName,
        imageUrl: "",
        status: "INACTIVE",
        battery: 0,
        temperature: Math.floor(Math.random() * 40).toString() + "",
        networkstrength: Math.floor(Math.random() * 80),
        robotutilization: Math.floor(Math.random() * 80).toString() + "",
        cpuutilization: Math.floor(Math.random() * 80).toString() + "",
        memory: Math.floor(Math.random() * 70).toString() + "",
        error: 0,
        batteryPercentage: 0,
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

const getFleetStatus = async (req, res) => {
  let endpoint = "notifications";
  try {
    await fetch(
      `http://${process.env.FLEET_SERVER}:${process.env.FLEET_PORT}/fms/amr/${endpoint}`
    );
    const isFleetAmqpUp = rabbitmqConsumerTag ? true : false;
    return res
      .status(200)
      .json({ fleetUp: isFleetAmqpUp, msg: "fleet in up", error: null });
  } catch (error) {
    console.error(
      "Error, while checking status of fleet and rabbitMq : ",
      error.message
    );
    res
      .status(200)
      .json({ fleetUp: false, msg: "fleet in down", error: error.message });
  }
};

module.exports = {
  initializeRobo,
  getRoboStateCount,
  getRoboDetails,
  getRoboPos,
  getAsserts,
  sendTasks,
  getRabbitmqStatus,
  showSpline,
  enableRobo,
  getLiveRobos,
  getFleetStatus,
  // rabbitMqClient, // might to uncomment..
  // rabbitMQChannel,
};

// if (!queueInfo.messageCount) {
//   let resInfo = {
//     messageCount: queueInfo.messageCount,
//     msg: "queue is empty!",
//   };
//   res.write(`data: ${JSON.stringify(resInfo)}\n\n`);
//   return res.end();
// } else
