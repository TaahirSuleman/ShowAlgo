/**
 * Author(s): Yusuf Kathrada
 * Date: September 2024
 * Description: This file contains a helper function to test user code against test cases
 */

import JavaScriptGenerator from "../models/JavaScriptGenerator.js";
import Processor from "../models/Processor.js";

// Function to test user code against test cases
function testUserCode(userSPLCode, testCases) {
    const jsGenerator = new JavaScriptGenerator();
    const processor = new Processor(jsGenerator);
    console.log("userSPLCode:", userSPLCode);

    // Convert user SPL code to JavaScript
    const userJSCode = processor.process(userSPLCode);
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
                inputs,
                passed,
                actualOutput,
                expectedOutput,
            });
        } catch (error) {
            // If there's an error in execution, mark the test case as failed
            results.push({
                testCase: index + 1,
                inputs,
                passed: false,
                error: error.message,
            });
        }

        // Log the results of the test case
        console.log("Test Case", index + 1, results[index]);
    });

    // Determine the overall status
    let status;
    const allPassed = results.every((result) => result.passed);
    const allFailed = results.every((result) => !result.passed);

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
        test_results: results,
    };
}

export default testUserCode;
