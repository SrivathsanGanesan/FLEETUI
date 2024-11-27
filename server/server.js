const app = require("./common/server_config");
require("dotenv").config();
const path = require("path");

// dashboard...
const dashboardMapRouter = require("./application/routes/dashboardMapRouter");
const dashbdGrossCountRouter = require("./application/routes/dashboardGrossCountRouter");
const dashboardUptimeRouter = require("./application/routes/dashboardUptimeRouter");
app.use("/dashboard/maps", dashboardMapRouter);
app.use("/dashboard", dashbdGrossCountRouter);
// app.use("/dashboard/uptime", dashboardUptimeRouter); // no need anymore!!!

// login...
const authRouter = require("./common/routes/authRouter");
app.use("/auth", authRouter);

//creat project..
const projectRouter = require("./fleetcore/routes/projectRouter");
app.use("/fleet-project", projectRouter);

// robot router..
const roboSpecificationRouter = require("./application/routes/roboSpecificationRouter");
app.use("/robo-configuration", roboSpecificationRouter);

// project file..
const projectFileRouter = require("./fleetcore/routes/projectFileRouter");
app.use("/fleet-project-file", projectFileRouter);

// configuration..
const configurationRouter = require("./fleetcore/routes/configurationRouter");
app.use("/fleet-config", configurationRouter);

// live data of fleet..
const liveStreamRouter = require("./fleetcore/routes/liveStreamRouter");
app.use("/stream-data", liveStreamRouter);

const graphRouter = require("./fleetcore/routes/graphRouter");
app.use("/graph", graphRouter);

// tasks..
const tasksRouter = require("./fleetcore/routes/tasksRouter");
app.use("/fleet-tasks", tasksRouter);

// Err Logs..
const errLogRouter = require("./fleetcore/routes/errorLogRouter");
app.use("/err-logs", errLogRouter);

// Fleet gross status..
const fleetGrossStatusRouter = require("./fleetcore/routes/fleetGrossStatusRouter");
app.use("/fleet-gross-status", fleetGrossStatusRouter);

// config fleet parameter..
const fleetParamsConfigurationRouter = require("./fleetcore/routes/fleetParamsConfigurationRouter");
app.use("/config-fleet-params", fleetParamsConfigurationRouter);

app.listen(process.env.PORT, (err) => {
  err
    ? console.log("error while connecting : ", err)
    : console.log("connected successfully!");
});
