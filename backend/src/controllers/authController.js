import User from "../models/user.js";


// export to be used in authRoutes.js
export const test = (req, res) => {
  res.json("test is working");
};

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
      return res
        .json({
          error:
            "Password is required and should be at least 6 characters long",
        });
    }
    // check if email is entered
    const exist = await User.findOne({email})
    if (exist) {
      return res.json({ error: "An account with that email already exists" });
    }

    // create a new user
    // TODO: need to hash password
    const user = await User.create({
      username,
      email,
      password,
    });

    return res.json(user)

  } catch (error) {
    console.log(error);
  }
};
