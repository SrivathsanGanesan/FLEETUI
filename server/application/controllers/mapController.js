const { Map, Robo } = require("../models/mapSchema");
const {
  projectModel,
  siteModel,
} = require("../../fleetcore/models/projectSchema");
const fs = require("fs");
const path = require("path");

const deleteImage = (imgName) => {
  const dest = path.resolve(`proj_assets/dashboardMap/${imgName}`);
  if (!fs.existsSync(dest)) return false;
  if (fs.existsSync(dest)) fs.unlinkSync(dest);
  return true;
};

const clearImgAsset = (req) => {
  if (fs.existsSync(`proj_assets/dashboardMap/${req.file?.filename}`))
    fs.unlinkSync(`proj_assets/dashboardMap/${req.file?.filename}`);
};

const insertMapId = async ({ MapId, mapName, projectName, siteName }) => {
  const proj = await projectModel.findOneAndUpdate(
    {
      projectName: projectName,
      "sites.siteName": siteName,
    },
    {
      $push: {
        "sites.$.maps": {
          // '$' positional operator, from array it matches the query condition..
          mapId: MapId,
          mapName: mapName,
        },
      },
    },
    { new: true }
  );
  return proj;
};

const sendNodeGraph = async ({ endpoint, bodyData }) => {
  let response = await fetch(`http://192.168.225.97:8080/fms/amr/${endpoint}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic cm9vdDp0b29y",
    },
    body: JSON.stringify(bodyData),
  });
  if (!response.ok) {
    console.log("failed while sending node graph");
    return null;
  }
  let data = await response.json();
  return data;
};
//..

const mapInsert = async (req, res) => {
  const mapData = JSON.parse(req.body.mapData);

  /* const { nodes, edges } = mapData; // send node graph..
  let nodeGraph = {
    nodes: nodes,
    edges: edges,
  };
  let data1 = await sendNodeGraph({
    endpoint: "save_graph",
    bodyData: nodeGraph,
  }); */

  // return res.end(); // yet to remove..
  try {
    const {
      projectName,
      siteName,
      mapName,
      // robots = [],
      mpp,
      nodes,
      edges,
      stations,
      zones,
      roboPos,
    } = mapData;
    const map = await Map.exists({ mapName: mapName });
    if (map) return res.json({ exits: true, msg: "Map name already exits" });
    const projDoc = await projectModel.exists({
      projectName: projectName,
      // "sites.siteName": siteName,
    });

    if (!projDoc) {
      clearImgAsset(req);
      return res.status(400).json({
        succeded: false,
        msg: "project name not exists!",
      });
    }
    const siteDoc = await projectModel.exists({
      projectName: projectName,
      "sites.siteName": siteName,
    });
    let updatedSite = null;
    if (!siteDoc)
      updatedSite = await projectModel.findOneAndUpdate(
        {
          projectName: projectName,
        },
        {
          $push: {
            sites: new siteModel({ siteName: siteName }),
          },
        },
        { new: true }
      );

    if (req.file === undefined)
      return res.status(400).json({ msg: "file missing", isFileExist: false });
    mapData.imgUrl = `localhost:3000/dashboard/${req.file.filename}`;

    const newMap = await new Map({
      mapName,
      imgUrl: mapData.imgUrl,
      mpp,
      zones,
      nodes,
      edges,
      stations,
    }).save();
    const MapId = newMap._id;
    const proj = await insertMapId({ MapId, mapName, projectName, siteName });
    if (!proj) {
      clearImgAsset(req);
      return res.status(400).json({
        succeded: false,
        msg: "operation failed while inserting ref Id of Map!",
        map: null,
        site: updatedSite,
      });
    }
    res.status(201).json({ exits: false, msg: "data inserted!", map: newMap });
  } catch (err) {
    clearImgAsset(req);
    console.log("err occs : ", err);
    if (err.code === 11000)
      return res.status(400).json({
        msg: "duplicate key error, might conflicts in field values",
        map: null,
      });
    res.status(500).json({ msg: "error occured while inserting!", map: null });
  }
};

const mapGet = async (req, res) => {
  const isExists = await Map.exists({ mapName: req.params.mapName });
  try {
    if (!isExists) return res.status(404).json({ msg: "Map not found!" });
    let map = await Map.findOne({ mapName: req.params.mapName });
    return res.status(200).json({ map: map, isExists: true, msg: "Map sent!" });
  } catch (err) {
    console.log("err occ : ", err);
    res.status(500).json({ error: err, msg: "request not attained!" });
  }
};

const mapUpdate = async (req, res) => {
  const queMapName = req.params.mapName;
  const mapData = req.body;
  try {
    const map = await Map.exists({ mapName: queMapName });
    if (!map)
      return res
        .status(400)
        .json({ exists: false, msg: "Map seems not exists" });
    let isMapNameExists = await Map.exists({ mapName: mapData.mapName });
    if (isMapNameExists)
      return res
        .status(400)
        .json({ mapExists: true, msg: "Map with this name already exists" });
    for (let key of Object.keys(mapData)) {
      if (mapData[key] === null) delete mapData[key];
    }

    const doc = await Map.findOneAndUpdate({ mapName: queMapName }, mapData, {
      new: true,
    });
    return res.status(200).json({ updatedData: doc, msg: "data updated" });
  } catch (error) {
    console.log("err occs : ", err);
    if (err.code === 11000)
      return res.status(400).json({
        msg: "duplicate key error, might conflicts in field values",
        map: null,
      });
    res.status(500).json({ msg: "error occured while inserting!", map: null });
  }
};

const newRoboInMap = async (req, res, next) => {
  const { new_robo } = req.body;
  try {
    const mapName = req.params.mapName;
    const doc = await Map.findOne({ mapName });
    if (!doc)
      return res.status(400).json({ exits: false, msg: "map name not exits" });
    const isExists = doc.robots.some((robo) => robo.name === new_robo.name);
    if (isExists)
      return res.status(400).json({
        inserted: false,
        msg: "Robo (roboId) already exists!",
        updatedMap: doc,
      });

    doc.robots.push(new_robo); //doc.robots = [...doc.robots, new_robo];
    const updatedMap = await doc.save();
    return res.status(201).json({
      inserted: true,
      msg: "new robo data inserted!",
      updatedMap: updatedMap,
    });
  } catch (err) {
    console.log("err occs : ", err);
    if (err.code === 11000)
      return res.status(400).json({
        msg: "Duplicate key error: Robo (roboId) already exists!",
        error: err,
      });
    return res
      .status(500)
      .json({ msg: "error occured, while inserting new robo!", error: err });
  }
};

const deleteRoboInMap = async (req, res, next) => {
  try {
    const doc = await Map.findOne({ mapName: req.params.mapName });
    if (!doc)
      return res
        .status(400)
        .json({ opt: "failed", msg: "mapId/mapname not exist!" });
    const ind = doc.robots.findIndex(
      (robo) => robo.roboName === req.params.roboName
    );
    if (ind === -1)
      return res.status(400).json({ opt: "failed", msg: "robo not exist!" });
    doc.robots.splice(ind, 1);
    doc.save();
    res.status(200).json({ opt: "succeed", msg: "Robo deleted from map" });
  } catch (err) {
    console.log("err occ : ", err);
    res.status(500).json({
      opt: "failed",
      msg: "error occured while deleting robo!",
      error: err,
    });
  }
};

const deleteMap = async (req, res) => {
  const { projectName, siteName } = req.body;
  const mapName = req.params.mapName;
  try {
    let isMapExists = await Map.exists({ mapName: mapName });
    if (!isMapExists)
      return res
        .status(400)
        .json({ isMapExists: false, msg: "Map not exists!" });
    const updatedProj = await projectModel.findOneAndUpdate(
      {
        projectName: projectName,
        "sites.siteName": siteName,
      },
      {
        $pull: {
          "sites.$.maps": { mapName: mapName },
        },
      },
      { new: true } // which returns the updated doc!
    );
    let mapDet = await Map.findOne({ mapName: mapName });
    let robots = mapDet.robots;
    for (let robo of robots) await Robo.deleteOne({ _id: robo.roboId });
    let imgToDelete = mapDet.imgUrl.split("/")[2]; // [localhost:3000, dashboard, samp.png]
    let isImgDeleted = deleteImage(imgToDelete);
    if (!isImgDeleted)
      return res.status(500).json({
        isDeleted: false,
        imageExists: false,
        msg: "File not found to delete",
      });

    const map = await Map.deleteOne({ mapName: mapName });
    if (map.deletedCount === 0)
      return res.status(400).json({
        idDeleted: false,
        isMapExist: false,
        msg: "map not exist!",
      });
    return res
      .status(200)
      .json({ isDeleted: true, opt: "succeed!", updatedProj: updatedProj });
  } catch (err) {
    console.log("err occ : ", err);
    res.status(500).json({
      opt: "failed",
      msg: "error occured while deleting map!",
      error: err,
    });
  }
};

const delMapImg = async (req, res, next) => {
  try {
    const mapDoc = await Map.findOne({ mapId: req.params.mapId });
    if (!mapDoc)
      return res
        .status(400)
        .json({ opt: "failed", msg: "Map does not exist!" });
    const url = new URL(mapDoc.imgUrl);
    const imgPath = url.pathname.split("/")[2]; // bending through production!
    if (fs.existsSync(path.join("proj_assets/dashboardMap" + `/${imgPath}`))) {
      fs.unlinkSync(path.join("proj_assets/dashboardMap" + `/${imgPath}`));
      mapDoc.imgUrl = "";
      const updatedMap = await mapDoc.save();
    } else res.status(404).json({ opt: "Failed!", msg: "File not found!" });
    if (req.url.split("/")[2] === "replace_img") return next();
    else
      return res.status(200).json({
        img_deleted: true,
        msg: "Operation succeeded!",
        updatedMap: updatedMap,
      });
  } catch (err) {
    res.json({ opt: "failed!", error: err });
  }
};

const newMapImg = async (req, res, next) => {
  try {
    const map = await Map.findOne({ mapId: req.params.mapId });
    if (!map)
      return res
        .status(400)
        .json({ exists: false, msg: "mapId doesn't exists!" });
    map.imgUrl = `localhost:3000/dashboard/${req.file.originalname}`;
    await map.save();
    return res
      .status(200)
      .json({ inserted: true, Map_exists: true, opt: "succeed!" });
  } catch (err) {
    return res.status(404).json({ opt: "failed", error: err });
  }
};

module.exports = {
  mapInsert,
  mapGet,
  mapUpdate,
  newRoboInMap,
  deleteRoboInMap,
  deleteMap,
  delMapImg,
  newMapImg,
};
