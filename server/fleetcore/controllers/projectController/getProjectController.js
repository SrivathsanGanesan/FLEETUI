const {
  authRegisterModel,
} = require("../../../common/models/authRegisterSchema");
const { projectModel } = require("../../models/projectSchema");

const { sessionStore } = require("../../../common/db_config");

const projectSession = sessionStore.client // cz, mongodbStore(sessionStore) internally use mongodbClient (not mongoose) which returns client connection..
  .db()
  .collection("projectSessions");
// let createProjSess = await projectSession.insertOne({ project: "123" });

const enterFleetRecords = (fleetRecords, isFleetOn, timeStamp) => {
  if (isFleetOn && !fleetRecords.length)
    fleetRecords.push({ startTime: timeStamp, endTime: null });
  else if (isFleetOn && fleetRecords[fleetRecords.length - 1].endTime !== null)
    fleetRecords.push({ startTime: timeStamp, endTime: null });
  else {
    const lastRecord = fleetRecords[fleetRecords.length - 1];
    if (lastRecord && lastRecord.endTime === null) {
      lastRecord.endTime = timeStamp;
    }
  }
  return fleetRecords;
};

// <<-----------------[ Middleware ]----------------->>

const getProject = async (req, res, next) => {
  const projectId = req.params.projectId;
  try {
    const project = await projectModel.findById(projectId);

    if (!project)
      return res
        .status(400)
        .json({ exists: false, msg: "project name not found!" });

    return res
      .status(200)
      .json({ exists: true, project: project, msg: "project returned!" });
  } catch (error) {
    console.log("err occ : ", error);
    return res.status(500).json({ error: error, msg: "request not attained!" });
  }
};

const getProjectList = async (req, res, next) => {
  try {
    if (req.role === "User")
      return res.json({
        user: "user",
        projects: null,
        msg: "User not permitted to access projects_list",
      });
    else if (req.role === "Maintainer") {
      const userDoc = await authRegisterModel
        .findOne({
          name: req.user,
          role: req.role,
        })
        .select({ projects: 1, _id: 0 });
      return res
        .status(200)
        .json({ projects: userDoc.projects, msg: "list sent!" });
    }
    const doc = await projectModel.find({}).select("projectName");
    res
      .status(200)
      .json({ user: "Admin-Maintainer", projects: doc, msg: "list sent!" });
  } catch (error) {
    console.log("err occ : ", error);
    return res.status(500).json({ error: error, msg: "request not attained!" });
  }
};

const setFleetRecords = async (req, res) => {
  const { projectId, isFleetOn, timeStamp } = req.body;
  try {
    const project = await projectModel.findById(projectId);

    if (!project)
      return res
        .status(400)
        .json({ exists: false, msg: "project name not found!" });

    let { fleetRecords } = project;
    let newFleetRec = enterFleetRecords(fleetRecords, isFleetOn, timeStamp);
    // console.log(isFleetOn, timeStamp, newFleetRec);

    const updatedFleetRecords = await projectModel.findOneAndUpdate(
      {
        _id: projectId,
      },
      { fleetRecords: newFleetRec }, // { $set: { fleetRecords: fleetRecords } } instead..
      { new: true }
    );

    return res.status(200).json({
      msg: "Record have been sent",
      fleetRecords: updatedFleetRecords.fleetRecords,
    });
  } catch (error) {
    console.log("err occ : ", error);
    return res.status(500).json({ error: error, msg: "request not attained!" });
  }
};

module.exports = { getProject, getProjectList, setFleetRecords };
