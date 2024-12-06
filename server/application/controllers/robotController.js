const { Map, Robo } = require("../models/mapSchema");
const { projectModel } = require("../../fleetcore/models/projectSchema");

const eventStreamHeader = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
};


const getFleetSeriesData = async (timeStamp1, timeStamp2, endpoint) => {
  // console.log('cup data')
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

const insertRoboIdInProj = async ({ roboId, roboName, projectName }) => {
  const proj = await projectModel.findOneAndUpdate(
    { projectName: projectName }, // wanna add robo name.. to the ref
    {
      $push: { robots: { roboId, name: roboName } },
    },
    { new: true }
  );
  return proj;
};

const insertRoboIdInMap = async ({ roboId, roboName, mapId, mapName }) => {
  const map = await Map.findOneAndUpdate(
    { _id: mapId },
    {
      $push: { robots: { roboId: roboId, name: roboName } },
    },
    { new: true }
  );

  return map;
};
//..

const createRobo = async (req, res, next) => {
  const {
    projectName,
    mapId,
    mapName,
    roboName,
    amrId,
    uuid,
    ipAdd,
    macAdd,
    grossInfo,
  } = req.body;
  try {
    const doc = await Robo.exists({ roboName: roboName });
    const doc1 = await Map.exists({ _id: mapId });
    const doc2 = await projectModel.exists({ projectName: projectName });
    if (!doc1 || !doc2)
      return res.status(400).json({
        exists: false,
        msg: "invadlid project name or map, which doesn't exists!",
      });
    if (doc)
      return res
        .status(400)
        .json({ exists: true, msg: "robo name already exists!" });
    let isMacIpExists = await Robo.exists({ macAdd: macAdd, ipAdd: ipAdd });
    if (isMacIpExists)
      return res
        .status(400)
        .json({ isIpMacExists: true, msg: "Ip | Mac seems already exists" });
    const robo = await new Robo({
      roboName,
      amrId,
      uuid,
      ipAdd,
      macAdd,
      grossInfo,
    }).save();
    const roboId = robo._id;
    const resultDoc = await insertRoboIdInProj({
      roboId,
      roboName,
      projectName,
    });
    const isIdInserted = await insertRoboIdInMap({
      roboId,
      roboName,
      mapId,
      mapName,
    });
    if (!resultDoc || !isIdInserted)
      await Robo.deleteOne({ roboName: roboName });
    if (!resultDoc)
      return res.status(422).json({
        succeded: false,
        msg: "Robo refernce Id does not inserted in Project",
      });
    // 422 - Unprocessable Entity (could not processed properly due to invalid data provided)
    if (!isIdInserted)
      return res.status(422).json({
        succeded: false,
        msg: "Robo refernce Id does not inserted in Map",
      });
    return res
      .status(201)
      .json({ exits: false, robo: robo, msg: "data inserted!" });
  } catch (err) {
    console.log("err occs : ", err);
    res.status(500).json({ error: err, msg: "error occured while inserting!" });
  }
};

const updateRobo = async (req, res, next) => {
  const queRoboName = req.params.queRoboName;
  const roboData = req.body;
  try {
    const robo = await Robo.exists({ roboName: queRoboName });
    if (!robo)
      return res
        .status(400)
        .json({ exists: false, msg: "Robo name seems not exists" });
    let isRoboNameExists = await Robo.exists({ roboName: roboData.roboName });
    if (isRoboNameExists)
      return res
        .status(400)
        .json({ roboExists: true, msg: "Robo with this name already exists" });                  
    Object.keys(roboData).forEach((key) => {
      if (roboData[key] === null) delete roboData[key];
    });
    let doc = await Robo.findOneAndUpdate({ roboName: queRoboName }, roboData, {
      new: true,
    });
    return res.status(200).json({ updatedData: doc, msg: "data updated" });
  } catch (error) {
    console.log("err occs : ", error);
    res
      .status(500)
      .json({ error: error, msg: "error occured while updating Robo!" });
  }
};

const getAllRobo = async (req, res) => {
  const mapId = req.params.mapId;
  try {
    const isMapExists = await Map.exists({ _id: mapId });
    if (!isMapExists)
      return res
        .status(422)
        .json({ map: null, isMapExist: false, msg: "map-id not exist" });
    let robots = await Map.findOne({ _id: mapId }, { robots: 1 }).populate({
      // {robots : 1} only robots field is selected from the document.. 1 ensures that field should be include, 0 exclude from the document and returns document except that field..
      path: "robots.roboId",
      model: Robo,
    });
    let populatedRobos = robots.robots.map((robo) => robo.roboId);
    res.status(200).json({ populatedRobos: populatedRobos, msg: "data sent!" });
  } catch (error) {
    console.log("err occs : ", error);
    if (error.name === "CastError")
      return res
        .status(400)
        .json({ error: error.message, msg: "not valid map Id" });
    return res
      .status(500)
      .json({ error: error, msg: "error occured while inserting!" });
  }
};

const deleteRobo = async (req, res) => {
  const { roboId, projectName, mapName } = req.body;
  try {
    const isRoboExists = await Robo.exists({ _id: roboId });
    if (!isRoboExists)
      return res
        .status(422)
        .json({ isRoboExists: false, msg: "Robo seems not exists" });
    const updatedProj = await projectModel.findOneAndUpdate(
      { projectName: projectName },
      { $pull: { robots: { roboId: roboId } } },
      { new: true }
    );
    const updatedMap = await Map.findOneAndUpdate(
      { mapName: mapName },
      { $pull: { robots: { roboId: roboId } } },
      { new: true }
    );

    if (!updatedMap || !updatedProj)
      return res.status(400).json({
        isRoboExists: false,
        msg: "Map | Project not found or update failed",
      });

    let deletedRobo = await Robo.deleteOne({ _id: roboId });
    if (deletedRobo.deletedCount === 0)
      return res.status(400).json({
        idDeleted: false,
        isRoboExists: false,
        msg: "robo not exist!",
      });
    return res.status(200).json({ isRoboExists: true, msg: "Robo deleted" });
  } catch (error) {
    console.log("err occs : ", error);
    if (error.name === "CastError")
      return res
        .status(400)
        .json({ error: error.message, msg: "not valid map Id" });
    return res
      .status(500)
      .json({ error: error, msg: "error occured while inserting!" });
  }
};

// -------- [ALTER : active number of robots] --------------
const getGrossCount = async (req, res, next) => {
  try {
    res
      .status(200)
      .json({ total: 30, active: 12, inActive: 18, avl: 0, unAvl: 0 });
  } catch (err) {
    res.status(500).json({ opt: "failed", error: err });
  }
};

// -------- [WIP] --------------
const uptime = async (req, res, next) => {
  const mapId = req.params.mapId;
  try {
    res.writeHead(200, eventStreamHeader);
    const fuse = setInterval(async () => {
      const uptimePer = JSON.stringify({
        percentage: Math.floor(Math.random() * 5) + 95,
      });
      res.write(`data: ${uptimePer}\n\n`);
    }, 1000 * 1.5);

    res.on("close", () => {
      clearInterval(fuse);
      res.end();
    });

    // return res.status(500).json({ opt: "failed", error: err });
  } catch (err) {
    console.log("uptime Err : ", err);
    res.status(500).json({ opt: "failed", error: err });
  }
};

// -------- [ALTER : active number of robots] --------------
const getpickdrop  = async (req, res) => {
  API_data = res.body;
  timeStamp1 = API_data['timeStamp1']
  timeStamp2 = API_data['timeStamp2']
  try {
    // get the pick & drop data from fleet server ///
    // let fleetpickdrop = await getFleetSeriesData(
    //   startTime,
    //   endTime,
    //   "get_pickdropCount"
    // )
      res.status(200)
      .json({pick : 15, drop : 10});
  } catch (err) {
    res.status(500).json({ opt: "failed", error: err });
  }
};


module.exports = {
  getGrossCount,
  uptime,
  createRobo,
  updateRobo,
  getAllRobo,
  deleteRobo,
  getpickdrop
};
