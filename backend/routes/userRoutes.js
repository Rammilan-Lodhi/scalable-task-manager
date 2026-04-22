const express = require("express");
const { getUsers, getUser, deleteUser } = require("../controllers/userController");
const { protect, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.use(protect, authorizeRoles("admin"));

router.get("/", getUsers);
router.get("/:id", getUser);
router.delete("/:id", deleteUser);

module.exports = router;
