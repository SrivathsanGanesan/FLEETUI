const { Map, Robo } = require("../../../application/models/mapSchema");

//.. Task
const getFleetTaskErrLogs = async (endpoint, bodyData) => {
  let response = await fetch(
    `http://${process.env.FLEET_SERVER}:${process.env.FLEET_PORT}/fms/amr/${endpoint}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic cm9vdDp0b29y",
      },
      body: JSON.stringify(bodyData),
    }
  );
  return await response.json();
};

const getTaskErrLogs = async (req, res) => {
  const mapId = req.params.mapId;
  const { timeStamp1, timeStamp2 } = req.body;
  try {
    let isMapExists = await Map.exists({ _id: mapId });
    if (!isMapExists)
      return res.status(500).json({ msg: "map not exists", map: null });

    let bodyData = {
      timeStamp1: timeStamp1,
      timeStamp2: timeStamp2,
    };

    let FleetTaskErrLogs = await getFleetTaskErrLogs(
      "get_tasks_errors",
      bodyData
    );

    // console.log(FleetTaskErrLogs)
    if (FleetTaskErrLogs && FleetTaskErrLogs.hasOwnProperty("tasks"))
      return res
        .status(200)
        .json({ taskErr: FleetTaskErrLogs.tasks, map: true, msg: "data sent" });
    FleetTaskErrLogs = [];
    return res.status(200).json({
      taskErr: FleetTaskErrLogs,
      map: true,
      msg: "data sent, no tasks are found!",
    });
  } catch (err) {
    console.error("Error in taskLogs:", err.cause);
    if (err.name === "CastError")
      return res.status(400).json({ msg: "not valid map Id" });
    res.status(500).json({ error: err.message, msg: "Internal Server Error" });
  }
};

const getRoboErrLogs = async (req, res) => {
  const mapId = req.params.mapId;
  try {
    let isMapExists = await Map.exists({ _id: mapId });
    if (!isMapExists)
      return res.status(500).json({ msg: "map not exists", map: null });

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

const getFleetErrLogs = async (req, res) => {
  const mapId = req.params.mapId;
  try {
    let isMapExists = await Map.exists({ _id: mapId });
    if (!isMapExists)
      return res.status(500).json({ msg: "map not exists", map: null });

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
  getTaskErrLogs,
  getRoboErrLogs,
  getFleetErrLogs,
};
