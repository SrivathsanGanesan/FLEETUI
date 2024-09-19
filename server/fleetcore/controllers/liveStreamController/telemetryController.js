const mqtt = require("mqtt");
const { Map, Robo } = require("../../../application/models/mapSchema");
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
    const map = await Map.findOne({ _id: mapId });
    let robos = map.robots;
    return res.status(200).json({
      robots: {
        robos: robos,
        fsAmr: factScheetAmr.slice(0, Math.floor(Math.random() * 4) + 1),
      },
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

module.exports = {
  getAgvTelemetry,
  getGrossTaskStatus,
  getRoboStateCount,
  getRoboActivities,
  getRoboFactSheet,
  getRoboDetails,
  mqttClient,
};

var factScheetAmr = [
  {
    headerId: 1,
    timestamp: "2023-04-18T10:30:00.000Z",
    version: "2.0.0",
    manufacturer: "ABC Robotics",
    serialNumber: "AGV-001",
    typeSpecification: {
      seriesName: "XYZ Series",
      seriesDescription: "High-performance omnidirectional AGV",
      agvKinematic: "OMNI",
      agvClass: "CARRIER",
      maxLoadMass: 1000,
      localizationTypes: ["REFLECTOR", "RFID"],
      navigationTypes: ["VIRTUAL_LINE_GUIDED", "AUTONOMOUS"],
    },
    physicalParameters: {
      speedMin: 0.1,
      speedMax: 2.0,
      accelerationMax: 1.5,
      decelerationMax: 2.0,
      heightMin: 0.5,
      heightMax: 2.0,
      width: 0.8,
      length: 1.2,
    },
    protocolLimits: {
      maxStringLens: {
        msgLen: 1024,
        topicSerialLen: 20,
        topicElemLen: 50,
        idLen: 10,
        idNumericalOnly: false,
        enumLen: 20,
        loadIdLen: 15,
      },
      maxArrayLens: {
        "order.nodes": 50,
        "order.edges": 100,
        "node.actions": 10,
        "edge.actions": 5,
        "actions.actionsParameters": 20,
        instantActions: 5,
        "trajectory.knotVector": 100,
        "trajectory.controlPoints": 50,
        "state.nodeStates": 50,
        "state.edgeStates": 100,
        "state.loads": 10,
        "state.actionStates": 20,
        "state.errors": 5,
        "state.information": 10,
        "error.errorReferences": 3,
        "information.infoReferences": 2,
      },
      timing: {
        minOrderInterval: 0.5,
        minStateInterval: 0.2,
        defaultStateInterval: 1.0,
        visualizationInterval: 5.0,
      },
    },
    protocolFeatures: {
      optionalParameters: [
        {
          parameter: "order.nodes.nodePosition.allowedDeviationTheta",
          support: "REQUIRED",
          description: "Theta deviation allowed for node position",
        },
      ],
      agvActions: [
        {
          actionType: "CHARGE",
          actionDescription: "Charge the AGV at a charging station",
          actionScopes: ["INSTANT"],
          actionParameters: [
            {
              key: "chargingStationId",
              valueDataType: "STRING",
              description: "ID of the charging station",
            },
          ],
        },
      ],
    },
    agvGeometry: {
      wheelDefinitions: [
        {
          type: "DRIVE",
          isActiveDriven: true,
          isActiveSteered: false,
          position: {
            x: 0.2,
            y: 0.2,
          },
          diameter: 0.3,
          width: 0.1,
        },
      ],
      envelopes2d: [
        {
          set: "default",
          polygonPoints: [
            {
              x: 0,
              y: 0,
            },
            {
              x: 0.8,
              y: 0,
            },
            {
              x: 0.8,
              y: 1.2,
            },
            {
              x: 0,
              y: 1.2,
            },
          ],
        },
      ],
      envelopes3d: [
        {
          set: "default",
          format: "DXF",
          url: "ftp://example.com/agv_envelope.dxf",
        },
      ],
    },
    loadSpecification: {
      maxLoadHeight: 1.5,
      maxLoadWidth: 1.0,
      maxLoadLength: 1.2,
      loadPositions: [
        {
          id: "front",
          type: "FORK", // here..
          position: {
            x: 0.3,
            y: 0.5,
          },
        },
      ],
    },
  },
  {
    headerId: 2,
    timestamp: "2023-04-18T10:30:00.000Z",
    version: "2.0.0",
    manufacturer: "ABC Robotics",
    serialNumber: "AGV-002",
    typeSpecification: {
      seriesName: "XYZ Series",
      seriesDescription: "High-performance omnidirectional AGV",
      agvKinematic: "OMNI",
      agvClass: "CARRIER",
      maxLoadMass: 1000,
      localizationTypes: ["REFLECTOR", "RFID"],
      navigationTypes: ["VIRTUAL_LINE_GUIDED", "AUTONOMOUS"],
    },
    physicalParameters: {
      speedMin: 0.1,
      speedMax: 2.0,
      accelerationMax: 1.5,
      decelerationMax: 2.0,
      heightMin: 0.5,
      heightMax: 2.0,
      width: 0.8,
      length: 1.2,
    },
    protocolLimits: {
      maxStringLens: {
        msgLen: 1024,
        topicSerialLen: 20,
        topicElemLen: 50,
        idLen: 10,
        idNumericalOnly: false,
        enumLen: 20,
        loadIdLen: 15,
      },
      maxArrayLens: {
        "order.nodes": 50,
        "order.edges": 100,
        "node.actions": 10,
        "edge.actions": 5,
        "actions.actionsParameters": 20,
        instantActions: 5,
        "trajectory.knotVector": 100,
        "trajectory.controlPoints": 50,
        "state.nodeStates": 50,
        "state.edgeStates": 100,
        "state.loads": 10,
        "state.actionStates": 20,
        "state.errors": 5,
        "state.information": 10,
        "error.errorReferences": 3,
        "information.infoReferences": 2,
      },
      timing: {
        minOrderInterval: 0.5,
        minStateInterval: 0.2,
        defaultStateInterval: 1.0,
        visualizationInterval: 5.0,
      },
    },
    protocolFeatures: {
      optionalParameters: [
        {
          parameter: "order.nodes.nodePosition.allowedDeviationTheta",
          support: "REQUIRED",
          description: "Theta deviation allowed for node position",
        },
      ],
      agvActions: [
        {
          actionType: "CHARGE",
          actionDescription: "Charge the AGV at a charging station",
          actionScopes: ["INSTANT"],
          actionParameters: [
            {
              key: "chargingStationId",
              valueDataType: "STRING",
              description: "ID of the charging station",
            },
          ],
        },
      ],
    },
    agvGeometry: {
      wheelDefinitions: [
        {
          type: "DRIVE",
          isActiveDriven: true,
          isActiveSteered: false,
          position: {
            x: 0.2,
            y: 0.2,
          },
          diameter: 0.3,
          width: 0.1,
        },
      ],
      envelopes2d: [
        {
          set: "default",
          polygonPoints: [
            {
              x: 0,
              y: 0,
            },
            {
              x: 0.8,
              y: 0,
            },
            {
              x: 0.8,
              y: 1.2,
            },
            {
              x: 0,
              y: 1.2,
            },
          ],
        },
      ],
      envelopes3d: [
        {
          set: "default",
          format: "DXF",
          url: "ftp://example.com/agv_envelope.dxf",
        },
      ],
    },
    loadSpecification: {
      maxLoadHeight: 1.5,
      maxLoadWidth: 1.0,
      maxLoadLength: 1.2,
      loadPositions: [
        {
          id: "front",
          type: "FORK", // here..
          position: {
            x: 0.3,
            y: 0.5,
          },
        },
      ],
    },
  },
  {
    headerId: 3,
    timestamp: "2023-04-18T10:30:00.000Z",
    version: "2.0.0",
    manufacturer: "ABC Robotics",
    serialNumber: "AGV-003",
    typeSpecification: {
      seriesName: "XYZ Series",
      seriesDescription: "High-performance omnidirectional AGV",
      agvKinematic: "OMNI",
      agvClass: "CARRIER",
      maxLoadMass: 1000,
      localizationTypes: ["REFLECTOR", "RFID"],
      navigationTypes: ["VIRTUAL_LINE_GUIDED", "AUTONOMOUS"],
    },
    physicalParameters: {
      speedMin: 0.1,
      speedMax: 2.0,
      accelerationMax: 1.5,
      decelerationMax: 2.0,
      heightMin: 0.5,
      heightMax: 2.0,
      width: 0.8,
      length: 1.2,
    },
    protocolLimits: {
      maxStringLens: {
        msgLen: 1024,
        topicSerialLen: 20,
        topicElemLen: 50,
        idLen: 10,
        idNumericalOnly: false,
        enumLen: 20,
        loadIdLen: 15,
      },
      maxArrayLens: {
        "order.nodes": 50,
        "order.edges": 100,
        "node.actions": 10,
        "edge.actions": 5,
        "actions.actionsParameters": 20,
        instantActions: 5,
        "trajectory.knotVector": 100,
        "trajectory.controlPoints": 50,
        "state.nodeStates": 50,
        "state.edgeStates": 100,
        "state.loads": 10,
        "state.actionStates": 20,
        "state.errors": 5,
        "state.information": 10,
        "error.errorReferences": 3,
        "information.infoReferences": 2,
      },
      timing: {
        minOrderInterval: 0.5,
        minStateInterval: 0.2,
        defaultStateInterval: 1.0,
        visualizationInterval: 5.0,
      },
    },
    protocolFeatures: {
      optionalParameters: [
        {
          parameter: "order.nodes.nodePosition.allowedDeviationTheta",
          support: "REQUIRED",
          description: "Theta deviation allowed for node position",
        },
      ],
      agvActions: [
        {
          actionType: "CHARGE",
          actionDescription: "Charge the AGV at a charging station",
          actionScopes: ["INSTANT"],
          actionParameters: [
            {
              key: "chargingStationId",
              valueDataType: "STRING",
              description: "ID of the charging station",
            },
          ],
        },
      ],
    },
    agvGeometry: {
      wheelDefinitions: [
        {
          type: "DRIVE",
          isActiveDriven: true,
          isActiveSteered: false,
          position: {
            x: 0.2,
            y: 0.2,
          },
          diameter: 0.3,
          width: 0.1,
        },
      ],
      envelopes2d: [
        {
          set: "default",
          polygonPoints: [
            {
              x: 0,
              y: 0,
            },
            {
              x: 0.8,
              y: 0,
            },
            {
              x: 0.8,
              y: 1.2,
            },
            {
              x: 0,
              y: 1.2,
            },
          ],
        },
      ],
      envelopes3d: [
        {
          set: "default",
          format: "DXF",
          url: "ftp://example.com/agv_envelope.dxf",
        },
      ],
    },
    loadSpecification: {
      maxLoadHeight: 1.5,
      maxLoadWidth: 1.0,
      maxLoadLength: 1.2,
      loadPositions: [
        {
          id: "front",
          type: "FORK", // here..
          position: {
            x: 0.3,
            y: 0.5,
          },
        },
      ],
    },
  },
  {
    headerId: 4,
    timestamp: "2023-04-18T10:30:00.000Z",
    version: "2.0.0",
    manufacturer: "ABC Robotics",
    serialNumber: "AGV-004",
    typeSpecification: {
      seriesName: "XYZ Series",
      seriesDescription: "High-performance omnidirectional AGV",
      agvKinematic: "OMNI",
      agvClass: "CARRIER",
      maxLoadMass: 1000,
      localizationTypes: ["REFLECTOR", "RFID"],
      navigationTypes: ["VIRTUAL_LINE_GUIDED", "AUTONOMOUS"],
    },
    physicalParameters: {
      speedMin: 0.1,
      speedMax: 2.0,
      accelerationMax: 1.5,
      decelerationMax: 2.0,
      heightMin: 0.5,
      heightMax: 2.0,
      width: 0.8,
      length: 1.2,
    },
    protocolLimits: {
      maxStringLens: {
        msgLen: 1024,
        topicSerialLen: 20,
        topicElemLen: 50,
        idLen: 10,
        idNumericalOnly: false,
        enumLen: 20,
        loadIdLen: 15,
      },
      maxArrayLens: {
        "order.nodes": 50,
        "order.edges": 100,
        "node.actions": 10,
        "edge.actions": 5,
        "actions.actionsParameters": 20,
        instantActions: 5,
        "trajectory.knotVector": 100,
        "trajectory.controlPoints": 50,
        "state.nodeStates": 50,
        "state.edgeStates": 100,
        "state.loads": 10,
        "state.actionStates": 20,
        "state.errors": 5,
        "state.information": 10,
        "error.errorReferences": 3,
        "information.infoReferences": 2,
      },
      timing: {
        minOrderInterval: 0.5,
        minStateInterval: 0.2,
        defaultStateInterval: 1.0,
        visualizationInterval: 5.0,
      },
    },
    protocolFeatures: {
      optionalParameters: [
        {
          parameter: "order.nodes.nodePosition.allowedDeviationTheta",
          support: "REQUIRED",
          description: "Theta deviation allowed for node position",
        },
      ],
      agvActions: [
        {
          actionType: "CHARGE",
          actionDescription: "Charge the AGV at a charging station",
          actionScopes: ["INSTANT"],
          actionParameters: [
            {
              key: "chargingStationId",
              valueDataType: "STRING",
              description: "ID of the charging station",
            },
          ],
        },
      ],
    },
    agvGeometry: {
      wheelDefinitions: [
        {
          type: "DRIVE",
          isActiveDriven: true,
          isActiveSteered: false,
          position: {
            x: 0.2,
            y: 0.2,
          },
          diameter: 0.3,
          width: 0.1,
        },
      ],
      envelopes2d: [
        {
          set: "default",
          polygonPoints: [
            {
              x: 0,
              y: 0,
            },
            {
              x: 0.8,
              y: 0,
            },
            {
              x: 0.8,
              y: 1.2,
            },
            {
              x: 0,
              y: 1.2,
            },
          ],
        },
      ],
      envelopes3d: [
        {
          set: "default",
          format: "DXF",
          url: "ftp://example.com/agv_envelope.dxf",
        },
      ],
    },
    loadSpecification: {
      maxLoadHeight: 1.5,
      maxLoadWidth: 1.0,
      maxLoadLength: 1.2,
      loadPositions: [
        {
          id: "front",
          type: "FORK", // here..
          position: {
            x: 0.3,
            y: 0.5,
          },
        },
      ],
    },
  },
  {
    headerId: 5,
    timestamp: "2023-04-18T10:30:00.000Z",
    version: "2.0.0",
    manufacturer: "ABC Robotics",
    serialNumber: "AGV-005",
    typeSpecification: {
      seriesName: "XYZ Series",
      seriesDescription: "High-performance omnidirectional AGV",
      agvKinematic: "OMNI",
      agvClass: "CARRIER",
      maxLoadMass: 1000,
      localizationTypes: ["REFLECTOR", "RFID"],
      navigationTypes: ["VIRTUAL_LINE_GUIDED", "AUTONOMOUS"],
    },
    physicalParameters: {
      speedMin: 0.1,
      speedMax: 2.0,
      accelerationMax: 1.5,
      decelerationMax: 2.0,
      heightMin: 0.5,
      heightMax: 2.0,
      width: 0.8,
      length: 1.2,
    },
    protocolLimits: {
      maxStringLens: {
        msgLen: 1024,
        topicSerialLen: 20,
        topicElemLen: 50,
        idLen: 10,
        idNumericalOnly: false,
        enumLen: 20,
        loadIdLen: 15,
      },
      maxArrayLens: {
        "order.nodes": 50,
        "order.edges": 100,
        "node.actions": 10,
        "edge.actions": 5,
        "actions.actionsParameters": 20,
        instantActions: 5,
        "trajectory.knotVector": 100,
        "trajectory.controlPoints": 50,
        "state.nodeStates": 50,
        "state.edgeStates": 100,
        "state.loads": 10,
        "state.actionStates": 20,
        "state.errors": 5,
        "state.information": 10,
        "error.errorReferences": 3,
        "information.infoReferences": 2,
      },
      timing: {
        minOrderInterval: 0.5,
        minStateInterval: 0.2,
        defaultStateInterval: 1.0,
        visualizationInterval: 5.0,
      },
    },
    protocolFeatures: {
      optionalParameters: [
        {
          parameter: "order.nodes.nodePosition.allowedDeviationTheta",
          support: "REQUIRED",
          description: "Theta deviation allowed for node position",
        },
      ],
      agvActions: [
        {
          actionType: "CHARGE",
          actionDescription: "Charge the AGV at a charging station",
          actionScopes: ["INSTANT"],
          actionParameters: [
            {
              key: "chargingStationId",
              valueDataType: "STRING",
              description: "ID of the charging station",
            },
          ],
        },
      ],
    },
    agvGeometry: {
      wheelDefinitions: [
        {
          type: "DRIVE",
          isActiveDriven: true,
          isActiveSteered: false,
          position: {
            x: 0.2,
            y: 0.2,
          },
          diameter: 0.3,
          width: 0.1,
        },
      ],
      envelopes2d: [
        {
          set: "default",
          polygonPoints: [
            {
              x: 0,
              y: 0,
            },
            {
              x: 0.8,
              y: 0,
            },
            {
              x: 0.8,
              y: 1.2,
            },
            {
              x: 0,
              y: 1.2,
            },
          ],
        },
      ],
      envelopes3d: [
        {
          set: "default",
          format: "DXF",
          url: "ftp://example.com/agv_envelope.dxf",
        },
      ],
    },
    loadSpecification: {
      maxLoadHeight: 1.5,
      maxLoadWidth: 1.0,
      maxLoadLength: 1.2,
      loadPositions: [
        {
          id: "front",
          type: "FORK", // here..
          position: {
            x: 0.3,
            y: 0.5,
          },
        },
      ],
    },
  },
];
