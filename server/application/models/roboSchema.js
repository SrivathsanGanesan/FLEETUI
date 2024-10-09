const { Schema, model, mongoose } = require("mongoose");

const zoneSchema = new Schema(
  {
    zoneName: { type: String, trim: true }, // required: true
    zoneCoordinates: [{ x: Number, y: Number, _id: false }],
    // speedLimit: { type: Number, default: 0 },
  },
  { versionKey: false }
);

const roboSchema = new Schema(
  {
    roboName: { type: String, required: true, unique: true },
    amrId: { type: Number, default: 0 }, //..
    uuid: { type: String, default: "" }, //..
    // isSimMode: { type: Boolean, default: false }, // yet to take after simulation.. mind on it
    type: { type: String, default: "AGV" },
    ipAdd: { type: String, default: "" },
    imgUrl: { type: String, default: "" },
    macAdd: { type: String, default: "" }, // make it unique..
    status: { type: String, default: "idle" },
    location: {
      type: [{ x: Number, y: Number, _id: false }],
      _id: false,
      default: [{ x: 0, y: 0 }],
    },
    batteryStatus: { type: Number, min: 0, max: 100 },
    roboTask: [{ type: String, _id: false }],
    idleRate: { type: Number, default: 0 },
    grossInfo: { type: Schema.Types.Mixed, default: {} },
    error: {
      type: [{ type: String }],
      default: [],
    },
  },
  { timestamps: true, strict: false, versionKey: false }
);

module.exports = { roboSchema, zoneSchema };
