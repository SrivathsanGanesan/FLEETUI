const { Robo } = require("../models/mapSchema");
const { projectModel } = require("../../fleetcore/models/projectSchema");

const insertRoboId = async ({ roboId, roboName, projectName }) => {
  const proj = await projectModel.findOneAndUpdate(
    { projectName: projectName }, // wanna add robo name.. to the ref
    {
      $push: { robots: { roboId, name: roboName } },
    }
  );
  return proj;
};
//..

const createRobo = async (req, res, next) => {
  const { projectName, roboName, ipAdd, macAdd, batteryStatus, roboTask } =
    JSON.parse(req.body.roboData);
  try {
    const doc = await Robo.exists({ roboName: roboName });
    const doc2 = await projectModel.exists({ projectName: projectName });
    if (!doc2)
      return res.status(400).json({
        exists: false,
        msg: "invadlid project name or name not doesn't exists!",
      });
    if (doc)
      return res
        .status(400)
        .json({ exists: true, msg: "robo name already exists!" });
    const robo = await new Robo({
      roboName,
      ipAdd,
      macAdd,
      imgUrl: `localhost:3000/roboSpecification/${req.file.filename}`,
      batteryStatus,
      roboTask,
    }).save();
    const roboId = robo._id;
    const resultDoc = await insertRoboId({ roboId, roboName, projectName });
    if (!resultDoc)
      return res
        .status(400)
        .json({ succeded: false, msg: "project name not exists!" });
    return res.status(201).json({ exits: false, msg: "data inserted!" });
  } catch (err) {
    console.log("err occs : ", err);
    res.status(500).json({ msg: "error occured while inserting!" });
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

const eventStreamHeader = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache",
  Connection: "keep-alive",
};

// -------- [WIP] --------------
const throughput = async (req, res, next) => {
  const mapId = req.params.mapId;
  try {
    //..
    res.writeHead(200, eventStreamHeader);
    const fuse = setInterval(async () => {
      const coor = JSON.stringify({
        data_x: Math.floor(Math.random() * 20),
        data_y: Math.floor(Math.random() * 150),
      });
      res.write(`data: ${coor}\n\n`);
    }, 1000 * 1.5);

    res.on("close", () => {
      clearInterval(fuse);
      res.end();
    });
  } catch (err) {
    console.log("eventStream error occured : ", err);
    res.status(500).json({ opt: "failed", error: err });
  }
};

// -------- [WIP] --------------
const uptime = async (req, res, next) => {
  const mapId = req.params.mapId;
  try {
    //..
    const mockData = {
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
      });
    return res.status(500).json({ opt: "failed", error: err });
  } catch (err) {
    console.log("uptime Err : ", err);
    res.status(500).json({ opt: "failed", error: err });
  }
};

module.exports = {
  getGrossCount,
  throughput,
  uptime,
  createRobo,
  updateRobo,
};
