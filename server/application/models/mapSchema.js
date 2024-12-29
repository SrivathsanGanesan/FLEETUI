const { Schema, model, mongoose, mongo } = require("mongoose");
const { roboSchema, zoneSchema } = require("./roboSchema");
const { dashboardConnection } = require("../../common/db_config");

const roboProjSchema = new Schema(
  {
    roboId: {
      type: Schema.Types.ObjectId,
      ref: "Robo",
      // required: true,
    },
    name: {
      type: String,
      // required: [true, "name of the robo required!"],
      trim: true,
    },
  },
  { timestamps: true, versionKey: false, _id: false }
);

const nodeSchema = new Schema(
  {
    //   single_node: { type: Boolean, default: true },
    //   multi_node: { type: Boolean, default: false },
    nodeId: { type: Number, default: 0 },
    nodeType: { type: String, default: "single", enum: ["single", "multi"] },
    pos: { type: [{ type: { x: Number, y: Number } }], default: [] },
    others: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  {
    versionKey: false,
  }
);

// const Node = dashboardConnection.model("nodes", nodeSchema, "nodes");

const stationSchema = new Schema(
  {
    asset: { type: String, default: "" },
    pos: {
      type: { x: Number, y: Number, w: { type: Number, default: 0 } },
      // type: [
      //   { type: { x: Number, y: Number, w: { type: Number, default: 0 } } },
      // ],
      // default: [],
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
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "Node",
      type: Number,
      default: "",
    },
    end_node: {
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "Node",
      type: Number,
      default: "",
    },
    others: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  {
    // timestamps: true,
    versionKey: false,
    _id: false,
  }
);

const logTimeSchema = new Schema(
  {
    startTime: { type: Date, default: Date.now },
    stopTime: { type: Date, default: null },
    isCycleComplete: { type: Boolean, default: false },
    inHr: { type: Number, default: 0 },
  },
  {
    versionKey: false,
    _id: false,
  }
);

const throughPutSchema = new Schema(
  {
    Stat: { type: [Schema.Types.Mixed] },
    inProg: { type: [Schema.Types.Mixed] },
  },
  { timestamps: true, versionKey: false, _id: false }
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
    nodes: { type: Schema.Types.Mixed, default: [] }, // type : [nodeSchema]
    edges: { type: Schema.Types.Mixed, default: [] }, // type: [edgeSchema]
    stations: { type: Schema.Types.Mixed, default: [] }, // type: [stationSchema]
    zones: { type: Schema.Types.Mixed, default: [] }, // type: [zoneSchema]
    roboPos: { type: Schema.Types.Mixed, default: [] },
    robots: { type: [roboProjSchema], default: [] },
    simMode: { type: Schema.Types.Mixed, default: [] }, // yet to look..
    logTime: { type: [logTimeSchema], default: [] },
    heatMap: {
      type: [
        {
          x: Number,
          y: Number,
          intensity: Number,
        },
      ],
      default: [],
      _id: false,
    },
    throughPut: {
      type: throughPutSchema,
      default: { Stat: [], inProg: [] },
    },
    tasks: { type: [Schema.Types.Mixed], default: [] },
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
