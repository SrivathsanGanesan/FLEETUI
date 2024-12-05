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

///////////////////// Getting the graph charts data's for throughput module ///////////////////////
// const getFleetSeriesData = async (timeStamp1, timeStamp2, endpoint) => {
//   console.log(endpoint)
//   console.log("fleet server has runned")
//   let response = await fetch(
//     `http://${process.env.FLEET_SERVER}:${process.env.FLEET_PORT}/fms/amr/${endpoint}`,
//     {
//       method: "POST",
//       headers: {
//         credentials: "include",
//         "Content-Type": "application/json",
//         Authorization: "Basic cm9vdDp0b29y",
//       },
//       body: JSON.stringify({ timeStamp1: timeStamp1, timeStamp2: timeStamp2}),
//     }
//   );
//   console.log(await response.json(),"data from fleet server")
//   return await response.json();
// };

const getFleetSeriesData = async (timeStamp1, timeStamp2, endpoint) => {
  // console.log('cup data')
  console.log(timeStamp1,'time stamp1')
  console.log(timeStamp2,'time stamp2')
  console.log(endpoint,'endpoint')
  let response = await fetch(
    `http://${process.env.FLEET_SERVER}:${process.env.FLEET_PORT}/fms/amr/${endpoint}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic cm9vdDp0b29y",
      },
      body: JSON.stringify({timeStamp1: timeStamp1, timeStamp2: timeStamp2}),
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
    let fleetThroughput = await getFleetSeriesData(
      timeStamp1,
      timeStamp2,
      "get_throughput_stats"
    );
      console.log('fleet throughput')
      // console.log(timeSpan,'time span')
      // console.log(timeStamp1,'timestamp 1')
      // console.log(timeStamp2,'timestamp 2')

// start
    // if (timeSpan === "week")
    //   return res.status(200).json({
    //     msg: "data sent week",
    //     throughput: Array.from({ length: 7 }, () => {
    //       return {
    //         rate: Math.floor(Math.random() * 100),
    //         time: new Date().toLocaleString("en-IN", {
    //           month: "short",
    //           day: "numeric",
    //           hour: "numeric",
    //           minute: "numeric",
    //         }),
    //       };
    //     }),
    //   });
    // else if (timeSpan === "month")
    //   return res.status(200).json({
    //     msg: "data sent",
    //     throughput: Array.from({ length: 30 }, () => {
    //       return {
    //         rate: Math.floor(Math.random() * 100),
    //         time: new Date().toLocaleString("en-IN", {
    //           month: "short",
    //           day: "numeric",
    //           hour: "numeric",
    //           minute: "numeric",
    //         }),
    //       };
    //     }),
    //   });
// end
    /* throughPutArr.push({
      rate: Math.floor(Math.random() * 100),
      time: new Date().toLocaleString("en-IN", {
        hour: "numeric",
        minute: "numeric",
      }),
    }); */
    return res.status(200).json({
      msg: "data sent",
      // throughput: throughPutArr,
      throughput: fleetThroughput,
    });
  } catch (err) {
    console.log("error occured : ", err);
    if (err.name === "CastError")
      return res.status(400).json({ error: err, msg: "not valid map Id" });
    res.status(500).json({ opt: "failed", error: err });
  }
};

const throughPut_starvation =async (req, res, next) => {
         console.log('starvation called')
  const mapId = req.params.mapId;
  const { timeSpan, timeStamp1, timeStamp2 } = req.body;
  try {
    //..
    const isMapExist = await Map.exists({ _id: mapId });
    if (!isMapExist)
      return res.status(500).json({ msg: "map not found!", map: null });

    const mapData = await Map.findOne({ _id: mapId });
    let fleetThroughput = await getFleetSeriesData(
      timeStamp1,
      timeStamp2,
      "get_throughput_starvationTime"
    );
      console.log(fleetThroughput,'fleet starvation')
      console.log(timeSpan,'time span')
      console.log(timeStamp1,'timestamp 1')
      console.log(timeStamp2,'timestamp 2')

    return res.status(200).json({
      msg: "data sent",
      // throughput: throughPutArr,
      throughput: fleetThroughput,
    });
  } catch (err) {
    console.log("error occured : ", err);
    if (err.name === "CastError")
      return res.status(400).json({ error: err, msg: "not valid map Id" });
    res.status(500).json({ opt: "failed", error: err });
  }
};

const throughPut_pickAccuracy =async (req, res, next) => {
  console.log('pick acc called')
const mapId = req.params.mapId;
const { timeSpan, timeStamp1, timeStamp2 } = req.body;
try {
//..
const isMapExist = await Map.exists({ _id: mapId });
if (!isMapExist)
return res.status(500).json({ msg: "map not found!", map: null });

const mapData = await Map.findOne({ _id: mapId });
let fleetThroughput = await getFleetSeriesData(
timeStamp1,
timeStamp2,
"get_pickAccuracy"
);
console.log(fleetThroughput,'fleet pick acc')
console.log(timeSpan,'time span')
console.log(timeStamp1,'timestamp 1')
console.log(timeStamp2,'timestamp 2')

return res.status(200).json({
msg: "data sent",
// throughput: throughPutArr,
throughput: fleetThroughput,
});
} catch (err) {
console.log("error occured : ", err);
if (err.name === "CastError")
return res.status(400).json({ error: err, msg: "not valid map Id" });
res.status(500).json({ opt: "failed", error: err });
}
};

const throughPut_errorRate =async (req, res, next) => {
  console.log('err acc called')
const mapId = req.params.mapId;
const { timeSpan, timeStamp1, timeStamp2 } = req.body;
try {
//..
const isMapExist = await Map.exists({ _id: mapId });
if (!isMapExist)
return res.status(500).json({ msg: "map not found!", map: null });

const mapData = await Map.findOne({ _id: mapId });
let fleetThroughput = await getFleetSeriesData(
timeStamp1,
timeStamp2,
"get_throughput_errorRate"
);
console.log(fleetThroughput,'fleet err acc')
console.log(timeSpan,'time span')
console.log(timeStamp1,'timestamp 1')
console.log(timeStamp2,'timestamp 2')

return res.status(200).json({
msg: "data sent",
// throughput: throughPutArr,
throughput: fleetThroughput,
});
} catch (err) {
console.log("error occured : ", err);
if (err.name === "CastError")
return res.status(400).json({ error: err, msg: "not valid map Id" });
res.status(500).json({ opt: "failed", error: err });
}
};


const getFleetStarvation = (req, res, next) => {
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

const getFleetPickAccuracy = async (req, res) => {
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

const getFleetErrRate = async (req, res) => {
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

// robo..
const getRoboFleetGraph = async () => {
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

////   CPU UTILIZATION //////
const getCpuUtilization = async (req, res) => {
  console.log("CPU request has excuted")
  const mapId = req.params.mapId;
  API_data = req.body;
  // console.log(API_data)
  timeSpan = API_data['timeSpan']
  startTime = API_data['timeStamp1']
  endTime  = API_data['timeStamp2']
  type     = API_data['metrics']
  // console.log(timeSpan, startTime, endTime,'-----------------------------------------node backend')
  try {
    // MAP ID //
    const isMapExist = await Map.exists({ _id: mapId });
    if (!isMapExist)
      return res.status(500).json({ msg: "map not found!", map: null });
    const mapData = await Map.findOne({ _id: mapId });

    if (type === 'Overall'){
      var API_requestdata = "get_cummulativeCPU_Utilization"
      var  List_name = "cummulativeCPU_Utilization"

    } else {
      var API_requestdata = "get_CPU_Utilization"
      var List_name  = "CPU_Utilization"
    }
    var fleetcpuutilization = await getFleetSeriesData(
      startTime,
      endTime,
      API_requestdata
    )
    
    console.log(fleetcpuutilization,'fleet cpu-------------------------------')
    // WEEK WISE //
    if (timeSpan === "week")
      return res.status(200).json({
        msg: "data sent",
        cpuUtil:fleetcpuutilization
      });
    // MONTH WISE //
    else if (timeSpan === "month")
      return res.status(200).json({
        msg: "data sent",
        cpuUtil:fleetcpuutilization
      });
    // PER DAY //
    else if (timeSpan === "today")
      console.log("body has excuted")
      return res.status(200).json({
        msg: "data sent",
        cpuUtil:fleetcpuutilization
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
  console.log("ROBO request has excuted")
  const mapId = req.params.mapId;
  API_data = req.body;
  // console.log(API_data)
  timeSpan = API_data['timeSpan']
  startTime = API_data['timeStamp1']
  endTime  = API_data['timeStamp2']
  type     = API_data['metrics']
  // console.log(timeSpan, startTime, endTime)
  try {
    // MAP ID //
    const isMapExist = await Map.exists({ _id: mapId });
    if (!isMapExist)
      return res.status(500).json({ msg: "map not found!", map: null });
    const mapData = await Map.findOne({ _id: mapId });

    if (type === 'Overall'){
      var API_requestdata = "get_cummulativerobotUtilization"
      var  List_name = "cummulativerobotUtilization"

    } else {
      var API_requestdata = "get_robotUtilization"
      var List_name  = "Robot_Utilization"
    }
    
    // Fleet Server Communication ///
    let fleetROBOutilization = await getFleetSeriesData(
      startTime,
      endTime,
      API_requestdata
    )    
    console.log(fleetROBOutilization,'fleet robot-------------------------------')
  
    // WEEK WISE //
    if (timeSpan === "week")
      return res.status(200).json({
        msg: "data sent",
        roboUtil:fleetROBOutilization
      });
    // MONTH WISE //
    else if (timeSpan === "month")
      return res.status(200).json({
        msg: "data sent",
        roboUtil:fleetROBOutilization
      });
    // PER DAY //
    else if (timeSpan === "today")
      return res.status(200).json({
        msg: "data sent",
        roboUtil:fleetROBOutilization
      });

  } catch (err) {
    console.log("error occured : ", err);
    if (err.name === "CZastError")
      return res.status(400).json({ msg: "not valid map Id" });
    res.status(500).json({ opt: "failed", error: err });
  }
};

/// BATTERY ////
const getBatteryStat = async (req, res) => {
  console.log("BATTERY request has excuted")
  const mapId = req.params.mapId;
  API_data = req.body;
  // console.log(API_data)
  timeSpan = API_data['timeSpan']
  startTime = API_data['timeStamp1']
  endTime  = API_data['timeStamp2']
  type     = API_data['metrics']
  // console.log(timeSpan, startTime, endTime)
  try {
    // MAP ID //
    const isMapExist = await Map.exists({ _id: mapId });
    if (!isMapExist)
      return res.status(500).json({ msg: "map not found!", map: null });
    const mapData = await Map.findOne({ _id: mapId });

    if (type === 'Overall'){
      var API_requestdata = "get_cummulativebatteryPercentage"
      var  List_name = "cummulativebatteryPercentage"
      
    } else {
      var API_requestdata = "get_robotBattery"
      var List_name  = "batteryPercentage"
    }
    let fleetBATTERYutilization = await getFleetSeriesData(
      startTime,
      endTime,
      API_requestdata
    )
    // WEEK WISE //

    if (timeSpan === "week")
      return res.status(200).json({
        msg: "data sent",
        batteryStat:fleetBATTERYutilization
      });

    // MONTH WISE //
    else if (timeSpan === "month")
      return res.status(200).json({
        msg: "data sent",
        batteryStat:fleetBATTERYutilization
      });

    // PER DAY //
    else if (timeSpan === "today")
      return res.status(200).json({
        msg: "data sent",
        batteryStat:fleetBATTERYutilization
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
  console.log("MEMORY request has excuted")
  const mapId = req.params.mapId;
  API_data = req.body;
  // console.log(API_data)
  timeSpan = API_data['timeSpan']
  startTime = API_data['timeStamp1']
  endTime  = API_data['timeStamp2']
  type     = API_data['metrics']
  // console.log(timeSpan, startTime, endTime)
  try {
    // MAP ID //
    const isMapExist = await Map.exists({ _id: mapId });
    if (!isMapExist)
      return res.status(500).json({ msg: "map not found!", map: null });
    const mapData = await Map.findOne({ _id: mapId });
    
    if (type === 'Overall'){
      var API_requestdata = "get_cummulativerobotMemory"
      var  List_name = "cummlativeMemory"
      
    } else {
      var API_requestdata = "get_robotMemory"
      var List_name  = "robot_Memory"
    }

    let fleetMEMORYutilization = await getFleetSeriesData(
      startTime,
      endTime,
      API_requestdata
    )

    if (timeSpan === "week")
      return res.status(200).json({
        msg: "data sent",
        memoryStat:fleetMEMORYutilization
      });

    // MONTH WISE //
    else if (timeSpan === "month")
      return res.status(200).json({
        msg: "data sent",
        memoryStat:fleetMEMORYutilization
      });

    // PER DAY //
    else if (timeSpan === "today")
      return res.status(200).json({
        msg: "data sent",
        memoryStat:fleetMEMORYutilization
      });

  } catch (err) {
    console.log("error occured : ", err);
    if (err.name === "CZastError")
      return res.status(400).json({ msg: "not valid map Id" });
    res.status(500).json({ opt: "failed", error: err });
  }
};

// Netwrok
const getNetworkStat = async (req, res) => {
  console.log("NETWORK request has excuted")
  const mapId = req.params.mapId;
  API_data = req.body;
  // console.log(API_data)
  timeSpan = API_data['timeSpan']
  startTime = API_data['timeStamp1']
  endTime  = API_data['timeStamp2']
  type     = API_data['metrics']
  // console.log(timeSpan, startTime, endTime)
  try {
    // MAP ID //
    const isMapExist = await Map.exists({ _id: mapId });
    if (!isMapExist)
      return res.status(500).json({ msg: "map not found!", map: null });
    const mapData = await Map.findOne({ _id: mapId });

    if (type === 'Overall'){
      var API_requestdata = "get_cummulativeNetwork"
      var  List_name = "cummulativeNetwork"
    } else {
      var API_requestdata = "get_robotNetwork"
      var List_name  = "robot_Network"
    }

    let fleetNETWORKKutilization = await getFleetSeriesData(
      startTime,
      endTime,
      API_requestdata
    )

    // WEEK WISE //
    if (timeSpan === "week")
      return res.status(200).json({
        msg: "data sent",
        networkUtil:fleetNETWORKKutilization
      });
    // MONTH WISE //
    else if (timeSpan === "month")
      return res.status(200).json({
        msg: "data sent",
        networkUtil:fleetNETWORKKutilization
      });
    // PER DAY //
    else if (timeSpan === "today")
      return res.status(200).json({
        msg: "data sent",
        networkUtil:fleetNETWORKKutilization
      });

  } catch (err) {
    console.log("error occured : ", err);
    if (err.name === "CZastError")
      return res.status(400).json({ msg: "not valid map Id" });
    res.status(500).json({ opt: "failed", error: err });
  }
};

// IDLE Time
const getIdleTime = async (req, res) => {
  console.log("IDLE TIME request has excuted")
  const mapId = req.params.mapId;
  API_data = req.body;
  // console.log(API_data)
  timeSpan = API_data['timeSpan']
  startTime = API_data['timeStamp1']
  endTime  = API_data['timeStamp2']
  type     = API_data['metrics']
  // console.log(timeSpan, startTime, endTime)
  try {
    // MAP ID //
    const isMapExist = await Map.exists({ _id: mapId });
    if (!isMapExist)
      return res.status(500).json({ msg: "map not found!", map: null });
    const mapData = await Map.findOne({ _id: mapId });

    if (type === 'Overall'){
      var API_requestdata = "get_idletime"
      var  List_name = "cummulativeidle_Time"
    } else {
      var API_requestdata = "get_idletime"
      var List_name  = "cummulativeidle_Time"
    }
    
    let fleetIDLEUtilization = await getFleetSeriesData(
      startTime,
      endTime,
      API_requestdata
    )

    // WEEK WISE //
    if (timeSpan === "week")
      return res.status(200).json({
        msg: "data sent",
        idleTime:fleetIDLEUtilization
      });

    // MONTH WISE //
    else if (timeSpan === "month")
      return res.status(200).json({
        msg: "data sent",
        idleTime:fleetIDLEUtilization
      });

    // PER DAY //
    else if (timeSpan === "today")
      return res.status(200).json({
        msg: "data sent",
        idleTime:fleetIDLEUtilization
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
  console.log(" ERROR request has excuted")
  const mapId = req.params.mapId;
  API_data = req.body;
  console.log("robo error:",API_data)
  timeSpan = API_data['timeSpan']
  startTime = API_data['timeStamp1']
  endTime  = API_data['timeStamp2']
  type     = API_data['metrics']
  // console.log(timeSpan, startTime, endTime)
  try {
    // MAP ID //
    const isMapExist = await Map.exists({ _id: mapId });
    if (!isMapExist)
      return res.status(500).json({ msg: "map not found!", map: null });
    const mapData = await Map.findOne({ _id: mapId });

    if (type === 'Overall'){
      var API_requestdata = "get_cummulativerobotError"
      var  List_name = "cummulativerobotError"
    } else {
      var API_requestdata = "get_robotError"
      var List_name  = "robot_Error"
    }
    let fleetError = await getFleetSeriesData(
      startTime,
      endTime,
      API_requestdata
    )
    // WEEK WISE //
    if (timeSpan === "week")
      return res.status(200).json({
        msg: "data sent",
        roboErr:fleetError
      });

    // MONTH WISE //
    else if (timeSpan === "month")
      return res.status(200).json({
        msg: "data sent",
        roboErr:fleetError
      });

    // PER DAY //
    else if (timeSpan === "today")
      return res.status(200).json({
        msg: "data sent",
        roboErr:fleetError
      });

  } catch (err) {
    console.log("error occured : ", err);
    if (err.name === "CZastError")
      return res.status(400).json({ msg: "not valid map Id" });
    res.status(500).json({ opt: "failed", error: err });
  }
};

const varname = function (req, res)
{
  const API_request = req.body;
  console.log(API_request["data"])
  return res.status(500).json({ });
}

module.exports = {
  throughput,
  getFleetStarvation,
  starvationRate,
  getFleetPickAccuracy,
  pickAccuracy,
  getFleetErrRate,
  errRate,
  getRoboFleetGraph,
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
  varname,
};
