const { Map, Robo } = require("../../../application/models/mapSchema");

let errTaskLogs = {
  notifications: [
    {
      name: "ERR001",
      description: "Battery low",
      fix: ["Recharge the battery"],
      criticality: 2,
      // icon: "fa-solid fa-circle-exclamation",
    },
    {
      name: "ERR002",
      description: "Obstacle detected",
      fix: ["Clear the path"],
      criticality: 3,
      // icon: "fa-solid fa-circle-exclamation",
    },
    {
      name: "ERR003",
      description: "Battery low",
      fix: ["Recharge the battery"],
      criticality: 2,
      // icon: "fa-solid fa-circle-exclamation",
    },
  ],
};

let errRoboLogs = {
  stats: {
    table: [
      {
        name: "ERROR LIST",
        values: [
          {
            ROBOT_ID: "1",
            ROBOT_NAME: "AMR_01",
            ERROR_NAME: "Navigation Failure",
            DESCRIPTION:
              "The robot failed to navigate to the desired location.",
            FIX: "Recalibrate sensors and retry.",
            Duration: "5 minutes",
            ROBOT_STATE: "Error",
            TASKID: "123",
            TASKSTATUS: "Pending",
            SUBTASKSTATUS: "Not Started",
            ROBOTPOSITION: "Warehouse Section A",
          },
          {
            ROBOT_ID: "2",
            ROBOT_NAME: "AMR_02",
            ERROR_NAME: "Battery Low",
            DESCRIPTION: "Battery level dropped below threshold.",
            FIX: "Send robot to charging station.",
            Duration: "15 minutes",
            ROBOT_STATE: "Idle",
            TASKID: "124",
            TASKSTATUS: "Completed",
            SUBTASKSTATUS: "Charging",
            ROBOTPOSITION: "Docking Station 2",
          },
        ],
      },
    ],
  },
};

let errFleetLogs = {
  fleetStats: [
    {
      moduleName: "inspection",
      errCode: 1,
      criticality: 3,
      desc: "need to get verify",
    },
    {
      moduleName: "maintanence",
      errCode: 4,
      criticality: 4,
      desc: "N/A",
    },
    {
      moduleName: "N/A",
      errCode: 0,
      criticality: 0,
      desc: "N/A",
    },
  ],
};

//.. Task
const getFleetTaskErrLogs = (req, res, next) => {
  fetch(`http://fleetIp:8080/fms/amr/get_tasks_list`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ timeStamp1: "", timeStamp2: "" }),
  })
    .then((response) => {
      if (!response.ok) {
        req.responseStatus = "NOT_OK";
        return next();
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      req.fleetData = data;
    })
    .catch((err) => {
      req.fleetErr = err;
    });
  next();
};

const getTaskErrLogs = async (req, res) => {
  const mapId = req.params.mapId;
  try {
    let isMapExists = await Map.exists({ _id: mapId });
    if (!isMapExists)
      return res.status(500).json({ msg: "map not exists", map: null });
    const map = await Map.findOne({ _id: mapId });
    if (!map) return res.status(500).json({ map: map, msg: "Map not exists!" });
    return res.status(200).json({ taskLogs: errTaskLogs, msg: "data sent" });
  } catch (err) {
    console.error("Error in taskLogs:", err);
    if (err.name === "CastError")
      return res.status(400).json({ msg: "not valid map Id" });
    res.status(500).json({ error: err.message, msg: "Internal Server Error" });
  }
};

//.. Robot
const getFleetRoboErrLogs = (req, res, next) => {
  fetch(`http://fleetIp:8080/fms/amr/getRobotStats`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ timeStamp1: "", timeStamp2: "" }),
  })
    .then((response) => {
      if (!response.ok) {
        req.responseStatus = "NOT_OK";
        return next();
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      req.fleetData = data;
    })
    .catch((err) => {
      req.fleetErr = err;
    });
  next();
};

const getRoboErrLogs = async (req, res) => {
  const mapId = req.params.mapId;
  try {
    let isMapExists = await Map.exists({ _id: mapId });
    if (!isMapExists)
      return res.status(500).json({ msg: "map not exists", map: null });
    const map = await Map.findOne({ _id: mapId });
    if (!map) return res.status(500).json({ map: map, msg: "Map not exists!" });
    return res
      .status(200)
      .json({ roboLogs: errRoboLogs.stats, msg: "data sent" });
  } catch (err) {
    console.error("Error in taskLogs:", err);
    if (err.name === "CastError")
      return res.status(400).json({ msg: "not valid map Id" });
    res.status(500).json({ error: err.message, msg: "Internal Server Error" });
  }
};

//.. Fleet
const getFleetCoreErrLogs = (req, res, next) => {
  fetch(`http://fleetIp:8080/------`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ timeStamp1: "", timeStamp2: "" }),
  })
    .then((response) => {
      if (!response.ok) {
        req.responseStatus = "NOT_OK";
        return next();
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      req.fleetData = data;
    })
    .catch((err) => {
      req.fleetErr = err;
    });
  next();
};

const getFleetErrLogs = async (req, res) => {
  const mapId = req.params.mapId;
  try {
    let isMapExists = await Map.exists({ _id: mapId });
    if (!isMapExists)
      return res.status(500).json({ msg: "map not exists", map: null });
    const map = await Map.findOne({ _id: mapId });
    if (!map) return res.status(500).json({ map: map, msg: "Map not exists!" });
    return res
      .status(200)
      .json({ fleetLogs: errFleetLogs.fleetStats, msg: "data sent" });
  } catch (err) {
    console.error("Error in taskLogs:", err);
    if (err.name === "CastError")
      return res.status(400).json({ msg: "not valid map Id" });
    res.status(500).json({ error: err.message, msg: "Internal Server Error" });
  }
};

module.exports = {
  getFleetTaskErrLogs,
  getTaskErrLogs,
  getFleetRoboErrLogs,
  getRoboErrLogs,
  getFleetCoreErrLogs,
  getFleetErrLogs,
};