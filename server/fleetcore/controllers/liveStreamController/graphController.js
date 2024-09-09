const { Map, Robo } = require("../../../application/models/mapSchema");

const eventStreamHeader = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
};
//..

const getFleetThroughput = (req, res, next) => {
  fetch(`http://fleetIp:8080/fms/amr/get_throughput_stats`, {
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

const throughput = async (req, res, next) => {
  const mapId = req.params.mapId;
  try {
    //..
    const isMapExist = await Map.exists({ _id: mapId });
    if (!isMapExist)
      return res.status(500).json({ msg: "map not found!", map: null });
    let dummyStat = [
      {
        TotalNumberRobots: 5,
        TotalTimeElasped: 3600,
        TotalTaskCount: 100,
        TotalThroughPutPerHour: 12,
        TimeStamp: 1725305782000,
      },
      {
        TotalNumberRobots: 4,
        TotalTimeElasped: 3600,
        TotalTaskCount: 90,
        TotalThroughPutPerHour: 22.5,
        TimeStamp: 1725309382000,
      },
      {
        TotalNumberRobots: 5,
        TotalTimeElasped: 3600,
        TotalTaskCount: 100,
        TotalThroughPutPerHour: 75,
        TimeStamp: 1725312982000,
      },
      {
        TotalNumberRobots: 4,
        TotalTimeElasped: 3600,
        TotalTaskCount: 90,
        TotalThroughPutPerHour: 28.5,
        TimeStamp: 1725402987000,
      },
      {
        TotalNumberRobots: 5,
        TotalTimeElasped: 3600,
        TotalTaskCount: 100,
        TotalThroughPutPerHour: 45,
        TimeStamp: 1725406587000,
      },
    ];
    let InProgress = 3;
    const mapData = await Map.findOne({ _id: mapId });
    // const mapData = await Map.findOneAndUpdate(
    //   { _id: mapId },
    //   {
    //     $push: {
    //       "throughPut.Stat": { $each: dummyStat }, // can push multiple entries to the array using $each
    //       "throughPut.inProg": InProgress,
    //     },
    //   },
    //   { new: true }
    // );
    // let throughput = mapData.throughPut;

    return res.status(200).json({
      msg: "data sent",
      throughput: { Stat: dummyStat, InProgress: InProgress },
      // throughput: throughput,
    });
  } catch (err) {
    console.log("error occured : ", err);
    if (err.name === "CastError")
      return res.status(400).json({ msg: "not valid map Id" });
    res.status(500).json({ opt: "failed", error: err });
  }
};

const getStarvationRate = (req, res, next) => {
  fetch(`http://fleetIp:8080/-----`, {
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

const starvationRate = async (req, res) => {
  const mapId = req.params.mapId;
  try {
    //..
    let dummyStat = [];
    const mapData = await Map.findOne({ _id: mapId });
    // const mapData = await Map.findOneAndUpdate(
    //   { _id: mapId },
    //   {
    //     $push: {
    //       "throughPut.Stat": { $each: dummyStat }, // can push multiple entries to the array using $each
    //       "throughPut.inProg": InProgress,
    //     },
    //   },
    //   { new: true }
    // );

    return res.status(200).json({
      msg: "data sent",
      starvationRate: [],
    });
  } catch (err) {
    console.log("error occured : ", err);
    if (err.name === "CastError")
      return res.status(400).json({ msg: "not valid map Id" });
    res.status(500).json({ opt: "failed", error: err });
  }
};

module.exports = {
  getFleetThroughput,
  throughput,
  getStarvationRate,
  starvationRate,
};
