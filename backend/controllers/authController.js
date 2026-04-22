const validator = require("validator");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const generateToken = require("../utils/generateToken");

exports.register = async (req, res, next) => {
  try {
    const name = (req.body.name || "").trim();
    const email = (req.body.email || "").trim().toLowerCase();
    const password = req.body.password || "";
    const role = req.body.role === "admin" ? "admin" : "user";

    if (!name || !email || !password) {
      throw new ApiError(400, "Name, email, and password are required");
    }
    if (!validator.isEmail(email)) {
      throw new ApiError(400, "Invalid email format");
    }
    if (password.length < 6) {
      throw new ApiError(400, "Password must be at least 6 characters");
    }

    const existing = await User.findOne({ email });
    if (existing) throw new ApiError(400, "Email already registered");

    const user = await User.create({ name, email, password, role });
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      user: user.toSafeJSON(),
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const email = (req.body.email || "").trim().toLowerCase();
    const password = req.body.password || "";

    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) throw new ApiError(401, "Invalid credentials");

    const ok = await user.comparePassword(password);
    if (!ok) throw new ApiError(401, "Invalid credentials");

    const token = generateToken(user);
    res.json({
      success: true,
      token,
      user: user.toSafeJSON(),
    });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw new ApiError(404, "User not found");
    res.json({ success: true, user: user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
};
