const { Schema, model, mongoose } = require("mongoose");
const { projectConnection } = require("../../common/db_config");

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

const mapModel = projectConnection.model("map", mapSchema, "map");

const projMapSchema = new Schema(
  {
    mapId: {
      type: Schema.Types.ObjectId,
      ref: "mapModel",
      required: true,
    },
    mapName: {
      type: String,
      required: [true, "Map name is required!"],
      trim: true,
    },
  },
  { timestamps: true, _id: false, versionKey: false }
);

const siteSchema = new Schema(
  {
    siteName: {
      type: String,
      required: [true, "site name reqiured"],
      trime: true,
    },
    maps: [{ type: projMapSchema, default: [] }],
  },
  { timestamps: true, versionKey: false }
);

const roboProjSchema = new Schema(
  {
    roboId: {
      type: Schema.Types.ObjectId,
      ref: "Robots",
      required: true,
    },
    name: {
      type: String,
      required: [true, "name of the robo required!"],
      trim: true,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = { siteSchema, roboProjSchema, projMapSchema, mapModel };
