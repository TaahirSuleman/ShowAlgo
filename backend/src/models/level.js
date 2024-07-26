import mongoose from "mongoose";

// Define the schema for the level model
const levelSchema = new mongoose.Schema({
    section_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    test_cases: [{
        input: String,
        output: String
    }],
    hints: [String],
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    },
    route: {
        type: String,
        required: true
    },
    examples: {
        type: [String],
        required: true,
    },
    solution: {
        type: String,
        required: true
    }
});

const LevelModel = mongoose.model("Level", levelSchema);

export default LevelModel;
