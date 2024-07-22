const { projectModel } = require("../../models/projectSchema");

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
        projects: null,
        msg: "User not permitted to access projects_list",
      });
    else if (req.role === "Maintainer") {
      // const doc = await projectModel.find({}).select("projectName");
      // return res.status(200).json({ projects: doc, msg: "list sent!" });
    }
    const doc = await projectModel.find({}).select("projectName");
    console.log(doc);
    res.status(200).json({ projects: doc, msg: "list sent!" });
  } catch (error) {
    console.log("err occ : ", error);
    return res.status(500).json({ error: error, msg: "request not attained!" });
  }
};

module.exports = { getProject, getProjectList };
