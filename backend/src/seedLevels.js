import mongoose from "mongoose";
import dotenv from "dotenv";
import Section from "./models/section.js";
import Level from "./models/level.js";

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://yusufkathrada:Yusuf071102@cluster0.hukfegr.mongodb.net/"
  )
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.log(err));

// Predefined sections and levels
const sections = [
  {
    heading: "Introduction",
    subheading: "Basic introduction to programming",
    route: "introduction",
    levels: [
      {
        title: "Hello World!",
        route: "hello-world",
        order: 1,
        question:
          "Create a program that outputs the classic 'Hello, World!' message to the console. Every programer has to start somewhere, right?",
        test_cases: [{ input: "", output: "Hello, World!" }],
        hints: ["Use the PRINT statement to output the message."],
        difficulty: "easy",
        examples: [`output: "Hello, World!"`],
        solution: `PRINT "Hello, World!"`,
      },

      {
        title: "Basic Variable Assignment",
        route: "basic-variable-assignment",
        order: 2,
        question:
          "Assign the number 10 to a variable named 'x' and then output the value of 'x'.",
        test_cases: [{ input: "", output: "10" }],
        hints: [
          "Use the SET statement to assign the variable and Print to output it.",
        ],
        difficulty: "easy",
        route: "basic-variable-assignment",
        examples: [`output: 10`],
        solution: `SET x to number 10\nPRINT x`,
      },

      {
        title: "Simple Addition",
        route: "simple-addition",
        order: 3,
        question:
          "Create a program that that consists of three variables 'x', 'y' and 'sum'. Assign the values 5 and 10 to 'x' and 'y' respectively. Calculate the sum of 'x' and 'y' and store it in the variable 'sum'. Finally, output the value of 'sum'.",
        test_cases: [{ input: "", output: "15" }],
        hints: [
          "Use the '+' opertaor to add to numbers.",
          "Use the SET statement to assign the variables and PRINT to output.",
        ],
        difficulty: "easy",
        examples: [`input: "5 10", output: 15`],
        solution: `INPUT a b\nSET c to a + b\nPRINT c`,
      },
    ],
  },

  {
    heading: "Selection",
    subheading: "The first half of control structures",
    route: "selection",
    levels: [
      {
        title: "Simple If Statement",
        route: "simple-if-statement",
        order: 1,
        question:
          "Create a program that takes an integer input and outputs 'positive' if the number is greater than 0, 'negative' if the number is less than 0 and 'zero' if the number is equal to 0.",
        test_cases: [
          { input: "5", output: "positive" },
          { input: "-5", output: "negative" },
          { input: "0", output: "zero" },
        ],
        hints: [
          "Use the IF statement to check the condition and PRINT to output the result.",
        ],
        difficulty: "easy",
        examples: [`input: 5, output: "positive"`],
        solution: `INPUT a\nIF a > 0 THEN\n    PRINT "positive"\nELSE IF a < 0 THEN\n    PRINT "negative"\nELSE\n    PRINT "zero"\nEND IF`,
      },

      {
        title: "Simple If-Else Statement",
        route: "simple-if-else-statement",
        order: 2,
        question:
          "Create a program that takes an integer input and outputs 'even' if the number is even and 'odd' if the number is odd.",
        test_cases: [
          { input: "5", output: "odd" },
          { input: "10", output: "even" },
        ],
        hints: [
          "Use the IF-ELSE statement to check the condition and PRINT to output the result.",
        ],
        difficulty: "easy",
        examples: [`input: 5, output: "odd"`],
        solution: `INPUT a\nIF a MOD 2 = 0 THEN\n    PRINT "even"\nELSE\n    PRINT "odd"\nEND IF`,
      },

      {
        title: "Simple Nested If-Else Statement",
        route: "simple-nested-if-else-statement",
        order: 3,
        question:
          "Create a program that takes an integer input and outputs 'positive even', 'positive odd', 'negative even' or 'negative odd' based on the input.",
        test_cases: [
          { input: "5", output: "positive odd" },
          { input: "10", output: "positive even" },
          { input: "-5", output: "negative odd" },
          { input: "-10", output: "negative even" },
        ],
        hints: [
          "Use nested IF-ELSE statements to check the conditions and PRINT to output the result.",
        ],
        difficulty: "easy",
        examples: [`input: 5, output: "positive odd"`],
        solution: `INPUT a\nIF a > 0 THEN\n    IF a MOD 2 = 0 THEN\n        PRINT "positive even"\n    ELSE\n        PRINT "positive odd"\n    END IF\nELSE\n    IF a MOD 2 = 0 THEN\n        PRINT "negative even"\n    ELSE\n        PRINT "negative odd"\n    END IF\nEND IF`,
      },

      {
        title: "If Statement",
        route: "if-statement",
        order: 4,
        question:
          "Create a program that checks if a variable x is greater than 10 and displays 'x is greater than 10' if true.",
        test_cases: [{ input: "", output: "x is greater than 10" }],
        hints: [
          "Use the IF statement to check the condition.",
          "Make sure to use DISPLAY to print the output.",
        ],
        difficulty: "easy",
        route: "simple-if-statement",
        examples: [
          `SET x to number 15`,
          `IF x is greater than 10 THEN`,
          `    DISPLAY "x is greater than 10"`,
          `END IF`,
        ],
        solution: `SET x to number 15\nIF x is greater than 10 THEN\n    DISPLAY "x is greater than 10"\nEND IF`,
      },

      {
        title: "If-Else Statement",
        route: "if-else-statement",
        order: 5,
        question:
          "Create a program that checks if a variable y is equal to 5. If true, it should display 'y is 5', otherwise it should display 'y is not 5'.",
        test_cases: [{ input: "", output: "y is not 5" }],
        hints: ["Use IF-ELSE to handle both cases."],
        difficulty: "easy",
        route: "if-else-statement",
        examples: [
          `SET y to number 3`,
          `IF y is equal to 5 THEN`,
          `    DISPLAY "y is 5"`,
          `OTHERWISE`,
          `    DISPLAY "y is not 5"`,
          `END IF`,
        ],
        solution: `SET y to number 3\nIF y is equal to 5 THEN\n    DISPLAY "y is 5"\nOTHERWISE\n    DISPLAY "y is not 5"\nEND IF`,
      },

      {
        title: "Nested If Statements",
        route: "nested-if-statements",
        order: 6,
        question:
          "Create a program that checks if a variable z is positive. If true, check if it is less than 10 and display 'z is positive and less than 10'.",
        test_cases: [{ input: "", output: "z is positive and less than 10" }],
        hints: ["Use nested IF statements to handle multiple conditions."],
        difficulty: "medium",
        route: "nested-if-statements",
        examples: [
          `SET z to number 7`,
          `IF z is greater than 0 THEN`,
          `    IF z is less than 10 THEN`,
          `        DISPLAY "z is positive and less than 10"`,
          `    END IF`,
          `END IF`,
        ],
        solution: `SET z to number 7\nIF z is greater than 0 THEN\n    IF z is less than 10 THEN\n        DISPLAY "z is positive and less than 10"\n    END IF\nEND IF`,
      },

      {
        title: "Boolean Expressions",
        route: "boolean-expressions",
        order: 7,
        question:
          "Create a program that checks if a variable a is either greater than 10 or less than 5. If true, display 'a meets the condition'.",
        test_cases: [{ input: "", output: "a meets the condition" }],
        hints: ["Use logical operators like OR to combine conditions."],
        difficulty: "medium",
        route: "boolean-expressions",
        examples: [
          `SET a to number 3`,
          `IF a is greater than 10 OR a is less than 5 THEN`,
          `    DISPLAY "a meets the condition"`,
          `END IF`,
        ],
        solution: `SET a to number 3\nIF a is greater than 10 OR a is less than 5 THEN\n    DISPLAY "a meets the condition"\nEND IF`,
      },

      {
        title: "Recap Level: Selection Concepts",
        route: "recap-selection-concepts",
        order: 8,
        question:
          "Create a program that checks if a variable 'b' is a positive even number. If true, display 'b is a positive even number'.",
        test_cases: [{ input: "", output: "b is a positive even number" }],
        hints: [
          "Combine all the concepts learned: if statements, boolean expressions, and nested conditions.",
        ],
        difficulty: "hard",
        route: "recap-selection-concepts",
        examples: [
          `SET b to number 8`,
          `IF b is greater than 0 THEN`,
          `    IF b MOD 2 is equal to 0 THEN`,
          `        DISPLAY "b is a positive even number"`,
          `    END IF`,
          `END IF`,
        ],
        solution: `SET b to number 8\nIF b is greater than 0 THEN\n    IF b MOD 2 is equal to 0 THEN\n        DISPLAY "b is a positive even number"\n    END IF\nEND IF`,
      },
    ],
  },

  {
    heading: "Iteration",
    subheading: "The second half of control structures",
    route: "iteration",
    levels: [
      {
        title: "Simple For Loop",
        route: "simple-for-loop",
        order: 1,
        question:
          "Create a program that uses a for loop to display numbers from 1 to 5, each on a new line.",
        test_cases: [{ input: "", output: "1\n2\n3\n4\n5" }],
        hints: [
          "Use a LOOP from statement to iterate over a range of numbers.",
          "Make sure to use PRINT to print each number.",
        ],
        difficulty: "easy",
        route: "simple-for-loop",
        examples: [`LOOP from 1 up to 5`, `    PRINT i`, `END LOOP`],
        solution: `LOOP from 1 up to 5\n    PRINT i\nEND LOOP`,
      },

      {
        title: "Nested For Loops",
        route: "nested-for-loops",
        order: 2,
        question:
          "Create a program that uses nested for loops to display a 3x3 grid of numbers.",
        test_cases: [{ input: "", output: "1 2 3\n4 5 6\n7 8 9" }],
        hints: [
          "Use nested LOOP from statements.",
          "The inner loop will iterate over columns and the outer loop over rows.",
        ],
        difficulty: "medium",
        route: "nested-for-loops",
        examples: [
          `SET counter to 1`,
          `LOOP from 1 up to 3`,
          `    LOOP from 1 up to 3`,
          `        DISPLAY counter + " "`,
          `        SET counter to counter + 1`,
          `    END LOOP`,
          `    DISPLAY ""`,
          `END LOOP`,
        ],
        solution: `SET counter to 1\nLOOP from 1 up to 3\n    LOOP from 1 up to 3\n        DISPLAY counter + " "\n        SET counter to counter + 1\n    END LOOP\n    DISPLAY ""\nEND LOOP`,
      },

      {
        title: "Simple While Loop",
        route: "simple-while-loop",
        order: 3,
        question:
          "Create a program that uses a while loop to display numbers from 5 down to 1.",
        test_cases: [{ input: "", output: "5\n4\n3\n2\n1" }],
        hints: [
          "Use a LOOP until statement to create a while loop.",
          "Decrement the loop variable inside the loop.",
        ],
        difficulty: "medium",
        route: "simple-while-loop",
        examples: [
          `SET x to 5`,
          `LOOP until x is less than 1`,
          `    DISPLAY x`,
          `    SET x to x minus 1`,
          `END LOOP`,
        ],
        solution: `SET x to 5\nLOOP until x is less than 1\n    DISPLAY x\n    SET x to x minus 1\nEND LOOP`,
      },

      {
        title: "Sum of First N Numbers",
        route: "sum-first-n-numbers",
        order: 4,
        question:
          "Create a program that calculates the sum of the first 10 numbers using a loop and displays the result.",
        test_cases: [{ input: "", output: "The sum is 55" }],
        hints: [
          "Use a LOOP from statement to iterate and sum the numbers.",
          "Initialize a sum variable before the loop.",
        ],
        difficulty: "hard",
        route: "sum-first-n-numbers",
        examples: [
          `SET sum to 0`,
          `LOOP from 1 up to 10`,
          `    SET sum to sum + i`,
          `END LOOP`,
          `DISPLAY "The sum is " + sum`,
        ],
        solution: `SET sum to 0\nLOOP from 1 up to 10\n    SET sum to sum + i\nEND LOOP\nDISPLAY "The sum is " + sum`,
      },
    ],
  },
];

const seedDatabase = async () => {
  try {
    // Clear existing data if there is any
    await Section.deleteMany({});
    await Level.deleteMany({});
    console.log("Cleared existing data");

    // Insert sections and levels
    for (const sectionData of sections) {
      const section = new Section({
        heading: sectionData.heading,
        subheading: sectionData.subheading,
        route: sectionData.route,
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
          route: levelData.route,
          examples: levelData.examples,
          solution: levelData.solution,
        });
        await level.save();
        section.levels.push(level._id);
      }

      await section.save();
    }

    console.log("Database seeded successfully");
    mongoose.disconnect();
  } catch (error) {
    console.log("Error seeding database:", error);
    mongoose.disconnect();
  }
};

seedDatabase();
