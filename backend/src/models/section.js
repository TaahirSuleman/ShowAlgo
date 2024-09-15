/**
 * Author(s): Yusuf Kathrada
 * Date: September 2024
 * Description: This file contains the model for the section (also referred to as modules) used in the database
 */

import mongoose from "mongoose";

// Define the schema for the section model
const sectionSchema = new mongoose.Schema({
    heading: {
        type: String,
        required: true
    },
    subheading: {
        type: String,
        required: true
    },
    levels: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Level'
    }],
    route: {
        type: String,
        required: true
    }
});

const SectionModel = mongoose.model("Section", sectionSchema);

export default SectionModel;
