const { authRegisterModel } = require("../../models/authRegisterSchema");
const { projectModel } = require("../../../fleetcore/models/projectSchema");

const getUsers = async (req, res) => {
  try {
    // role: { $ne: "Administrator" }, // role which not equal to given field..
    const users = await authRegisterModel.find();
    return res.status(200).json({ users: users, msg: "data sent" });
  } catch (err) {
    console.log("error occured : ", err);
    res.status(500).json({ opt: "Getting users failed", error: err });
  }
};

const deleteUser = async (req, res) => {
  const { userId, userName, userRole, createdBy } = req.body;
  try {
    const isUserExist = await authRegisterModel.exists({ _id: userId });
    if (!isUserExist)
      return res.status(404).json({ userExist: false, msg: "User not found" });
    const deletedUser = await authRegisterModel.deleteOne({ _id: userId });
    if (deletedUser.deletedCount > 0)
      return res.status(200).json({ userExist: true, msg: "User deleted" });
  } catch (error) {
    console.log("error occured : ", err);
    res.status(500).json({ opt: "Deleting user failed", error: err });
  }
};

module.exports = { getUsers, deleteUser };
