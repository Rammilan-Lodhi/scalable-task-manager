const User = require("../models/User");
const Task = require("../models/Task");
const ApiError = require("../utils/ApiError");

exports.getUsers = async (_req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new ApiError(404, "User not found");
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new ApiError(404, "User not found");
    if (user._id.toString() === req.user.id) {
      throw new ApiError(400, "Admins cannot delete their own account");
    }
    await Task.deleteMany({ userId: user._id });
    await user.deleteOne();
    res.json({ success: true, message: "User and their tasks deleted" });
  } catch (err) {
    next(err);
  }
};
