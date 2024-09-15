/**
 * Author(s): Yusuf Kathrada
 * Date: September 2024
 * Description: This file contains the model for level progress used in the database
 */

import mongoose from 'mongoose';

// Define the schema for level progress
const levelProgressSchema = new mongoose.Schema({
    level_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Level',
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    }
});

export default levelProgressSchema;

const LevelProgressModel = mongoose.model('LevelProgress', levelProgressSchema);

export { LevelProgressModel };