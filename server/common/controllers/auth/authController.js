const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authRegisterModel } = require("../../models/authRegisterSchema");
// const { projectModel } = require("../../../fleetcore/models/projectSchema");

const { sessionStore } = require("../../db_config");

const sessionCollection = sessionStore.db.collection("sessions"); // way to access UserSession collection instead of Model..

const validateToken = async (req, res, next) => {
  const token = req.cookies._token;
  try {
    if (!token)
      return res.status(401).json({ tokenValid: null, msg: "Access denied" });
    // jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    //   // console.log(err, decoded)
    //   if (!err) {
    if (req.session.isUserExist) {
      req.user = req.session.user.name;
      req.role = req.session.user.role;
      return next();
    }
    return res
      .status(403) // 403 - Forbidden | 401 - unauthorized
      .json({ tokenValid: false, msg: "Invalid token" });
    // });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "failed validating token", error: error });
  }
};

// app.use(validateToken); // used to handle validation per every request, which hits it for every incommin req

const login = async (req, res) => {
  const { name, role, password } = req.body.user;
  try {
    const user = await authRegisterModel.find({ name: name, role: role });
    if (!user.length)
      return res.status(404).json({
        isUserExist: false,
        msg: "user (or) role not found",
        user: null,
      });
    const isMatch = await bcrypt.compare(name + password, user[0].password);
    if (isMatch) {
      let existingUser = await sessionCollection
        .find({ "session.user": { name, role } })
        .toArray();

      if (existingUser.length)
        return res.json({
          msg: "usr already logged in! Try after some time",
          isUserInSession: true,
          existingUser: existingUser[0].session.user,
        });

      req.session.isUserExist = true;
      req.session.user = { name, role };

      let project = null;

      if (role === "User") {
        if (!user[0].projects.length)
          return res.status(200).json({
            isUserExist: true,
            isUserInSession: false,
            maxAge: req.session.cookie.originalMaxAge / 1000,
            msg: "User found",
            user: {
              id: user[0]._id,
              name: user[0].name,
              role: user[0].role,
              priority: user[0].priority,
              permissions: user[0].permissions,
              projects: user[0].projects,
            },
            project: project,
          });
        // project = await projectModel.findById(user[0].projects[0].projectId);
      }

      // const token = jwt.sign(
      //   { user: name, role: role },
      //   process.env.JWT_SECRET_KEY
      // );

      return res.status(200).json({
        isUserExist: true,
        isUserInSession: false,
        maxAge: req.session.cookie.originalMaxAge / 1000,
        msg: "User found",
        user: {
          id: user[0]._id,
          name: user[0].name,
          role: user[0].role,
          priority: user[0].priority,
          permissions: user[0].permissions,
          projects: user[0].projects,
        },
        project: project,
      });
    }

    return res
      .status(401) // Unauthorized
      .json({ isUserExist: true, msg: "wrong password!", user: null });
  } catch (err) {
    console.log("err occ : ", err);
    return res.status(500).json({ operation: "login failed!", error: err });
  }
};

const logout = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.log("err while Destroying session : ", err);
        return res.status(500).json({
          isSessionDestroyed: false,
          msg: "Error while Destroying session from middleware",
        });
      }
    });

    res.clearCookie("_token");

    return res.status(200).json({
      msg: "cookies deleted!",
      isCookieDeleted: true,
      isSessionDestroyed: true,
    });
  } catch (error) {
    console.log("error in logout : ", error);
    return res.status(500).json({ operation: "logout failed!", error: error });
  }
};

const register = async (req, res) => {
  const { projectId, projectName, name, role, password, createdBy } =
    req.body.user;
  try {
    const alterPass = name + password;
    const hashhedPassword = await bcrypt.hash(alterPass, 2);
    const doc = await authRegisterModel.findOne({ name: name, role: role });
    if (doc)
      return res
        .status(409) // 409 - already exists!
        .json({ isExist: true, msg: "person already exists" });
    let permissions = {};
    if (role === "Administrator") {
      permissions = {
        generalPermissions: {
          dashboard: true,
          statistics: true,
          robots: true,
          errors: true,
          tasks: true,
          userManagement: true,
        },

        configurationPermissions: {
          environment: {
            enabled: true,
            create: true,
            edit: true,
            delete: true,
            view: true,
          },
          robot: {
            enabled: true,
            create: true,
            edit: true,
            delete: true,
            view: true,
          },
          fleet: {
            enabled: true,
            create: true,
            edit: true,
            delete: true,
            view: true,
          },
        },
      };
    }
    const newData = new authRegisterModel({
      name: name,
      password: hashhedPassword,
      role: role,
      priority: role === "Administrator" ? 1 : role === "Maintainer" ? 2 : 3,
      permissions: permissions,
      projects: [{ projectId: projectId, projectName: projectName }],
      createdBy: createdBy,
    });

    const updatedDoc = await newData.save();

    return res.status(200).json({
      operation: "succeed",
      updatedDoc: {
        name: updatedDoc.name,
        role: updatedDoc.role,
        id: updatedDoc._id,
        password: password,
        projects: updatedDoc.projects,
        createdBy: updatedDoc.createdBy,
      },
    });
  } catch (err) {
    console.log("err occ : ", err);
    return res
      .status(500)
      .json({ operation: "registration failed!", error: err });
  }
};

const destroyUserSession = async (req, res) => {
  const { name, role } = req.body;
  try {
    let sessionUser = await sessionCollection
      .find({ "session.user": { name, role } })
      .toArray();

    if (!sessionUser.length)
      return res.status(404).json({
        msg: "this user no longer in session!",
        isUserInSession: false,
      });
    let deleteSessionUser = await sessionCollection.deleteMany({
      "session.user": { name, role },
    });

    return res.status(200).json({ deletedSession: deleteSessionUser });
  } catch (error) {
    console.log("err occ : ", error);
    return res
      .status(500)
      .json({ operation: "destroying sessions failed!", error: error });
  }
};

module.exports = { login, logout, register, validateToken, destroyUserSession };

// .cookie("_token", token, {
//   httpOnly: true, // cookie cannot be accessed via JavaScript
//   sameSite: "Strict", //..Strict None => Strict when prod
//   secure: false, //.. true (only sent over https) | false (sent over both http and https)
// }) //sameSite: "Strict" only from the originated site..
