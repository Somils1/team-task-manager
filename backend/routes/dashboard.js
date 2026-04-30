 import express from "express";
import Task from "../models/Task.js";
import Project from "../models/Project.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    // 🔹 Get all projects where user is a member
    const projects = await Project.find({
      members: req.user._id,
    });

    const projectIds = projects.map(p => p._id);

    // 🔹 Get tasks only for those projects
    const tasks = await Task.find({
      project: { $in: projectIds },
    });

    const totalTasks = tasks.length;

    const todo = tasks.filter(t => t.status === "Todo").length;
    const inProgress = tasks.filter(t => t.status === "In Progress").length;
    const done = tasks.filter(t => t.status === "Done").length;

    const overdue = tasks.filter(
      t =>
        t.dueDate &&
        new Date(t.dueDate) < new Date() &&
        t.status !== "Done"
    ).length;

    // 🔹 Tasks per user (extra edge — interview bonus)
    const tasksPerUser = {};

    tasks.forEach(task => {
      const userId = task.assignedTo?.toString() || "unassigned";

      if (!tasksPerUser[userId]) {
        tasksPerUser[userId] = 0;
      }

      tasksPerUser[userId]++;
    });

    res.json({
      totalTasks,
      status: {
        todo,
        inProgress,
        done,
      },
      overdue,
      tasksPerUser,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;