const express = require("express");
const authRouter = express.Router();
const {
  login,
  logout,
  register,
} = require("../controllers/auth/authController");
const {
  getUsers,
  deleteUser,
} = require("../controllers/userCredentials/fetchUsers");

// auth..
authRouter.post("/login", login);
authRouter.get("/logout", logout);
authRouter.post("/register", register);

// fetch users..
authRouter.get("/fetch-users", getUsers);
authRouter.delete("/delete-user", deleteUser);

module.exports = authRouter;
