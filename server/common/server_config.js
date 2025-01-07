const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

const session = require("express-session");

require("dotenv").config();
const { sessionStore } = require("./db_config");

const app = express();

// cors
app.use(
  cors({
    origin: [
      "http://localhost:4200",
      // "http://192.168.225.183:4200",
    ], // WIP...
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// session;
app.use(
  session({
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    secret: process.env.JWT_SECRET_KEY,
    name: "_token", // default -> connect.sid
    cookie: {
      httpOnly: false, // true
      sameSite: "strict",
      secure: false,
      maxAge: 1000 * 60 * 60 * 8, // 8 hrs
    },
  })
);

// static hosting content
app.use(
  "/dashboard", // virtual path, (just the placeholder for original path)
  express.static(path.join("proj_assets", "dashboardMap")) // "/dashboard/map_1.jpg"
  // or express.static("proj_assets/dashboard")
);

app.use(
  "/roboSpecification",
  express.static(path.join("proj_assets/roboSpecification"))
);

module.exports = app;
