import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { connectDB } from "./config/db.config";
import userRoutes from "./route/user.route";
import authRoutes from "./route/auth.route";
import projectRoutes from "./route/project.route";
import messageRoutes from "./route/message.route";
import "./queues/mail.worker";

dotenv.config();

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: "*",
  }),
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }));

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/messages", messageRoutes);

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
