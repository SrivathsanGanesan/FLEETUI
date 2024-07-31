const decompress = require("decompress");
const fs = require("fs");
const path = require("path");
const { copyImages } = require("./fileExportController");

const validateExtractedFile = async ({ target }) => {
  let fileArr = ["/mapInfo.json", "/projInfo.json", "/roboInfo.json"];
  const files = fs.readdirSync(target);
  if (files.length < 3) return false;
  fileArr.forEach((file) => {
    if (!fs.existsSync(target + file)) return false;
  });
  return true;
};
//..

const extractProjFile = async (req, res, next) => {
  try {
    const absPath = path.resolve("./proj_assets/projectFile"); // returns absolute path of the given file or folder! (helps to find a file)
    const destDirName = path.basename(
      // ( dist.txt - .txt ) => dist
      req.file.originalname,
      path.extname(req.file.originalname) // returns extension type
    );
    // respond has been sent.. background process (incase of emergency use timeOut)
    await decompress(absPath + `/${req.file.originalname}`, absPath); // absPath + `/${destDirName}` [ alter ]
    if (fs.existsSync(absPath + `/${req.file.originalname}`))
      fs.unlinkSync(absPath + `/${req.file.originalname}`);
    next();
  } catch (err) {
    console.log("error occ : ", err);
    res.status(500).json({ error: err, msg: "operation failed" });
  }
};

//.. WIP
const parseProjectFile = async (req, res, next) => {
  const target = path.resolve("./proj_assets/projectFile/");
  const isDirValidate = validateExtractedFile({ target });
  if (!isDirValidate)
    return res.status(400).json({ isZipValidate: false, msg: "Files missing" });
  try {
    const data = JSON.parse(fs.readFileSync(target + "/projInfo.json"));
    if (data.img.length)
      copyImages({
        imgUrlArr: data.img,
        src: "projectFile",
        dest: "dashboardMap",
      });
    // restroreMaps();
    return res.json("good");
  } catch (err) {
    console.log("error occ : ", err);
    res.status(500).json({ error: err, msg: "operation failed" });
  }
};

module.exports = { extractProjFile, parseProjectFile };
