import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db.js";


dotenv.config();

const app = express();

connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route (to check server is working)
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes (we'll build these next)
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";
import taskRoutes from "./routes/tasks.js";
import dashboardRoutes from "./routes/dashboard.js";

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});