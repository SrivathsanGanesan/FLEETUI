const { authRegisterModel } = require("../../models/authRegisterSchema");
const { projectModel } = require("../../../fleetcore/models/projectSchema");

const getUsers = async (req, res) => {
  try {
    // role: { $ne: "Administrator" }, // role which not equal to given field..
    const users = await authRegisterModel.find();
    return res.status(200).json({ users: users, msg: "data sent" });
  } catch (error) {
    console.log("error occured : ", error);
    res.status(500).json({ opt: "Getting users failed", error: error });
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
    console.log("error occured : ", error);
    res.status(500).json({ opt: "Deleting user failed", error: error });
  }
};

const getUserPermissions = async (req, res) => {
  const userId = req.params.userId;
  try {
    const isUserExist = await authRegisterModel.exists({ _id: userId });
    if (!isUserExist)
      return res.status(404).json({ userExist: false, msg: "User not found" });
    let user = await authRegisterModel.findOne({ _id: userId });

    return res.status(200).json({
      permissions: user.permissions,
      userExist: true,
      msg: "permission edited!",
    });
  } catch (error) {
    console.log("error occured : ", error);
    res
      .status(500)
      .json({ opt: "Editing user permission failed", error: error });
  }
};

const editUserPermissions = async (req, res) => {
  const { userId, permissions } = req.body;
  try {
    const isUserExist = await authRegisterModel.exists({ _id: userId });
    if (!isUserExist)
      return res.status(404).json({ userExist: false, msg: "User not found" });

    const updatedUserPermission = await authRegisterModel.findOneAndUpdate(
      {
        _id: userId,
      },
      { $set: { permissions: permissions } }, // { permissions : permissions } instead..
      { new: true }
    );
    return res.status(200).json({
      updatedUserPermission: updatedUserPermission,
      userExist: true,
      msg: "permission edited!",
    });
  } catch (error) {
    console.log("error occured : ", error);
    res
      .status(500)
      .json({ opt: "Editing user permission failed", error: error });
  }
};

module.exports = {
  getUsers,
  deleteUser,
  editUserPermissions,
  getUserPermissions,
};
