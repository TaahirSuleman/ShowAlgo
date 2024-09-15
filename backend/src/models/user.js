/**
 * Author(s): Yusuf Kathrada
 * Date: September 2024
 * Description: This file contains the model for the user, used in the database
 */

import mongoose from "mongoose";

// Define the schema for the user model
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"],
    },
    lastLogin: {
        type: Date,
        default: null,
    },
    dailyStreak: {
        type: Number,
        default: 0,
    },
})

const UserModel = mongoose.model("User", userSchema);

export default UserModel;