import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Section from './models/section.js';
import Level from './models/level.js';

dotenv.config();

// Connect to MongoDB
mongoose
  .connect('mongodb+srv://yusufkathrada:Yusuf071102@cluster0.hukfegr.mongodb.net/')
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.log(err));

// Predefined sections and levels
const sections = [
  {
    heading: "Introduction",
    subheading: "Basic introduction to algorithms",
    levels: [
      {
        title: "Level 1",
        order: 1,
        question: "What is the output of 1 + 1?",
        test_cases: [
          { input: "1", output: "2" },
          { input: "2", output: "4" }
        ],
        hints: ["Think about basic addition.", "Consider edge cases."],
        difficulty: "easy",
      },
      {
        title: "Level 2",
        order: 2,
        question: "What is the output of 2 + 2?",
        test_cases: [
          { input: "2", output: "4" },
          { input: "3", output: "6" }
        ],
        hints: ["Think about basic addition.", "Consider edge cases."],
        difficulty: "easy",
      }
    ]
  },

  {
    heading: "Variables",
    subheading: "Let's look at variables",
    levels: [
      {
        title: "Level 1",
        order: 1,
        question: "What is the output of 1 + 1?",
        test_cases: [
          { input: "1", output: "2" },
          { input: "2", output: "4" }
        ],
        hints: ["Think about basic addition.", "Consider edge cases."],
        difficulty: "easy",
      },
      {
        title: "Level 2",
        order: 2,
        question: "What is the output of 2 + 2?",
        test_cases: [
          { input: "2", output: "4" },
          { input: "3", output: "6" }
        ],
        hints: ["Think about basic addition.", "Consider edge cases."],
        difficulty: "easy",
      },
      {
        title: "Level 3",
        order: 3,
        question: "What is the output of 2 + 2?",
        test_cases: [
          { input: "2", output: "4" },
          { input: "3", output: "6" }
        ],
        hints: ["Think about basic addition.", "Consider edge cases."],
        difficulty: "easy",
      },
      {
        title: "Level 4",
        order: 4,
        question: "What is the output of 2 + 2?",
        test_cases: [
          { input: "2", output: "4" },
          { input: "3", output: "6" }
        ],
        hints: ["Think about basic addition.", "Consider edge cases."],
        difficulty: "easy",
      }
    ]
  },

  {
    heading: "Control Structures",
    subheading: "Let's look at control structures",
    levels: [
      {
        title: "Level 1",
        order: 1,
        question: "What is the output of 1 + 1?",
        test_cases: [
          { input: "1", output: "2" },
          { input: "2", output: "4" }
        ],
        hints: ["Think about basic addition.", "Consider edge cases."],
        difficulty: "easy",
      },
      {
        title: "Level 2",
        order: 2,
        question: "What is the output of 2 + 2?",
        test_cases: [
          { input: "2", output: "4" },
          { input: "3", output: "6" }
        ],
        hints: ["Think about basic addition.", "Consider edge cases."],
        difficulty: "easy",
      },
      {
        title: "Level 3",
        order: 3,
        question: "What is the output of 2 + 2?",
        test_cases: [
          { input: "2", output: "4" },
          { input: "3", output: "6" }
        ],
        hints: ["Think about basic addition.", "Consider edge cases."],
        difficulty: "easy",
      }
    ]
  }
];

const seedDatabase = async () => {
  try {
    // Clear existing data if there is any
    await Section.deleteMany({});
    await Level.deleteMany({});
    console.log('Cleared existing data');

    // Insert sections and levels
    for (const sectionData of sections) {
      const section = new Section({
        heading: sectionData.heading,
        subheading: sectionData.subheading,
      });

      for (const levelData of sectionData.levels) {
        const level = new Level({
          section_id: section._id,
          title: levelData.title,
          order: levelData.order,
          question: levelData.question,
          test_cases: levelData.test_cases,
          hints: levelData.hints,
          difficulty: levelData.difficulty,
        });
        await level.save();
        section.levels.push(level._id);
      }

      await section.save();
    }

    console.log('Database seeded successfully');
    mongoose.disconnect();
  } catch (error) {
    console.log('Error seeding database:', error);
    mongoose.disconnect();
  }
};

seedDatabase();
