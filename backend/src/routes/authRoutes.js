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
  getSingleLevel,
  getSections,
  getSingleSection,
  updateProgress,
  createLevel,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

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
router.get("/users/:userId/progress", authMiddleware, getUserProgress);

// This endpoint is used to get levels for a section
router.get("/sections/:sectionRoute/levels", authMiddleware, getLevels);
// This endpoint is used to get a single level
router.get("/sections/:sectionRoute/levels/:levelRoute", authMiddleware, getSingleLevel);

// This endpoint is to get a single section by route name
router.get("/sections/:sectionRoute", authMiddleware, getSingleSection);
// This endpoint is used to get all sections
router.get("/sections", authMiddleware, getSections);
// This endpoint is used to update user progress
router.put("/progress", authMiddleware, updateProgress);

// --------------------

// This endpoint is used to create a new level
router.post("/levels", adminMiddleware, createLevel);

export default router;
