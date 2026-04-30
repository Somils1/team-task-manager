import express from "express";
import Project from "../models/Project.js";
import User from "../models/User.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name required" });
    }

    const project = await Project.create({
      name,
      admin: req.user._id,
      members: [req.user._id],
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    const projects = await Project.find({
      members: req.user._id,
    });

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ➕ Add member by email (admin only)
router.post("/:id/add-member", protect, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // ✅ only admin can add
    if (project.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only admin can add members" });
    }

    // ✅ find user by email (THIS IS THE KEY)
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ avoid duplicates
    const exists = project.members.some(
      (m) => m.toString() === user._id.toString()
    );

    if (!exists) {
      project.members.push(user._id);
      await project.save();
    }

    res.json({ message: "Member added", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔥 DELETE PROJECT (admin only)
router.delete("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // only admin can delete
    if (project.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only admin can delete project" });
    }

    await project.deleteOne();

    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.delete("/:id/remove-member/:userId", protect, async (req, res) => {
  try {
    const { id, userId } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Only admin can remove members
    if (project.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only admin can remove members" });
    }

    // Prevent removing admin
    if (project.admin.toString() === userId) {
      return res.status(400).json({ message: "Admin cannot be removed" });
    }

    project.members = project.members.filter(
      (m) => m.toString() !== userId
    );

    await project.save();

    res.json({ message: "Member removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 🔍 Get project with members (needed for dropdown)
router.get("/:id", protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("members", "name email");

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;