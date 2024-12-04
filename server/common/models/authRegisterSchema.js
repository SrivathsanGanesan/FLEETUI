const { Schema, model, mongoose } = require("mongoose");
const { userManagementConnection } = require("../db_config");
const { projectModel } = require("../../fleetcore/models/projectSchema");

const userProjListschema = new Schema(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "projectModel" },
    projectName: {
      type: String,
      required: [true, "Project_name is required!"],
      trim: true,
    },
  },
  { _id: false, versionKey: false }
);

const userPermission = new Schema(
  {
    // dashboard: {
    //   enable: { type: Boolean, default: false },
    //   create: { type: Boolean, default: false },
    //   edit: { type: Boolean, default: false },
    //   delete: { type: Boolean, default: false },
    //   view: { type: Boolean, default: false },
    // },

    generalPermissions: {
      dashboard: { type: Boolean, default: false },
      statistics: { type: Boolean, default: false },
      robots: { type: Boolean, default: false },
      errors: { type: Boolean, default: false },
      tasks: { type: Boolean, default: false },
      userManagement: { type: Boolean, default: false },
    },

    configurationPermissions: {
      environment: {
        enabled: { type: Boolean, default: false },
        create: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        delete: { type: Boolean, default: false },
        view: { type: Boolean, default: false }
      },
      robot: {
        enabled: { type: Boolean, default: false },
        create: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        delete: { type: Boolean, default: false },
        view: { type: Boolean, default: false }

      },
      fleet: {
        enabled: { type: Boolean, default: false },
        create: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        delete: { type: Boolean, default: false },
        view: { type: Boolean, default: false }
      }
    }

    // statistics: {
    //   enable: { type: Boolean, default: false },
    //   create: { type: Boolean, default: false },
    //   edit: { type: Boolean, default: false },
    //   delete: { type: Boolean, default: false },
    //   view: { type: Boolean, default: false },
    // },
    // robots: {
    //   enable: { type: Boolean, default: false },
    //   create: { type: Boolean, default: false },
    //   edit: { type: Boolean, default: false },
    //   delete: { type: Boolean, default: false },
    //   view: { type: Boolean, default: false },
    // },
    // configuration: {
    //   enable: { type: Boolean, default: false },
    //   create: { type: Boolean, default: false },
    //   edit: { type: Boolean, default: false },
    //   delete: { type: Boolean, default: false },
    //   view: { type: Boolean, default: false },
    // },
    // errLogs: {
    //   enable: { type: Boolean, default: false },
    //   create: { type: Boolean, default: false },
    //   edit: { type: Boolean, default: false },
    //   delete: { type: Boolean, default: false },
    //   view: { type: Boolean, default: false },
    // },
    // tasks: {
    //   enable: { type: Boolean, default: false },
    //   create: { type: Boolean, default: false },
    //   edit: { type: Boolean, default: false },
    //   delete: { type: Boolean, default: false },
    //   view: { type: Boolean, default: false },
    // },
  },
  { _id: false, versionKey: false }
);

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
    permissions: {
      type: userPermission,
      default: { userPermission },
    },
    createdBy: {
      type: String,
      default: "",
    },
    projects: {
      type: [userProjListschema],
      default: [],
    },
  },
  { timestamps: true, versionKey: false }
);

const authRegisterModel = userManagementConnection.model(
  "User",
  authRegisterSchema,
  "User"
);

module.exports = { authRegisterModel, userProjListschema, userPermission };
