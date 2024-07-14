import express from "express";
import cors from "cors";
import {
  test,
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
  getUserProgress,
  getLevels,
  getSections,
  updateProgress,
  createLevel,
} from "../controllers/authController.js";

const router = express.Router();

// middleware
router.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// This endpoint is used to test if the server is running
router.get("/", test);

// AUTHENTICATION ROUTES
// --------------------

// This endpoint is used to register a new user
router.post("/register", registerUser);
// This endpoint is used to login a user
router.post("/login", loginUser);
// This endpoint is used to get the user profile
router.get("/profile", getProfile);
// This endpoint is used to logout a user
router.post("/logout", logoutUser);

// --------------------

// PROGRESS ROUTES
// --------------------

// This endpoint is used to get user progress
router.get("/users/${userId}/progress", getUserProgress);
// This endpoint is used to get levels for a section
router.get("/sections/${sectionId}/levels", getLevels);
// This endpoint is used to get all sections
router.get("/sections", getSections);
// This endpoint is used to update user progress
router.put("/progress", updateProgress);

// --------------------

// This endpoint is used to create a new level
router.post("/levels", createLevel);

export default router;
