const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:4200"], // cont with next...
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(
  "/dashboard",
  express.static(path.join("proj_assets", "dashboardMap")) // "/dashboard/map_1.jpg"
);

module.exports = app;