import express from "express";
import cors from "cors";
import {
  test,
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
  getLevels,
  getSingleLevel,
  getSections,
  getSingleSection,
  createLevel,
  createSection,
  deleteSection,
  updateSection,
  updateLevel,
  deleteLevel,
  getUserProgress,
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

// This endpoint is used to register a new user
router.post("/register", registerUser);
// This endpoint is used to login a user
router.post("/login", loginUser);
// This endpoint is used to get the user profile
router.get("/profile", getProfile);
// This endpoint is used to logout a user
router.post("/logout", logoutUser);

// --------------------


// SECTION ROUTES

// This endpoint is to get a single section by route name
router.get("/sections/:sectionRoute", authMiddleware, getSingleSection);
// This endpoint is used to get all sections
router.get("/sections", authMiddleware, getSections);
// This endpoint is to create a new section
router.post("/create-section", adminMiddleware, createSection);
// This endpoint is to delete a section
router.delete("/delete-section/:sectionId", adminMiddleware, deleteSection);
// This endpoint is to update a section
router.put("/update-section/:sectionId", adminMiddleware, updateSection);

// --------------------


// LEVEL ROUTES


// This endpoint is used to get levels for a section
router.get("/sections/:sectionRoute/levels", authMiddleware, getLevels);
// This endpoint is used to get a single level
router.get("/sections/:sectionRoute/levels/:levelRoute", authMiddleware, getSingleLevel);
// This endpoint is used to create a new level
router.post("/create-level", adminMiddleware, createLevel);
// This endpoint is used to delete a level
router.delete("/delete-level/:levelId", adminMiddleware, deleteLevel);
// This endpoint is used to update a level
router.put("/update-level/:levelId", adminMiddleware, updateLevel);

// --------------------

// PROGRESS ROUTES

// This endpoint is used to get the user's progress
router.get("/get-progress/:userId", authMiddleware, getUserProgress);

export default router;
