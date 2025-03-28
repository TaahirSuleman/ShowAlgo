import JSGenerator from "../models/jsGenerator.js";

function testUserCode(userSPLCode, testCases) {
  console.log("userSPLCode:", userSPLCode);

  // Convert user SPL code to JavaScript
  const userJSCode = JSGenerator.convert(userSPLCode);
  console.log("userJSCode:", userJSCode);

  // Remove the first line of the code (e.g., 'use strict' or similar)
  const userJSCodeUpdated = userJSCode.split("\n").slice(1).join("\n");

  // Get the function name from the JS code
  const start = userJSCodeUpdated.indexOf(" ");
  const end = userJSCodeUpdated.indexOf("(");
  const functionName = userJSCodeUpdated.slice(start + 1, end);

  // Ensure the generated code defines and returns a function
  const wrappedUserJSCode = `
    ${userJSCode}
    return ${functionName};
  `;

  // Create a function that returns the user's function
  const userFunctionFactory = new Function(wrappedUserJSCode);

  // Get the actual user function
  const userFunction = userFunctionFactory();

  // Array to hold the results of each test case
  const results = [];

  // Execute the user function for each test case
  testCases.forEach((testCase, index) => {
    let inputs;
    try {
      inputs = testCase.inputs.map((input) => JSON.parse(input)); // Convert inputs from strings to appropriate types
    } catch (e) {
      inputs = testCase.inputs; // If parsing fails, use the raw string
    }

    let expectedOutput;
    try {
      expectedOutput = JSON.parse(testCase.output); // Attempt to parse expected output as JSON
    } catch (e) {
      expectedOutput = testCase.output; // If parsing fails, use the raw string
    }

    try {
      // Run the user function with the input
      const actualOutput = userFunction(...inputs);
      console.log("actualOutput:", actualOutput);

      // Compare the actual output with the expected output
      const passed = actualOutput === expectedOutput;
      results.push({
        testCase: index + 1,
        passed,
        actualOutput,
        expectedOutput,
      });
    } catch (error) {
      // If there's an error in execution, mark the test case as failed
      results.push({
        testCase: index + 1,
        passed: false,
        error: error.message,
      });
    }

    // Log the results of the test case
    console.log("Test Case", index + 1, results[index]);
  });

  // Determine the overall status
  let status;
  const allPassed = results.every(result => result.passed);
  const allFailed = results.every(result => !result.passed);

  if (allPassed) {
    status = "success";
  } else if (allFailed) {
    status = "error";
  } else {
    status = "warning";
  }

  // Return the results object
  return {
    status,
    test_results: results
  };
}

// // Example usage with dummy data matching your schema
// const exampleUserCode = `DEFINE addNumsWIth5 WITH PARAMETERS (a, b)
//     SET x to a + b
//     SET y to x + 5
//     RETURN y
// END FUNCTION
// `;

// const testCases = [
//   { inputs: ["1", "2"], output: "8" },
//   { inputs: ["5", "5"], output: "15" },
//   { inputs: ["-1", "1"], output: "0" },
// ];

// const testResults = testUserCode(exampleUserCode, testCases);

// console.log(testResults);

export default testUserCode;