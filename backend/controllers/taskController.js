const Task = require("../models/Task");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");

const isAdmin = (req) => req.user && req.user.role === "admin";

exports.createTask = async (req, res, next) => {
  try {
    const title = (req.body.title || "").trim();
    const description = (req.body.description || "").trim();
    if (!title) throw new ApiError(400, "Title is required");

    const task = await Task.create({
      title,
      description,
      userId: req.user.id,
    });
    res.status(201).json({ success: true, task });
  } catch (err) {
    next(err);
  }
};

exports.getTasks = async (req, res, next) => {
  try {
    const filter = isAdmin(req) ? {} : { userId: req.user.id };
    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .populate("userId", "name email role")
      .populate("assignedBy", "name email");
    res.json({ success: true, count: tasks.length, tasks });
  } catch (err) {
    next(err);
  }
};

exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) throw new ApiError(404, "Task not found");
    if (!isAdmin(req) && task.userId.toString() !== req.user.id) {
      throw new ApiError(403, "Forbidden");
    }
    res.json({ success: true, task });
  } catch (err) {
    next(err);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) throw new ApiError(404, "Task not found");
    if (!isAdmin(req) && task.userId.toString() !== req.user.id) {
      throw new ApiError(403, "Forbidden");
    }

    const { title, description, completed } = req.body;
    if (title !== undefined) task.title = String(title).trim();
    if (description !== undefined) task.description = String(description).trim();
    if (completed !== undefined) task.completed = Boolean(completed);

    await task.save();
    res.json({ success: true, task });
  } catch (err) {
    next(err);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) throw new ApiError(404, "Task not found");
    if (!isAdmin(req) && task.userId.toString() !== req.user.id) {
      throw new ApiError(403, "Forbidden");
    }
    await task.deleteOne();
    res.json({ success: true, message: "Task deleted" });
  } catch (err) {
    next(err);
  }
};

exports.assignTask = async (req, res, next) => {
  try {
    const title = (req.body.title || "").trim();
    const description = (req.body.description || "").trim();
    const userId = req.body.userId;

    if (!title || !userId) {
      throw new ApiError(400, "Title and userId are required");
    }
    const target = await User.findById(userId);
    if (!target) throw new ApiError(404, "Target user not found");

    const task = await Task.create({
      title,
      description,
      userId: target._id,
      assignedBy: req.user.id,
    });
    res.status(201).json({ success: true, task });
  } catch (err) {
    next(err);
  }
};
