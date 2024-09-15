/**
 * Author(s): Yusuf Kathrada
 * Date: September 2024
 * Description: This file contains the model for user progress used in the database
 */

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
});

const UserProgressModel = mongoose.model("UserProgress", userProgressSchema);

export default UserProgressModel;
