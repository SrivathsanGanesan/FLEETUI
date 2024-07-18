const { Schema, model, mongoose } = require("mongoose");
const { roboSchema, zoneSchema } = require("./roboSchema");
const { dashboardConnection } = require("../../common/db_config");

const mapSchema = new Schema(
  {
    mapName: {
      type: String,
      required: [true, "map_Name is required!"],
      trim: true,
      unique: true,
    },
    imgUrl: { type: String, default: "" },
    zones: {
      type: [zoneSchema],
      default: [],
    },
    robots: {
      type: [roboSchema],
      default: [],
    },
  },
  { timestamps: true, versionKey: false }
);

const Map = dashboardConnection.model("mapData", mapSchema, "mapData");
const Robo = dashboardConnection.model(
  "roboSpecifications",
  roboSchema,
  "roboSpecifications"
);

module.exports = { Map, Robo };
