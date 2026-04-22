const express = require("express");
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  assignTask,
} = require("../controllers/taskController");
const { protect, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.post("/assign", authorizeRoles("admin"), assignTask);

router
  .route("/")
  .get(authorizeRoles("user", "admin"), getTasks)
  .post(authorizeRoles("user", "admin"), createTask);

router
  .route("/:id")
  .get(authorizeRoles("user", "admin"), getTask)
  .put(authorizeRoles("user", "admin"), updateTask)
  .delete(authorizeRoles("user", "admin"), deleteTask);

module.exports = router;
