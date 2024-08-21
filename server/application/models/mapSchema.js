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
    //   single_node: { type: Boolean, default: true },
    //   multi_node: { type: Boolean, default: false },
    node_type: { type: String, default: "single", enum: ["single", "multi"] },
    pos: { type: [{ type: { x: Number, y: Number } }], default: [] },
    others: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  {
    versionKey: false,
  }
);

const Node = dashboardConnection.model("nodes", nodeSchema, "nodes");

const stationSchema = new Schema(
  {
    asset: { type: String, default: "" },
    pos: {
      type: [
        { type: { x: Number, y: Number, w: { type: Number, default: 0 } } },
      ],
      default: [],
    },
    others: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  {
    versionKey: false,
  }
);

const edgeSchema = new Schema(
  {
    connectivity: {
      type: String,
      default: "uniDir",
      enum: ["uniDir", "biDir"],
    },
    start_node: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Node",
      // name: { type: String, default: "" },
    },
    end_node: { type: mongoose.Schema.Types.ObjectId, ref: "Node" },
    others: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  {
    // timestamps: true,
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
    origin: {
      type: { x: Number, y: Number, w: Number },
      default: { x: 0, y: 0, w: 0 },
    },
    imgUrl: { type: String, default: "" },
    mpp: { type: Number, default: 0.0 }, // resolution
    ppm: { type: Number, default: 0.0 },
    nodes: { type: [nodeSchema], default: [] },
    edges: { type: [edgeSchema], default: [] },
    stations: { type: [stationSchema], default: [] },
    zones: { ctype: [zoneSchema], cdefault: [] },
    robots: { type: [roboProjSchema], default: [] },
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
