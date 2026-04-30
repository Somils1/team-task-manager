 import express from "express";
import Task from "../models/Task.js";
import Project from "../models/Project.js";
import protect from "../middleware/auth.js";

const router = express.Router();


// 🔹 CREATE TASK (only project members allowed)
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, dueDate, priority, projectId, assignedTo } = req.body;

    // check project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // check user is part of project
    if (!project.members.includes(req.user._id)) {
      return res.status(403).json({ message: "Not a project member" });
    }

     //validate assigned user
     if (assignedTo && !project.members.includes(assignedTo)) {
      return res.status(400).json({
        message: "Assigned user must be a project member",
      });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      project: projectId,
      assignedTo,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// 🔹 GET TASKS BY PROJECT
router.get("/project/:projectId", protect, async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate("assignedTo", "name email");

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// 🔹 UPDATE TASK STATUS
router.put("/:id", protect, async (req, res) => {
  try {
    const { status } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // only assigned user or admin can update
    const project = await Project.findById(task.project);

    if (
      task.assignedTo?.toString() !== req.user._id.toString() &&
      project.admin.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized to update this task" });
    }

    task.status = status || task.status;

    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// 🔹 DELETE TASK (admin only)
router.delete("/:id", protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await Project.findById(task.project);

    if (project.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only admin can delete tasks" });
    }

    await task.deleteOne();

    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;