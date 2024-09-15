/**
 * Author(s): Yusuf Kathrada
 * Date: September 2024
 * Description: This file contains the model for documentation used in the database
 */

import mongoose from "mongoose";

// Define the schema for the level model
const documentationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});

const DocumentationModel = mongoose.model("Documentation", documentationSchema);

export default DocumentationModel;