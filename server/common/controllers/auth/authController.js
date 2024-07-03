var generator = require("generate-password");
const bcrypt = require("bcryptjs");
const authRegisterModel = require("../../models/authRegisterSchema");

const getRandomPassword = () => {
  const randomPass = generator.generate({
    length: 8,
    symbols: false,
    numbers: true,
    strict: true,
  });
  return randomPass;
};

const login = async (req, res) => {
  const { name, role, password } = req.body.user;
  try {
    const user = await authRegisterModel.find({ name: name, role: role });
    if (!user.length)
      return res.status(404).json({
        isUserExist: false,
        msg: "user (or) role not found",
      });
    const isMatch = await bcrypt.compare(name + password, user[0].password);
    if (isMatch)
      return res.status(200).json({
        isUserExist: true,
        msg: "User found",
        user: {
          id: user[0]._id,
          name: user[0].name,
          role: user[0].role,
          priority: user[0].priority,
        },
      });
    return res
      .status(401) // Unauthorized
      .json({ isUserExist: true, msg: "wrong password!", user: null });
  } catch (err) {
    console.log("err occ : ", err);
    return res.status(500).json({ operation: "login failed!", error: err });
  }
};

const register = async (req, res) => {
  const { name, role, password } = req.body.user;
  const randomPass = getRandomPassword();
  try {
    const alterPass = name + randomPass;
    const hashhedPassword = await bcrypt.hash(alterPass, 2);
    const doc = await authRegisterModel.findOne({ name: name, role: role });
    if (!doc) {
      const newData = new authRegisterModel({
        name: name,
        password: hashhedPassword,
        role: role,
        priority: role === "admin" ? 1 : role === "maintenance" ? 2 : 3,
      });

      const updatedDoc = await newData.save();
      return res.status(200).json({
        operation: "succeed",
        updatedDoc: {
          name: updatedDoc.name,
          role: updatedDoc.role,
          id: updatedDoc._id,
          password: randomPass,
        },
      });
    }
    return res
      .status(409) // 409 - already exists!
      .json({ isExist: true, msg: "person already exists" });
  } catch (err) {
    console.log("err occ : ", err);
    return res
      .status(500)
      .json({ operation: "registration failed!", error: err });
  }
};

module.exports = { login, register };
