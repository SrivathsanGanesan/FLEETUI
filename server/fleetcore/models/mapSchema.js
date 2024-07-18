const { Schema, model, mongoose } = require("mongoose");
const { projectConnection } = require("../../common/db_config");

// dup uh..
const mapSchema = new Schema(
  {
    mapName: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      default: "www.google.com/image",
    },
    tasks: {
      type: [],
      default: ["task_1", "task_2"],
    },
  },
  { versionKey: false }
);

// dup uh..
const mapModel = projectConnection.model("map", mapSchema, "map");

module.exports = mapModel;
