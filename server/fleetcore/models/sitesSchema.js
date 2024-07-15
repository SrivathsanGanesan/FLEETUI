const { Schema, model, mongoose } = require("mongoose");

const siteSchema = new Schema(
  {
    siteName: {
      type: String,
      required: [true, "site name reqiured"],
      trime: true,
    },
    maps: [
      {
        mapId: {
          // reference Id of the Map model
          type: Schema.Types.ObjectId,
          ref: "Map",
          required: true,
        },
        mapName: {
          type: String,
          required: [true, "Map name is required!"],
          trim: true,
        },
      },
    ],
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

module.exports = { siteSchema, roboProjSchema };
