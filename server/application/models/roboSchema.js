const { Schema, model, mongoose } = require("mongoose");
const zoneSchema = new Schema(
  {
    zoneId: { type: String, required: true },
    zoneName: { type: String, required: true, trim: true },
    zoneCoordinates: [{ x: Number, y: Number, _id: false }],
  },
  { _id: false }
);

const roboSchema = new Schema(
  {
    roboId: { type: String, unique: true, required: true },
    roboName: { type: String, required: true },
    type: { type: String, default: "AGV" },
    status: { type: String, required: true, default: "idle" },
    location: {
      type: [{ x: Number, y: Number, _id: false }],
      _id: false,
      default: [{ x: 0, y: 0 }],
    },
    batteryStatus: { type: Number, required: true, min: 0, max: 100 },
    roboTask: [{ type: String, _id: false }],
    error: {
      type: [{ type: String }],
      default: [],
    },
  },
  { timestamps: true, _id: false, strict: false }
);

module.exports = { roboSchema, zoneSchema };
