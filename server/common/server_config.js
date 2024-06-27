const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  "/dashboard",
  express.static(path.join("proj_assets", "dashboardMap")) // "/dashboard/map_1.jpg"
);

module.exports = app;