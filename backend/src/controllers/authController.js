import User from "../models/user.js";
import { hashPassword, comparePassword } from "../helpers/auth.js";

// export to be used in authRoutes.js
export const test = (req, res) => {
  res.json("test is working");
};

// Regsiter endpoint
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // check if name is entered
    // TODO: check if username is already taken
    // !: do we want to use just username and password for registration?
    if (!username) {
      return res.json({ error: "Username is required" });
    }
    // check if email is entered and length greater than 6 characters
    if (!password || password.length < 6) {
      return res.json({
        error: "Password is required and should be at least 6 characters long",
      });
    }
    // check if email is entered
    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({ error: "An account with that email already exists" });
    }

    const hashedPassword = await hashPassword(password);

    // create a new user
    const user = await User.create({
      username,
      email,
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
    const { email, password } = req.body;
    // check if email is entered
    if (!email) {
      return res.json({ error: "Email is required" });
    }
    // check if password is entered
    if (!password) {
      return res.json({ error: "Password is required" });
    }

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ error: "No user found with the entered email" });
    }

    // compare password
    const match = await comparePassword(password, user.password);
    if (match) {
      return res.json({ message: "Login successful"});
    } else {
      return res.json({ error: "Invalid password" });
    }

    return res.json(user);
  } catch (error) {
    console.log(error);
  }
}
