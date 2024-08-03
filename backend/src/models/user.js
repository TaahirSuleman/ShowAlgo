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
})

const UserModel = mongoose.model("User", userSchema);

export default UserModel;