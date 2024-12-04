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

const getCpuUtilization = async (req, res) => {
  console.log("CPU request has excuted")
  const mapId = req.params.mapId;
  API_data = req.body;
  // console.log(API_data)
  timeSpan = API_data['timeSpan']
  startTime = API_data['startTime']
  endTime  = API_data['endTime']
  type     = API_data['metrics']
  // console.log(timeSpan, startTime, endTime)
  try {
    // MAP ID //
    const isMapExist = await Map.exists({ _id: mapId });
    if (!isMapExist)
      return res.status(500).json({ msg: "map not found!", map: null });
    const mapData = await Map.findOne({ _id: mapId });

    if (type === 'Overall'){
      var API_requestdata = "get_cummulativeCPU_Utilization"
      var  List_name = "cummulativeCPU_Utilization"
      var fleetcpuutilization = {cummulativeCPU_Utilization : [{cummulativeCPU_Utilization: 0}, {cummulativeCPU_Utilization: 1}, {cummulativeCPU_Utilization: 10}, 
        {cummulativeCPU_Utilization: 50}, {cummulativeCPU_Utilization: 60}, {cummulativeCPU_Utilization: 40},
        {cummulativeCPU_Utilization: 90},{cummulativeCPU_Utilization: 80}]}

    } else {
      var API_requestdata = "get_CPU_Utilization"
      var List_name  = "CPU_Utilization"
      var fleetcpuutilization = {CPU_Utilization : [{CPU_Utilization: 0}, {CPU_Utilization: 1}, {CPU_Utilization: 1}, 
        {CPU_Utilization: 5}, {CPU_Utilization: 6}, {CPU_Utilization: 4},
        {CPU_Utilization: 9},{CPU_Utilization: 8}]}
    }
    
    // var fleetcpuutilization = await getFleetSeriesData(
    //   startTime,
    //   endTime,
    //   API_requestdata
    // )

    // WEEK WISE //
    if (timeSpan === "week")
      return res.status(200).json({
        msg: "data sent",
        cpuUtil:fleetcpuutilization[List_name]
      });
    // MONTH WISE //
    else if (timeSpan === "month")
      return res.status(200).json({
        msg: "data sent",
        cpuUtil:fleetcpuutilization[List_name]
      });
    // PER DAY //
    else if (timeSpan === "today")
      console.log("body has excuted")
      return res.status(200).json({
        msg: "data sent",
        cpuUtil:fleetcpuutilization[List_name]
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
  startTime = API_data['startTime']
  endTime  = API_data['endTime']
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
      var fleetROBOutilization = {cummulativerobotUtilization : [{cummulativerobotUtilization: 0}, {cummulativerobotUtilization: 1}, {cummulativerobotUtilization: 10}, 
        {cummulativerobotUtilization: 50}, {cummulativerobotUtilization: 60}, {cummulativerobotUtilization: 40},
        {cummulativerobotUtilization: 90},{cummulativerobotUtilization: 80}]}

    } else {
      var API_requestdata = "get_robotUtilization"
      var List_name  = "Robot_Utilization"
      var fleetROBOutilization = {Robot_Utilization : [{Robot_Utilization: 0}, {Robot_Utilization: 1}, {Robot_Utilization: 1}, 
        {Robot_Utilization: 5}, {Robot_Utilization: 6}, {Robot_Utilization: 4},
        {Robot_Utilization: 9},{Robot_Utilization: 8}]}
    }
    
    // Fleet Server Communication ///
    // let fleetROBOutilization = await getFleetSeriesData_robo(
    //   startTime,
    //   endTime,
    //   API_requestdata
    // )    
  
    // WEEK WISE //
    if (timeSpan === "week")
      return res.status(200).json({
        msg: "data sent",
        roboUtil:fleetROBOutilization[List_name]
      });
    // MONTH WISE //
    else if (timeSpan === "month")
      return res.status(200).json({
        msg: "data sent",
        roboUtil:fleetROBOutilization[List_name]
      });
    // PER DAY //
    else if (timeSpan === "today")
      return res.status(200).json({
        msg: "data sent",
        roboUtil:fleetROBOutilization[List_name]
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
  startTime = API_data['startTime']
  endTime  = API_data['endTime']
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
      var fleetBATTERYutilization = {cummulativebatteryPercentage : [{cummulativebatteryPercentage: 0}, {cummulativebatteryPercentage: 1}, {cummulativebatteryPercentage: 10}, 
        {cummulativebatteryPercentage: 50}, {cummulativebatteryPercentage: 60}, {cummulativebatteryPercentage: 40},
        {cummulativebatteryPercentage: 90},{cummulativebatteryPercentage: 80}]}
      
    } else {
      var API_requestdata = "get_robotBattery"
      var List_name  = "batteryPercentage"
      var fleetBATTERYutilization = {batteryPercentage : [{batteryPercentage: 0}, {batteryPercentage: 1}, {batteryPercentage: 1}, 
        {batteryPercentage: 5}, {batteryPercentage: 6}, {batteryPercentage: 4},
        {batteryPercentage: 9},{batteryPercentage: 8}]}
    }
    // let fleetBATTERYutilization = await getFleetSeriesData_robo(
    //   startTime,
    //   endTime,
    //   API_requestdata
    // )
    // WEEK WISE //
    // const fleetBATTERYutilization = {BATTERY_Utilization : [{CPU_Utilization: 0}, {CPU_Utilization: 1}, {CPU_Utilization: 10}, 
    //   {CPU_Utilization: 50}, {CPU_Utilization: 60}, {CPU_Utilization: 40},
    //   {CPU_Utilization: 90},{CPU_Utilization: 80}]}

    if (timeSpan === "week")
      return res.status(200).json({
        msg: "data sent",
        batteryStat:fleetBATTERYutilization[List_name]
      });

    // MONTH WISE //
    else if (timeSpan === "month")
      return res.status(200).json({
        msg: "data sent",
        batteryStat:fleetBATTERYutilization[List_name]
      });

    // PER DAY //
    else if (timeSpan === "today")
      return res.status(200).json({
        msg: "data sent",
        batteryStat:fleetBATTERYutilization[List_name]
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
  startTime = API_data['startTime']
  endTime  = API_data['endTime']
  type     = API_data['metrics']
  // console.log(timeSpan, startTime, endTime)
  try {
    // MAP ID //
    const isMapExist = await Map.exists({ _id: mapId });
    if (!isMapExist)
      return res.status(500).json({ msg: "map not found!", map: null });
    const mapData = await Map.findOne({ _id: mapId });
    
    if (type === 'Overall'){
      var API_requestdata = "get_robotBattery"
      var  List_name = "cummlativeMemory"
      var fleetMEMORYutilization = {cummlativeMemory : [{cummlativeMemory: 1}, {cummlativeMemory: 1}, {cummlativeMemory: 10}, 
        {cummlativeMemory: 50}, {cummlativeMemory: 60}, {cummlativeMemory: 40},
        {cummlativeMemory: 90},{cummlativeMemory: 80}]}
      
    } else {
      var API_requestdata = "get_robotBattery"
      var List_name  = "robot_Memory"
      var fleetMEMORYutilization = {robot_Memory : [{robot_Memory: 0}, {robot_Memory: 1}, {robot_Memory: 10}, 
        {robot_Memory: 50}, {robot_Memory: 60}, {robot_Memory: 40},
        {robot_Memory: 90},{robot_Memory: 80}]}
    }

    // let fleetMEMORYutilization = await getFleetSeriesData_robo(
    //   startTime,
    //   endTime,
    //   API_requestdata
    // )

    if (timeSpan === "week")
      return res.status(200).json({
        msg: "data sent",
        memoryStat:fleetMEMORYutilization[List_name]
      });

    // MONTH WISE //
    else if (timeSpan === "month")
      return res.status(200).json({
        msg: "data sent",
        memoryStat:fleetMEMORYutilization[List_name]
      });

    // PER DAY //
    else if (timeSpan === "today")
      return res.status(200).json({
        msg: "data sent",
        memoryStat:fleetMEMORYutilization[List_name]
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
  startTime = API_data['startTime']
  endTime  = API_data['endTime']
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
      var fleetNETWORKKutilization = {cummulativeNetwork : [{cummulativeNetwork: 100}, {cummulativeNetwork: 1}, {cummulativeNetwork: 10}, 
        {cummulativeNetwork: 50}, {cummulativeNetwork: 60}, {cummulativeNetwork: 40},
        {cummulativeNetwork: 90},{cummulativeNetwork: 80}]}
    } else {
      var API_requestdata = "get_robotNetwork"
      var List_name  = "robot_Network"
      var fleetNETWORKKutilization = {robot_Network : [{robot_Network: 0}, {robot_Network: 1}, {robot_Network: 10}, 
        {robot_Network: 50}, {robot_Network: 60}, {robot_Network: 40},
        {robot_Network: 90},{robot_Network: 80}]}
    }
    // WEEK WISE //
    if (timeSpan === "week")
      return res.status(200).json({
        msg: "data sent",
        networkUtil:fleetNETWORKKutilization[List_name]
      });
    // MONTH WISE //
    else if (timeSpan === "month")
      return res.status(200).json({
        msg: "data sent",
        networkUtil:fleetNETWORKKutilization[List_name]
      });
    // PER DAY //
    else if (timeSpan === "today")
      return res.status(200).json({
        msg: "data sent",
        networkUtil:fleetNETWORKKutilization[List_name]
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
  startTime = API_data['startTime']
  endTime  = API_data['endTime']
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
      var fleetIDLEUtilization = {cummulativeidle_Time : [{cummulativeidle_Time: 120}, {cummulativeidle_Time: 1}, {cummulativeidle_Time: 10}, 
        {cummulativeidle_Time: 50}, {cummulativeidle_Time: 60}, {cummulativeidle_Time: 40},
        {cummulativeidle_Time: 90},{cummulativeidle_Time: 80}]}
    } else {
      var API_requestdata = "get_idletime"
      var List_name  = "cummulativeidle_Time"
      var fleetIDLEUtilization = {cummulativeidle_Time : [{cummulativeidle_Time: 300}, {cummulativeidle_Time: 1}, {cummulativeidle_Time: 10}, 
        {cummulativeidle_Time: 50}, {cummulativeidle_Time: 60}, {cummulativeidle_Time: 40},
        {cummulativeidle_Time: 90},{cummulativeidle_Time: 80}]}
    }
    
    // let fleetBATTERYutilization = await getFleetSeriesData_robo(
    //   startTime,
    //   endTime,
    //   API_requestdata
    // )
    // WEEK WISE //
    if (timeSpan === "week")
      return res.status(200).json({
        msg: "data sent",
        idleTime:fleetIDLEUtilization[List_name]
      });

    // MONTH WISE //
    else if (timeSpan === "month")
      return res.status(200).json({
        msg: "data sent",
        idleTime:fleetIDLEUtilization[List_name]
      });

    // PER DAY //
    else if (timeSpan === "today")
      return res.status(200).json({
        msg: "data sent",
        idleTime:fleetIDLEUtilization[List_name]
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
  startTime = API_data['startTime']
  endTime  = API_data['endTime']
  type     = API_data['metrics']
  // console.log(timeSpan, startTime, endTime)
  try {
    // MAP ID //
    const isMapExist = await Map.exists({ _id: mapId });
    if (!isMapExist)
      return res.status(500).json({ msg: "map not found!", map: null });
    const mapData = await Map.findOne({ _id: mapId });

    if (type === 'Overall'){
      var API_requestdata = "get_robotError"
      var  List_name = "cummulativerobotError"
      var fleetROBOUtilization = {cummulativerobotError : [{cummulativerobotError: 100}, {cummulativerobotError: 1}, {cummulativerobotError: 10}, 
        {cummulativerobotError: 50}, {cummulativerobotError: 60}, {cummulativerobotError: 40},
        {cummulativerobotError: 90},{cummulativerobotError: 80}]}
    } else {
      var API_requestdata = "get_robotError"
      var List_name  = "robot_Error"
      var fleetROBOUtilization = {robot_Error : [{robot_Error: 0}, {robot_Error: 1}, {robot_Error: 10}, 
        {robot_Error: 50}, {robot_Error: 60}, {robot_Error: 40},
        {robot_Error: 90},{robot_Error: 80}]}
    }
    // let fleetBATTERYutilization = await getFleetSeriesData_robo(
    //   startTime,
    //   endTime,
    //   API_requestdata
    // )
    // WEEK WISE //
    if (timeSpan === "week")
      return res.status(200).json({
        msg: "data sent",
        roboErr:fleetROBOUtilization[List_name]
      });

    // MONTH WISE //
    else if (timeSpan === "month")
      return res.status(200).json({
        msg: "data sent",
        roboErr:fleetROBOUtilization[List_name]
      });

    // PER DAY //
    else if (timeSpan === "today")
      return res.status(200).json({
        msg: "data sent",
        roboErr:fleetROBOUtilization[List_name]
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
