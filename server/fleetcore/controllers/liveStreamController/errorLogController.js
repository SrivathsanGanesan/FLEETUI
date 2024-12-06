const { Map, Robo } = require("../../../application/models/mapSchema");

//.. Task
const getFleetTaskErrLogs = async (endpoint) => {
  let response = await fetch(
    `http://${process.env.FLEET_SERVER}:${process.env.FLEET_PORT}/fms/amr/${endpoint}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic cm9vdDp0b29y",
      },
      body: JSON.stringify({}),
    }
  );
  return await response.json();
  };

// const getFleetTaskErrLogs = (req, res, next) => {
//   fetch(`http://${process.env.FLEET_SERVER}:${process.env.FLEET_PORT}/fms/amr/get_tasks_errors${endpoint}`, {
//     method: "POST",
//     credentials: "include",
//     body: JSON.stringify({ timeStamp1: "", timeStamp2: "" }),
//   })
//     .then((response) => {
//       if (!response.ok) {
//         req.responseStatus = "NOT_OK";
//         return next();
//       }
//       return response.json();
//     })
//     .then((data) => {
//       console.log(data);
//       req.fleetData = data;
//     })
//     .catch((err) => {
//       req.fleetErr = err;
//     });
//   next();
// };

//.. Task error
// const getTaskError= async (req, res, next) => {
//   console.log('task error called')
// try {
// //..
// let taskErrorLog = await getFleetSeriesData(
// '',
// '',
// "get_tasks_errors"
// );
// console.log(taskErrorLog,'fleet starvation')
// console.log(timeSpan,'time span')
// console.log(timeStamp1,'timestamp 1')
// console.log(timeStamp2,'timestamp 2')

// return res.status(200).json({
// msg: "data sent",
// // throughput: throughPutArr,
// throughput: taskErrorLog,
// });
// } catch (err) {
// console.log("error occured : ", err);
// if (err.name === "CastError")
// return res.status(400).json({ error: err, msg: "not valid map Id" });
// res.status(500).json({ opt: "failed", error: err });
// }
// };

//.. task error server log
// const getFleetSeriesData = async (timeStamp1, timeStamp2, endpoint) => {
//   let response = await fetch(
//     `http://${process.env.FLEET_SERVER}:${process.env.FLEET_PORT}/fms/amr/${endpoint}`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: "Basic cm9vdDp0b29y",
//       },
//       body: JSON.stringify({ timeStamp1: timeStamp1, timeStamp2: timeStamp2 }),
//     }
//   );
//   // console.log(await response.json(),"data from fleet server")
//   return await response.json();
// };

const getTaskErrLogs = async (req, res) => {
  console.log('task')
  const mapId = req.params.mapId;
  try {
    let isMapExists = await Map.exists({ _id: mapId });
    if (!isMapExists)
      return res.status(500).json({ msg: "map not exists", map: null });
    const map = await Map.findOne({ _id: mapId });
    if (!map) return res.status(500).json({ map: map, msg: "Map not exists!" });
    let FleetTaskErrLogs = await getFleetTaskErrLogs(
      "get_tasks_errors"
    )
    console.log(FleetTaskErrLogs)
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
  fetch(`http://${process.env.FLEET_SERVER}:${process.env.FLEET_PORT}/fms/amr/${endpoint}`, {
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

//.. Task error
// const getTaskError= async (req, res, next) => {
//   console.log('task error called')
// try {
// //..
// let taskErrorLog = await getFleetSeriesData(
// '',
// '',
// "get_tasks_errors"
// );
// console.log(taskErrorLog,'fleet starvation')
// console.log(timeSpan,'time span')
// console.log(timeStamp1,'timestamp 1')
// console.log(timeStamp2,'timestamp 2')

// return res.status(200).json({
// msg: "data sent",
// // throughput: throughPutArr,
// throughput: taskErrorLog,
// });
// } catch (err) {
// console.log("error occured : ", err);
// if (err.name === "CastError")
// return res.status(400).json({ error: err, msg: "not valid map Id" });
// res.status(500).json({ opt: "failed", error: err });
// }
// };

// //.. task error server log
// const getFleetSeriesData = async (timeStamp1, timeStamp2, endpoint) => {
//   let response = await fetch(
//     `http://${process.env.FLEET_SERVER}:${process.env.FLEET_PORT}/fms/amr/${endpoint}`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: "Basic cm9vdDp0b29y",
//       },
//       body: JSON.stringify({ timeStamp1: timeStamp1, timeStamp2: timeStamp2 }),
//     }
//   );
//   // console.log(await response.json(),"data from fleet server")
//   return await response.json();
// };


module.exports = {
  getFleetTaskErrLogs,
  getTaskErrLogs,
  getFleetRoboErrLogs,
  getRoboErrLogs,
  getFleetCoreErrLogs,
  getFleetErrLogs,
  // getTaskError
};
