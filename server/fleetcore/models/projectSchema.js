const { Schema, model } = require("mongoose");
const { siteSchema, roboProjSchema } = require("./sitesSchema");
const { projectConnection } = require("../../common/db_config");

const fleetParamsSchema = new Schema(
  {
    General: { type: Schema.Types.Mixed, default: {} },
    Planner: { type: Schema.Types.Mixed, default: {} },
    Task: { type: Schema.Types.Mixed, default: {} },
    Battery: { type: Schema.Types.Mixed, default: {} },
    Communication: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, versionKey: false, _id: false }
);

const projectSchema = new Schema(
  {
    projectName: {
      type: String,
      required: [true, "project name is required!"],
      trim: true,
      unique: true,
    },
    sites: {
      type: [siteSchema],
      default: [],
    },
    robots: {
      type: [roboProjSchema],
      default: [],
    },
    fleetParams: {
      type: fleetParamsSchema,
      default: {},
    },
    fleetRecords: {
      type: [{ type: { startTime: Date, endTime: Date } }],
      _id: false, // remove it in later..
      default: [],
    },
  },
  { timestamps: true, versionKey: false }
);

const projectModel = projectConnection.model(
  "projectDets",
  projectSchema,
  "projectDets"
);

const siteModel = projectConnection.model("site", siteSchema, "site");

module.exports = { projectModel, siteModel };
