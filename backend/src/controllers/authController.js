import User from "../models/user.js";
import Sections from "../models/section.js";
import Levels from "../models/level.js";
import UserProgress from "../models/userProgress.js";
import { hashPassword, comparePassword } from "../helpers/auth.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// export to be used in authRoutes.js
export const test = (req, res) => {
  res.json("test is working");
};

// Regsiter endpoint
export const registerUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    // check if name is entered and length greater than 6 characters
    if (!username || username.length < 6) {
      return res.json({
        error: "Username is required and should be at least 6 characters long",
      });
    }
    const usernameExist = await User.findOne({ username });
    if (usernameExist) {
      return res.json({ error: "Username is already taken" });
    }
    // check if password is entered and length greater than 6 characters
    if (!password || password.length < 6) {
      return res.json({
        error: "Password is required and should be at least 6 characters long",
      });
    }

    const hashedPassword = await hashPassword(password);

    // create a new user
    const user = await User.create({
      username,
      password: hashedPassword,
      role,
    });

    // USER PROGRESS CREATION

    // Fetch all sections and levels
    const sections = await Sections.find().populate("levels");

    // Create section progress for each section
    const sectionProgresses = sections.map((section) => ({
      section_id: section._id,
      levels: section.levels.map((level) => ({
        level_id: level._id,
        completed: false,
        difficulty: level.difficulty,
      })),
    }));

    // Create user progress document
    const userProgress = await UserProgress.create({
      user_id: user._id,
      sections: sectionProgresses,
    });

    return res.json(user);
  } catch (error) {
    console.log(error);
  }
};

// Login endpoint
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    // check if username is entered
    if (!username) {
      return res.json({ error: "Username is required" });
    }
    // check if password is entered
    if (!password) {
      return res.json({ error: "Password is required" });
    }

    // check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ error: "No user found with the entered username" });
    }

    // compare password
    const match = await comparePassword(password, user.password);
    if (match) {
      // create a token
      jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json(user);
        }
      );
    } else {
      return res.json({ error: "Incorrect password" });
    }

    // Check and update streak
    const now = new Date();
    const lastLogin = user.lastLogin ? new Date(user.lastLogin) : null;

    if (lastLogin) {
      // Calculate difference in days
      const lastLoginDay = new Date(
        lastLogin.getFullYear(),
        lastLogin.getMonth(),
        lastLogin.getDate()
      );
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const diffTime = Math.abs(today - lastLoginDay);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        user.dailyStreak += 1;
      } else if (diffDays > 1) {
        user.dailyStreak = 1;
      }
    } else {
      user.dailyStreak = 1;
    }

    user.lastLogin = now;
    await user.save();
  } catch (error) {
    console.log(error);
  }
};

// Get profile endpoint
export const getProfile = (req, res) => {
  // get the token from the cookie
  const { token } = req.cookies;
  if (token) {
    // verify the token
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
      if (err) throw err;
      // return the user
      res.json(user);
    });
  } else {
    res.json(null);
  }
};

// Logout endpoint
export const logoutUser = (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie("token").json({ message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
    res.json({ error: "Failed to log out" });
  }
};

// Endpoint to create a new level (admin only)
export const createLevel = async (req, res) => {
  try {
    const {
      title,
      question,
      test_cases,
      hints,
      difficulty,
      route,
      examples,
      solution,
      order,
      section_id,
    } = req.body;
    const level = await Levels.create({
      title,
      question,
      test_cases,
      hints,
      difficulty,
      route,
      solution,
      order,
      section_id,
      examples,
    });

    // Update the section to include the new level's ID
    await Sections.findByIdAndUpdate(level.section_id, {
      $push: { levels: level._id },
    });

    res.json(level);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Endpoint to update a level (admin only)
export const updateLevel = async (req, res) => {
  try {
    const { levelId } = req.params;
    const {
      title,
      question,
      test_cases,
      hints,
      difficulty,
      route,
      examples,
      solution,
      order,
    } = req.body;
    const level = await Levels.findByIdAndUpdate(
      levelId,
      {
        title,
        question,
        test_cases,
        hints,
        difficulty,
        route,
        examples,
        solution,
        order,
      },
      { upsert: false }
    );
    res.json(level);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Endpoint to delete a level (admin only)
export const deleteLevel = async (req, res) => {
  try {
    const { levelId } = req.params;
    const level = await Levels.findByIdAndDelete(levelId);
    // Remove the level from the section
    await Sections.findByIdAndUpdate(level.section_id, {
      $pull: { levels: levelId },
    });
    res.json(level);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Endpoint to get all sections
export const getSections = async (req, res) => {
  try {
    const sections = await Sections.find();
    res.json(sections);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Route to get a section by id
export const getSingleSection = async (req, res) => {
  try {
    const { sectionRoute } = req.params;
    const section = await Sections.findOne({ route: sectionRoute });
    res.json(section);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Route to create a new section
export const createSection = async (req, res) => {
  try {
    const { heading, route, subheading } = req.body;
    // check that the heading is unique
    const existingSection = await Sections.findOne({ heading });
    if (existingSection) {
      return res.json({ error: "Module with the same heading already exists" });
    }

    const section = await Sections.create({
      heading,
      subheading,
      route,
      levels: [],
    });
    res.json(section);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Route to delete a section
export const deleteSection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const section = await Sections.findByIdAndDelete(sectionId);
    res.json(section);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Route to update a section
export const updateSection = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const { heading, subheading, route } = req.body;
    const section = await Sections.findByIdAndUpdate(
      sectionId,
      { heading, subheading, route },
      { upsert: false }
    );
    res.json(section);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Route to get levels for a section
export const getLevels = async (req, res) => {
  try {
    const { sectionRoute } = req.params;
    const section = await Sections.findOne({ route: sectionRoute });
    const sectionId = new mongoose.Types.ObjectId(section._id);
    const levels = await Levels.find({ section_id: sectionId });
    res.json(levels);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Route to get a level by route
export const getSingleLevel = async (req, res) => {
  try {
    const { sectionRoute, levelRoute } = req.params;
    const section = await Sections.findOne({ route: sectionRoute });
    const level = await Levels.findOne({
      route: levelRoute,
      section_id: section._id,
    });
    res.json(level);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Route to get user progress
export const getUserProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    // convert the userId to an ObjectId
    const userProgress = await UserProgress.findOne({
      user_id: userId,
    });
    res.json(userProgress);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Route to get the user's daily streak
export const getDailyStreak = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    res.json(user.dailyStreak);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
