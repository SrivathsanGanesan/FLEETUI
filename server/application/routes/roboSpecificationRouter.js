const express = require("express");
const multer = require("multer");
const roboSpecificationRouter = express.Router();
const { createRobo, updateRobo } = require("../controllers/robotController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "proj_assets/roboSpecification");
  },
  filename: (req, file, cb) => {
    // cb(null, Date.now() + "-" + file.originalname);
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

roboSpecificationRouter.post("/", upload.single("roboImg"), createRobo);
roboSpecificationRouter.put("/:queRoboName", updateRobo);

module.exports = roboSpecificationRouter;
