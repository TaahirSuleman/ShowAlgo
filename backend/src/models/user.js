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