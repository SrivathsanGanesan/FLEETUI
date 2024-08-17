const { Schema, model, mongoose, mongo } = require("mongoose");
const { roboSchema, zoneSchema } = require("./roboSchema");
const { dashboardConnection } = require("../../common/db_config");

const roboProjSchema = new Schema(
  {
    roboId: {
      type: Schema.Types.ObjectId,
      ref: "Robo",
      required: true,
    },
    name: {
      type: String,
      required: [true, "name of the robo required!"],
      trim: true,
    },
  },
  { timestamps: true, versionKey: false, _id: false }
);

const nodeSchema = new Schema(
  {
    single_node: { type: Boolean, default: true },
    multi_node: { type: Boolean, default: false },
    pos: { type: [{ type: { x: Number, y: Number } }], default: [] },
    others: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
    _id: false,
  }
);

const stationSchema = new Schema(
  {
    asset: { type: String, default: "" },
    pos: { type: [{ type: { x: Number, y: Number } }], default: [] },
    others: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
    _id: false,
  }
);

const mapSchema = new Schema(
  {
    mapName: {
      type: String,
      required: [true, "map_Name is required!"],
      trim: true,
      unique: true,
    },
    heightInMeter: { type: Number, default: 0 },
    widthInMeter: { type: Number, default: 0 },
    imgUrl: { type: String, default: "" },
    ppm: { type: Number, default: 0.0 },
    mpp: { type: Number, default: 0.0 },
    nodes: { type: [nodeSchema], default: [] },
    stations: { type: [stationSchema], default: [] },
    zones: {
      type: [zoneSchema],
      default: [],
    },
    robots: {
      type: [roboProjSchema],
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
