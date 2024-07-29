import User from "../models/user.js";
import Progresses from "../models/progresses.js";
import Sections from "../models/section.js";
import Levels from "../models/level.js";
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
      return res.json({ error: "Username is required and should be at least 6 characters long" });
    }
    const usernameExist = await User.findOne({ username })
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

// Endpoint to create a new level (admin only) //! check the level schema
export const createLevel = async (req, res) => {
  try {
    const { title, order, question, test_cases, hints, difficulty } = req.body;
    const level = await Levels.create({
      title,
      order,
      question,
      test_cases,
      hints,
      difficulty
    });
    res.json(level);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Endpoint to get user progress
export const getUserProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const progress = await Progresses.find({ user_id: userId }).populate('section_id level_id');
    res.json(progress);
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
}

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
}

// Route to create a new section
export const createSection = async (req, res) => {
  try {
    const { heading, route, subheading } = req.body;
    // check that the heading is unique
    const existingSection = await Sections.findOne({ heading });
    if (existingSection) {
      return res.json({ error: "Module with the same heading already exists"});
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
}

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
}

// Route to update a section
export const updateSection = async (req, res) => {
  try {
    console.log(req.body);
    const { sectionId } = req.params;
    const { heading, subheading, route } = req.body;
    const section = await Sections.findByIdAndUpdate(sectionId, { heading, subheading, route }, { upsert: false });
    res.json(section);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Route to get levels for a section
export const getLevels = async (req, res) => {
  try {
    console.log(req.params);
    const { sectionRoute } = req.params;
    const section = await Sections.findOne({ route: sectionRoute });
    const levels = await Levels.find({ section_id: section._id });
    console.log(section);
    res.json(levels);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Route to get a level by route
export const getSingleLevel = async (req, res) => {
  try {
    const { sectionRoute, levelRoute } = req.params;
    const section = await Sections.findOne({ route: sectionRoute });
    const level = await Levels.findOne({ route: levelRoute, section_id: section._id });
    res.json(level);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}


// Route to update progress
export const updateProgress = async (req, res) => {
  try {
    const { userId, sectionId, levelId, completed } = req.body;
    const progress = await Progress.findOneAndUpdate(
      { user_id: userId, section_id: sectionId, level_id: levelId },
      { completed, completion_date: completed ? new Date() : null },
      { new: true, upsert: true }
    );
    res.json(progress);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}