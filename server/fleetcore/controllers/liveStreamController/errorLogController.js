const { Map, Robo } = require("../../../application/models/mapSchema");

let errTaskLogs = {
  notifications: [
    {
      name: "ERR001",
      description: "Battery low",
      fix: ["Recharge the battery"],
      criticality: 2,
      icon: "fa-solid fa-circle-exclamation",
    },
    {
      name: "ERR002",
      description: "Obstacle detected",
      fix: ["Clear the path"],
      criticality: 3,
      icon: "fa-solid fa-circle-exclamation",
    },
    {
      name: "ERR003",
      description: "Battery low",
      fix: ["Recharge the battery"],
      criticality: 2,
      icon: "fa-solid fa-circle-exclamation",
    },
  ],
};

const getFleetErrLogs = (req, res, next) => {
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
    const map = await Map.findOne({ _id: mapId });
    if (!map) return res.status(500).json({ map: map, msg: "Map not exists!" });
    return res.status(200).json({ taskLogs: errTaskLogs, msg: "data sent" });
  } catch (err) {
    console.error("Error in taskLogs:", err);
    res.status(500).json({ error: err.message, msg: "Internal Server Error" });
  }
};

module.exports = { getFleetErrLogs, getTaskErrLogs };
