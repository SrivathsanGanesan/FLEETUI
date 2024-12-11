const { get } = require("mongoose");
const { Map, Robo } = require("../../../application/models/mapSchema");

const eventStreamHeader = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
};

const getSampSeries = () => {
  let arr = [];
  for (let i = 1; i <= 5; i++) {
    arr.push({
      rate: Math.floor(Math.random() * 100),
      time: new Date().toLocaleString("en-IN", {
        // day: "numeric",
        hour: "numeric",
        minute: "numeric",
      }),
    });
  }
  return arr;
};

let throughPutArr = getSampSeries();
let starvationRateArr = getSampSeries();
let pickAccuracyArr = getSampSeries();
let errRateArr = getSampSeries();

let cpuUtilArr = getSampSeries();
let roboUtilArr = getSampSeries();
let batteryStatArr = getSampSeries();
let memoryStatArr = getSampSeries();
let networkStatArr = getSampSeries();
let idleTimeArr = getSampSeries();
let roboErrRateArr = getSampSeries();

const getFleetSeriesData = async (timeStamp1, timeStamp2, roboId, endpoint) => {
  
  let response = await fetch(
    `http://${process.env.FLEET_SERVER}:${process.env.FLEET_PORT}/fms/amr/${endpoint}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic cm9vdDp0b29y",
      },
      body: JSON.stringify({robotID:roboId, timeStamp1: timeStamp1, timeStamp2: timeStamp2 }),
    }
  );
  return await response.json();
};

const throughput = async (req, res, next) => {
  const mapId = req.params.mapId;
  const { timeSpan, timeStamp1, timeStamp2 } = req.body;
  try {
    //..
    const isMapExist = await Map.exists({ _id: mapId });
    if (!isMapExist)
      return res.status(500).json({ msg: "map not found!", map: null });

    const mapData = await Map.findOne({ _id: mapId });
    let fleetThroughput = await getFleetSeriesData( timeStamp1, timeStamp2, "get_throughput_stats" );
  
    return res.status(200).json({
      msg: "data sent",
      throughput: fleetThroughput,
    });
  } catch (err) {
    console.log("error occured : ", err);
    if (err.name === "CastError")
      return res.status(400).json({ error: err, msg: "not valid map Id" });
    res.status(500).json({ opt: "failed", error: err });
  }
};

const throughPut_starvation = async (req, res, next) => {
  const mapId = req.params.mapId;
  const { timeSpan, timeStamp1, timeStamp2 } = req.body;
  try {
    //..
    const isMapExist = await Map.exists({ _id: mapId });
    if (!isMapExist)
      return res.status(500).json({ msg: "map not found!", map: null });

    // const mapData = await Map.findOne({ _id: mapId });
    let fleetStarvation = await getFleetSeriesData( timeStamp1, timeStamp2, "get_throughput_starvationRate" );

    if (fleetStarvation.hasOwnProperty("starvationRate"))
      return res.status(200).json({
        msg: "data sent",
        starvation: fleetStarvation.starvationRate,
      });
    return res.status(200).json({
      msg: "data sent",
      starvation: null, // null in later
    });
  } catch (err) {
    console.log("error occured : ", err);
    if (err.name === "CastError")
      return res.status(400).json({ error: err, msg: "not valid map Id" });
    res.status(500).json({ opt: "failed", error: err });
  }
};

const throughPut_pickAccuracy = async (req, res, next) => {
  const mapId = req.params.mapId;
  const { timeSpan, timeStamp1, timeStamp2 } = req.body;
  try {
    //..
    const isMapExist = await Map.exists({ _id: mapId });
    if (!isMapExist)
      return res.status(500).json({ msg: "map not found!", map: null });

    // const mapData = await Map.findOne({ _id: mapId });
    let fleetThroughput = await getFleetSeriesData( timeStamp1, timeStamp2, "get_pickAccuracy" );

    return res.status(200).json({
      msg: "data sent",
      throughput: fleetThroughput,
    });
  } catch (err) {
    console.log("error occured : ", err);
    if (err.name === "CastError")
      return res.status(400).json({ error: err, msg: "not valid map Id" });
    res.status(500).json({ opt: "failed", error: err });
  }
};

const throughPut_errorRate = async (req, res, next) => {
  const mapId = req.params.mapId;
  const { timeSpan, timeStamp1, timeStamp2 } = req.body;
  try {
    //..
    const isMapExist = await Map.exists({ _id: mapId });
    if (!isMapExist)
      return res.status(500).json({ msg: "map not found!", map: null });

    // const mapData = await Map.findOne({ _id: mapId });
    let fleetErrRate = await getFleetSeriesData(
      timeStamp1,
      timeStamp2,
      "get_throughput_errorRate"
    );

    if (fleetErrRate.hasOwnProperty("errorRate"))
      return res.status(200).json({
        msg: "data sent",
        errRate: fleetErrRate.errorRate,
      });

    return res.status(200).json({
      msg: "data sent",
      errRate: null, // null in later
    });
  } catch (err) {
    console.log("error occured : ", err);
    if (err.name === "CastError")
      return res.status(400).json({ error: err, msg: "not valid map Id" });
    res.status(500).json({ opt: "failed", error: err });
  }
};

const starvationRate = async (req, res) => {
  const mapId = req.params.mapId;
  const { timeSpan } = req.body;
  try {
    const isMapExist = await Map.exists({ _id: mapId });
    if (!isMapExist)
      return res.status(500).json({ msg: "map not found!", map: null });
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

    if (timeSpan === "week")
      return res.status(200).json({
        msg: "data sent",
        starvation: Array.from({ length: 7 }, () => {
          return {
            rate: Math.floor(Math.random() * 100),
            time: new Date().toLocaleString("en-IN", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            }),
          };
        }),
      });
    else if (timeSpan === "month")
      return res.status(200).json({
        msg: "data sent",
        starvation: Array.from({ length: 30 }, () => {
          return {
            rate: Math.floor(Math.random() * 100),
            time: new Date().toLocaleString("en-IN", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            }),
          };
        }),
      });
    starvationRateArr.push({
      rate: Math.floor(Math.random() * 100),
      time: new Date().toLocaleString("en-IN", {
        hour: "numeric",
        minute: "numeric",
      }),
    });
    return res.status(200).json({
      msg: "data sent",
      starvation: starvationRateArr,
      map: mapData,
    });
  } catch (err) {
    console.log("error occured : ", err);
    if (err.name === "CastError")
      return res.status(400).json({ msg: "not valid map Id" });
    res.status(500).json({ opt: "failed", error: err });
  }
};

const pickAccuracy = async (req, res) => {
  const mapId = req.params.mapId;
  const { timeSpan } = req.body;
  try {
    const isMapExist = await Map.exists({ _id: mapId });
    if (!isMapExist)
      return res.status(500).json({ msg: "map not found!", map: null });
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

    if (timeSpan === "week")
      return res.status(200).json({
        msg: "data sent",
        pickAccuracy: Array.from({ length: 7 }, () => {
          return {
            rate: Math.floor(Math.random() * 100),
            time: new Date().toLocaleString("en-IN", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            }),
          };
        }),
      });
    else if (timeSpan === "month")
      return res.status(200).json({
        msg: "data sent",
        pickAccuracy: Array.from({ length: 30 }, () => {
          return {
            rate: Math.floor(Math.random() * 100),
            time: new Date().toLocaleString("en-IN", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            }),
          };
        }),
      });
    pickAccuracyArr.push({
      rate: Math.floor(Math.random() * 100),
      time: new Date().toLocaleString("en-IN", {
        hour: "numeric",
        minute: "numeric",
      }),
    });
    return res.status(200).json({
      msg: "data sent",
      pickAccuracy: pickAccuracyArr,
      map: mapData,
    });
  } catch (err) {
    console.log("error occured : ", err);
    if (err.name === "CastError")
      return res.status(400).json({ msg: "not valid map Id" });
    res.status(500).json({ opt: "failed", error: err });
  }
};

const errRate = async (req, res) => {
  const mapId = req.params.mapId;
  const { timeSpan } = req.body;
  try {
    const isMapExist = await Map.exists({ _id: mapId });
    if (!isMapExist)
      return res.status(500).json({ msg: "map not found!", map: null });
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

    if (timeSpan === "week")
      return res.status(200).json({
        msg: "data sent",
        errRate: Array.from({ length: 7 }, () => {
          return {
            rate: Math.floor(Math.random() * 100),
            time: new Date().toLocaleString("en-IN", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            }),
          };
        }),
      });
    else if (timeSpan === "month")
      return res.status(200).json({
        msg: "data sent",
        errRate: Array.from({ length: 30 }, () => {
          return {
            rate: Math.floor(Math.random() * 100),
            time: new Date().toLocaleString("en-IN", {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            }),
          };
        }),
      });
    errRateArr.push({
      rate: Math.floor(Math.random() * 100),
      time: new Date().toLocaleString("en-IN", {
        hour: "numeric",
        minute: "numeric",
      }),
    });
    return res.status(200).json({
      msg: "data sent",
      errRate: errRateArr,
      map: mapData,
    });
  } catch (err) {
    console.log("error occured : ", err);
    if (err.name === "CastError")
      return res.status(400).json({ msg: "not valid map Id" });
    res.status(500).json({ opt: "failed", error: err });
  }
};

////   CPU UTILIZATION //////
const getCpuUtilization = async (req, res) => {
  const mapId = req.params.mapId;
  const {roboId, timeSpan, timeStamp1, timeStamp2, metrics} = req.body;
  try {
    const isMapExist = await Map.exists({ _id: mapId });
    if (!isMapExist)
      return res.status(500).json({ msg: "map not found!", map: null });
    // const mapData = await Map.findOne({ _id: mapId });

    if (metrics === "Overall") {
      var API_requestdata = "get_cummulativeCPU_Utilization";
      var List_name = "cummulativeCPU_Utilization";
    } else {
      var API_requestdata = "get_CPU_Utilization";
      var List_name = "CPU_Utilization";
    }
    let fleetcpuutilization = await getFleetSeriesData( timeStamp1, timeStamp2, roboId, API_requestdata );

    // WEEK WISE //
    // if (timeSpan === "week")
    return res.status(200).json({
      msg: "data sent",
      cpuUtil: fleetcpuutilization,
    });

  } catch (err) {
    console.log("error occured : ", err);
    if (err.name === "CZastError")
      return res.status(400).json({ msg: "not valid map Id" });
    res.status(500).json({ opt: "failed", error: err });
  }
};

////////////   ROBOT UTILIZATION //////////////////////////
const getRoboUtilization = async (req, res) => {
  const mapId = req.params.mapId;
  API_data = req.body;
  // console.log(API_data)
  roboId = API_data["roboId"]
  timeSpan = API_data["timeSpan"];
  startTime = API_data["timeStamp1"];
  endTime = API_data["timeStamp2"];
  type = API_data["metrics"];
  try {
    // MAP ID //
    const isMapExist = await Map.exists({ _id: mapId });
    if (!isMapExist)
      return res.status(500).json({ msg: "map not found!", map: null });
    // const mapData = await Map.findOne({ _id: mapId });

    // if (type === "Overall") {
      var API_requestdata = "get_cummulativerobotUtilization";
      var List_name = "cummulativerobotUtilization";
    // } else {
    //   var API_requestdata = "get_robotUtilization";
    //   var List_name = "Robot_Utilization";
    // }

    // Fleet Server Communication ///
    let fleetROBOutilization = await getFleetSeriesData( startTime, endTime, roboId, API_requestdata );

    // WEEK WISE //
    // if (timeSpan === "week")
      return res.status(200).json({
        msg: "data sent",
        roboUtil: fleetROBOutilization,
      });
    // MONTH WISE //
    // else if (timeSpan === "month")
    //   return res.status(200).json({
    //     msg: "data sent",
    //     roboUtil: fleetROBOutilization,
    //   });
    // // PER DAY //
    // else if (timeSpan === "today")
    //   return res.status(200).json({
    //     msg: "data sent",
      //   roboUtil: fleetROBOutilization,
      // });
  } catch (err) {
    console.log("error occured : ", err);
    if (err.name === "CZastError")
      return res.status(400).json({ msg: "not valid map Id" });
    res.status(500).json({ opt: "failed", error: err });
  }
};

/// BATTERY ////
const getBatteryStat = async (req, res) => {
  const mapId = req.params.mapId;
  API_data = req.body;
  // console.log(API_data)
  roboId = API_data["roboId"]
  timeSpan = API_data["timeSpan"];
  startTime = API_data["timeStamp1"];
  endTime = API_data["timeStamp2"];
  type = API_data["metrics"];
  try {
    // MAP ID //
    const isMapExist = await Map.exists({ _id: mapId });
    if (!isMapExist)
      return res.status(500).json({ msg: "map not found!", map: null });
    const mapData = await Map.findOne({ _id: mapId });

    if (type === "Overall") {
      var API_requestdata = "get_cummulativebatteryPercentage";
      var List_name = "cummulativebatteryPercentage";
    } else {
      var API_requestdata = "get_robotBattery";
      var List_name = "batteryPercentage";
    }
    let fleetBATTERYutilization = await getFleetSeriesData(
      
      startTime,
      endTime,
      roboId,
      API_requestdata
    );
    // WEEK WISE //

    if (timeSpan === "week")
      return res.status(200).json({
        msg: "data sent",
        batteryStat: fleetBATTERYutilization,
      });
    // MONTH WISE //
    else if (timeSpan === "month")
      return res.status(200).json({
        msg: "data sent",
        batteryStat: fleetBATTERYutilization,
      });
    // PER DAY //
    else if (timeSpan === "today")
      return res.status(200).json({
        msg: "data sent",
        batteryStat: fleetBATTERYutilization,
      });
  } catch (err) {
    console.log("error occured : ", err);
    if (err.name === "CZastError")
      return res.status(400).json({ msg: "not valid map Id" });
    res.status(500).json({ opt: "failed", error: err });
  }
};

/// MEMORY //
const getMemoryStat = async (req, res) => {
  const mapId = req.params.mapId;
  API_data = req.body;
  // console.log(API_data)
  roboId = API_data["roboId"]
  timeSpan = API_data["timeSpan"];
  startTime = API_data["timeStamp1"];
  endTime = API_data["timeStamp2"];
  type = API_data["metrics"];
  try {
    // MAP ID //
    const isMapExist = await Map.exists({ _id: mapId });
    if (!isMapExist)
      return res.status(500).json({ msg: "map not found!", map: null });
    // const mapData = await Map.findOne({ _id: mapId });

    if (type === "Overall") {
      var API_requestdata = "get_cummulativerobotMemory";
      var List_name = "cummlativeMemory";
    } else {
      var API_requestdata = "get_robotMemory";
      var List_name = "robot_Memory";
    }

    let fleetMEMORYutilization = await getFleetSeriesData(startTime, endTime,roboId, API_requestdata );

    // if (timeSpan === "week")
      return res.status(200).json({
        msg: "data sent",
        memoryStat: fleetMEMORYutilization,
      });
    // MONTH WISE //
    // else if (timeSpan === "month")
    //   return res.status(200).json({
    //     msg: "data sent",
    //     memoryStat: fleetMEMORYutilization,
    //   });
    // // PER DAY //
    // else if (timeSpan === "today")
    //   return res.status(200).json({
    //     msg: "data sent",
    //     memoryStat: fleetMEMORYutilization,
    //   });
  } catch (err) {
    console.log("error occured : ", err);
    if (err.name === "CZastError")
      return res.status(400).json({ msg: "not valid map Id" });
    res.status(500).json({ opt: "failed", error: err });
  }
};

// Netwrok
const getNetworkStat = async (req, res) => {
  const mapId = req.params.mapId;
  API_data = req.body;
  // console.log(API_data)  
  roboId = API_data["roboId"],
  timeSpan = API_data["timeSpan"];
  startTime = API_data["timeStamp1"];
  endTime = API_data["timeStamp2"];
  type = API_data["metrics"];
  try {
    // MAP ID //
    const isMapExist = await Map.exists({ _id: mapId });
    if (!isMapExist)
      return res.status(500).json({ msg: "map not found!", map: null });
    // const mapData = await Map.findOne({ _id: mapId });

    if (type === "Overall") {
      var API_requestdata = "get_cummulativeNetwork";
      var List_name = "cummulativeNetwork";
    } else {
      var API_requestdata = "get_robotNetwork";
      var List_name = "robot_Network";
    }

    let fleetNETWORKKutilization = await getFleetSeriesData(
      
      startTime,
      endTime,
      roboId,
      API_requestdata
    );

    // WEEK WISE //
    // if (timeSpan === "week")
      return res.status(200).json({
        msg: "data sent",
        networkUtil: fleetNETWORKKutilization,
      });
    // MONTH WISE //
    // else if (timeSpan === "month")
    //   return res.status(200).json({
    //     msg: "data sent",
    //     networkUtil: fleetNETWORKKutilization,
    //   });
    // // PER DAY //
    // else if (timeSpan === "today")
    //   return res.status(200).json({
    //     msg: "data sent",
    //     networkUtil: fleetNETWORKKutilization,
    //   });
  } catch (err) {
    console.log("error occured : ", err);
    if (err.name === "CZastError")
      return res.status(400).json({ msg: "not valid map Id" });
    res.status(500).json({ opt: "failed", error: err });
  }
};

// IDLE Time
const getIdleTime = async (req, res) => {
  const mapId = req.params.mapId;
  API_data = req.body;
  // console.log(API_data)  
  roboId = API_data["roboId"];
  timeSpan = API_data["timeSpan"];
  startTime = API_data["timeStamp1"];
  endTime = API_data["timeStamp2"];
  type = API_data["metrics"];
  try {
    // MAP ID //
    const isMapExist = await Map.exists({ _id: mapId });
    if (!isMapExist)
      return res.status(500).json({ msg: "map not found!", map: null });
    const mapData = await Map.findOne({ _id: mapId });

    if (type === "Overall") {
      var API_requestdata = "get_cummulativeIdleTime";
      var List_name = "cummulativeidle_Time";
    } else {
      var API_requestdata = "get_Idle_Time";
      var List_name = "cummulativeidle_Time";
    }

    let fleetIDLEUtilization = await getFleetSeriesData(
      startTime,
      endTime,
      roboId,
      API_requestdata
    );

    // WEEK WISE //
    if (timeSpan === "week")
      return res.status(200).json({
        msg: "data sent",
        idleTime: fleetIDLEUtilization,
      });
    // MONTH WISE //
    else if (timeSpan === "month")
      return res.status(200).json({
        msg: "data sent",
        idleTime: fleetIDLEUtilization,
      });
    // PER DAY //
    else if (timeSpan === "today")
      return res.status(200).json({
        msg: "data sent",
        idleTime: fleetIDLEUtilization,
      });
  } catch (err) {
    console.log("error occured : ", err);
    if (err.name === "CZastError")
      return res.status(400).json({ msg: "not valid map Id" });
    res.status(500).json({ opt: "failed", error: err });
  }
};

// ROBOErro //
const getRoboErr = async (req, res) => {
  const mapId = req.params.mapId;
  API_data = req.body;
  timeSpan = API_data["timeSpan"];
  roboId = API_data["roboId"];
  startTime = API_data["timeStamp1"];
  endTime = API_data["timeStamp2"];
  type = API_data["metrics"];
  try {
    // MAP ID //
    const isMapExist = await Map.exists({ _id: mapId });
    if (!isMapExist)
      return res.status(500).json({ msg: "map not found!", map: null });
    const mapData = await Map.findOne({ _id: mapId });

    if (type === "Overall") {
      var API_requestdata = "get_cummulativerobotError";
      var List_name = "cummulativerobotError";
    } else {
      var API_requestdata = "get_robotError";
      var List_name = "robot_Error";
    }
    let fleetError = await getFleetSeriesData(      
      startTime,
      endTime,
      roboId,
      API_requestdata
    );
    // WEEK WISE //
    // if (timeSpan === "week")
      return res.status(200).json({
        msg: "data sent",
        roboErr: fleetError,
      });
    // MONTH WISE //
    // else if (timeSpan === "month")
    //   return res.status(200).json({
    //     msg: "data sent",
    //     roboErr: fleetError,
    //   });
    // // PER DAY //
    // else if (timeSpan === "today")
    //   return res.status(200).json({
    //     msg: "data sent",
    //     roboErr: fleetError,
    //   });
  } catch (err) {
    console.log("error occured : ", err);
    if (err.name === "CZastError")
      return res.status(400).json({ msg: "not valid map Id" });
    res.status(500).json({ opt: "failed", error: err });
  }
};

module.exports = {
  throughput,
  starvationRate,
  pickAccuracy,
  errRate,
  getCpuUtilization,
  getRoboUtilization,
  getBatteryStat,
  getMemoryStat,
  getNetworkStat,
  getIdleTime,
  getRoboErr,
  throughPut_starvation,
  throughPut_pickAccuracy,
  throughPut_errorRate,
};
