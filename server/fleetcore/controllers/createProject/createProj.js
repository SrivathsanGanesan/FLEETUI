const { projectModel } = require("../../models/projectSchema");

const createProject = async (req, res, next) => {
  const { projectName } = req.body.project;
  try {
    const doc = await projectModel.exists({ projectName: projectName });
    if (doc)
      return res.status(400).json({ exits: true, msg: "Name already exits" });
    const project = await new projectModel({ projectName }).save();
    return res
      .status(200)
      .json({ project: project, exits: false, msg: "project created!" });
    res.send("good!");
  } catch (err) {
    console.log("err occ : ", err);
    res.status(500).json({ error: err, msg: "request not attained!" });
  }
};

module.exports = { createProject };
