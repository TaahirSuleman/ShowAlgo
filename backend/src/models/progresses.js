import mongoose from "mongoose";

// Define the schema for the progress model
const progressesSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    section_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
        required: true
    },
    level_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Level',
        required: true
    },
    completed: {
        type: Boolean,
        required: true
    },
    completion_date: {
        type: Date
    }
});

const ProgressesModel = mongoose.model("Progresses", progressesSchema);

export default ProgressesModel;
