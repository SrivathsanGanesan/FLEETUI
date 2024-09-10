const mqtt = require("mqtt");
require("dotenv").config();

let mqttClient = null;
let endResponse = null;

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
initMqttConnection();

const getAgvTelemetry = (req, res) => {
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

module.exports = { getAgvTelemetry, mqttClient };
