const { log } = require("console");
const decompress = require("decompress");
const fs = require("fs");
const path = require("path");

const parseProjectFile = async (req, res, next) => {
  try {
    const absPath = path.resolve("./proj_assets/projectFile"); // returns absolute path of the given file or folder! (helps to find a file)
    const destDirName = path.basename(
      // ( dist.txt - .txt ) => dist
      req.file.originalname,
      path.extname(req.file.originalname) // returns extension type
    );
    res.status(200).json({ operation: "pending", msg: ".zip extracting" });

    // respond has been sent.. background process
    decompress(absPath + `/${req.file.originalname}`, absPath);
    if (fs.existsSync(absPath + `/${req.file.originalname}`))
      fs.unlinkSync(absPath + `/${req.file.originalname}`);
  } catch (err) {
    console.log("error occ : ", err);
    res.status(500).json({ error: err, msg: "operation failed" });
  }
};

module.exports = { parseProjectFile };
