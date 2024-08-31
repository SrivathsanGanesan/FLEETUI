const mqtt = require("mqtt");
require("dotenv").config();

let mqttClient = null;

const initMqttConnection = () => {
  mqttClient = mqtt.connect(
    `mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`
  ); // .connect(host,  {username: , password:  })
  mqttClient.on("connect", () => {
    mqttClient.subscribe("maps/map1", { qos: 0 });
    console.log("Mqtt client connected");
  });

  mqttClient.on("error", (err) => {
    console.log("Mqtt Err occured : ", err);
    mqttClient.end();
  });

  mqttClient.on("disconnect", () => {
    console.log("Mqtt client disconnected");
  });
};

const getAgvTelemetry = (req, res) => {
  try {
    initMqttConnection();
    mqttClient.subscribe("map/map1");
    mqttClient.on("message", (topic, message) => {
      console.log(topic, message.toString("utf8"));
    });
  } catch (err) {
    return res.status(500).json({ error: err, msg: "Internal server Error" });
  }
};

module.exports = { getAgvTelemetry };
