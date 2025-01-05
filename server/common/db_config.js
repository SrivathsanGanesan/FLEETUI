const mongoose = require("mongoose");

const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session); // creates an class and pass the session method as/to constructor..

require("dotenv").config();

const sessionStore = new MongoDBStore({
  uri: process.env.MONGO_SESSION_URI,
  // collection: "userSessions", // default -> "sessions"
});

const dashboardConnection = mongoose.createConnection(
  process.env.MONGO_DASHBOARD_URI
);
const userManagementConnection = mongoose.createConnection(
  process.env.MONGO_USERMANAGEMENT_URI
);
const projectConnection = mongoose.createConnection(
  process.env.MONGO_PROJECT_URI
);

const isConnect = (dbConnection) => {
  dbConnection.on("connected", () => {
    console.log(`${dbConnection.name} connected..`);
  });

  dbConnection.on("error", (err) => {
    console.log(`${dbConnection.name} connection err : `, err);
  });

  dbConnection.on("disconnected", () => {
    console.log(`${dbConnection.name} disconnected`);
  });
};

const isSessionConnect = (session) => {
  session.on("connected", () => {
    console.log(`${session.collection.dbName} connected..`);
  });

  session.on("error", (err) => {
    console.log(`${session.collection.dbName} connection err : `, err);
  });

  session.on("disconnected", () => {
    console.log(`${session.collection.dbName} disconnected`);
  });
};

isSessionConnect(sessionStore);

isConnect(dashboardConnection);
isConnect(userManagementConnection);
isConnect(projectConnection);

module.exports = {
  dashboardConnection,
  userManagementConnection,
  projectConnection,
  sessionStore,
};
