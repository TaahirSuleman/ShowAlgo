import User from "../models/user.js";
import { hashPassword, comparePassword } from "../helpers/auth.js";
import jwt from "jsonwebtoken";

// export to be used in authRoutes.js
export const test = (req, res) => {
  res.json("test is working");
};

// Regsiter endpoint
export const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;
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
        { id: user._id, username: user.username },
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