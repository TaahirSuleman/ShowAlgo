import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import pseudocodeRoutes from "./routes/pseudocodeRoutes.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/showalgo";

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173", // Local development frontend
  "https://showalgo-1.cs.uct.ac.za", // Production frontend URL
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allows session cookie to pass through
  })
);

// Database connection
mongoose
  .connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.log(err));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// API routes
app.use("/", authRoutes);
app.use("/api/pseudocode", pseudocodeRoutes);

// Serve static files (for React frontend) in production
if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve(); // Ensures correct path handling
  app.use(express.static(path.join(__dirname, "frontend", "build")));

  // Serve index.html for all non-API routes
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

// Start the server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
