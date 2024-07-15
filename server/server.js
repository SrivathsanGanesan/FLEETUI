const app = require("./common/server_config");
require("dotenv").config();

// dashboard...
const dashboardMapRouter = require("./application/routes/dashboardMapRouter");
const dashbdGrossCountRouter = require("./application/routes/dashboardGrossCountRouter");
const dashboardThroughputRouter = require("./application/routes/dashboardThroughputRouter");
const dashboardUptimeRouter = require("./application/routes/dashboardUptimeRouter");
app.use("/dashboard/maps", dashboardMapRouter);
app.use("/dashboard", dashbdGrossCountRouter);
app.use("/dashboard/throughput", dashboardThroughputRouter);
app.use("/dashboard/uptime", dashboardUptimeRouter);

// login...
const authRouter = require("./common/routes/authRouter");
app.use("/auth", authRouter);

//creat project..
const projectRouter = require("./fleetcore/routes/projectRouter");
app.use("/create-new-project", projectRouter);

app.listen(process.env.PORT, (err) => {
  err
    ? console.log("error while connecting : ", err)
    : console.log("connected successfully!");
});
