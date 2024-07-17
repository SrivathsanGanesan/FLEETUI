const { Schema, model, mongoose } = require("mongoose");
const { userManagementConnection } = require("../db_config");

const authRegisterSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "user name is required!"],
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: [true, "user role is required!"],
      enum: ["User", "Maintainer", "Administrator"],
      trim: true,
    },
    priority: {
      type: Number,
      required: true,
      min: 1,
      max: 3,
    },
  },
  { timestamps: true, versionKey: false }
);

const authRegisterModel = userManagementConnection.model(
  "User",
  authRegisterSchema,
  "User"
);

module.exports = authRegisterModel;
