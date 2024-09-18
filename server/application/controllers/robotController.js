const { Map, Robo } = require("../models/mapSchema");
const { projectModel } = require("../../fleetcore/models/projectSchema");

const eventStreamHeader = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
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
  const { projectName, mapId, mapName, roboName, ipAdd, macAdd, grossInfo } =
    req.body;
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
    const robo = await new Robo({
      roboName,
      ipAdd,
      macAdd,
      // imgUrl: `localhost:3000/roboSpecification/${req.file.filename}`,
      // grossInfo
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
      return res.status(500).json({
        succeded: false,
        msg: "Robo refernce Id does not inserted in Project",
      });
    // 422 - Unprocessable Entity (could not processed properly due to invalid data provided)
    if (!isIdInserted)
      return res.status(422).json({
        succeded: false,
        msg: "Robo refernce Id does not inserted in Map",
      });
    return res.status(201).json({ exits: false, msg: "data inserted!" });
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

module.exports = {
  getGrossCount,
  uptime,
  createRobo,
  updateRobo,
};

/* const mockData = {
      service: "Fleet Management System",
      uptime: {
        status: "operational",
        percentage: 97,
      },
      timestamp: "2024-06-01T12:00:00Z",
      details: {
        last_checked: "2024-06-01T11:59:00Z",
        check_interval_minutes: 2,
      },
    };
    if (mockData)
      return res.status(200).json({
        uptime: mockData,
        percentage: Math.floor(Math.random() * 100),
        opt: "succeed!",
      }); */
