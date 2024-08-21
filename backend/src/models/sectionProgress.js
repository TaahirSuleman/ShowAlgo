import mongoose from 'mongoose';
import levelProgressSchema from './levelProgress.js';

// Define the schema for section progress
const sectionProgressSchema = new mongoose.Schema({
    section_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
        required: true
    },
    levels: [levelProgressSchema] // Array of level progress
});

export default sectionProgressSchema;

const SectionProgressModel = mongoose.model('SectionProgress', sectionProgressSchema);

export { SectionProgressModel };