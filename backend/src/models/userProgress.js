import mongoose from "mongoose";
import sectionProgressSchema from "./sectionProgress.js";

// Define the schema for the user progress model
const userProgressSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sections: [sectionProgressSchema], // Array of section progress
    // totalPoints: {
    //     type: Number,
    //     default: 0
    // },
    // totalLevelsCompleted: {
    //     type: Number,
    //     default: 0
    // },
    // totalSectionsCompleted: {
    //     type: Number,
    //     default: 0
    // }
});

const UserProgressModel = mongoose.model("UserProgress", userProgressSchema);

export default UserProgressModel;
