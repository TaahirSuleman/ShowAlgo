import { expect } from "chai";
import PseudocodeProcessor from "../src/models/PseudocodeProcessor.js";
import Processor from "../src/models/Processor.js";
import JsonConverter from "../src/models/JsonConverter.js";

import fs from "fs";

function writeTestNumber(testNumber) {
    fs.appendFileSync("output.txt", `Test case ${testNumber}\n\n`);
}

describe("PseudocodeProcessor", () => {
    it("should process arithmetic with modulus operation", () => {
        const pseudocode = `SET a to 10
        SET b to 3
        SET c to a % b`;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "a",
                    type: "number",
                    value: 10,
                    timestamp: undefined,
                    description: "Set variable a to 10.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "b",
                    type: "number",
                    value: 3,
                    timestamp: undefined,
                    description: "Set variable b to 3.",
                },
                {
                    line: 3,
                    operation: "set",
                    varName: "c",
                    type: "number",
                    value: 1,
                    timestamp: undefined,
                    description: "Set variable c to a % b.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should process arithmetic with negative numbers", () => {
        const pseudocode = `SET a to number -5
        SET b to a + 10
        SET c to b * -2`;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "a",
                    type: "number",
                    value: -5,
                    timestamp: undefined,
                    description: "Set variable a to -5.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "b",
                    type: "number",
                    value: 5,
                    timestamp: undefined,
                    description: "Set variable b to a + 10.",
                },
                {
                    line: 3,
                    operation: "set",
                    varName: "c",
                    type: "number",
                    value: -10,
                    timestamp: undefined,
                    description: "Set variable c to b * -2.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should correctly ignore lines with comments", () => {
        const pseudocode = `// This is a comment
            SET result TO 5 + 10
            // Another comment here
            SET total TO result + 20
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 2,
                    operation: "set",
                    varName: "result",
                    type: "number",
                    value: 15,
                    timestamp: undefined,
                    description: "Set variable result to 5 + 10.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "total",
                    type: "number",
                    value: 35,
                    timestamp: undefined,
                    description: "Set variable total to result + 20.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);
        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });
        expect(result).to.deep.equal(expectedJson);
    });

    it("should correctly process a bubble sort algorithm with variable assignments for nested operations and no break", () => {
        const pseudocode = `CREATE number array AS myArray WITH VALUES [50, 40, 30, 20, 10]
            SET swapped TO true
            LOOP i FROM 0 TO LENGTH OF myArray - 1
                SET swapped TO false
                LOOP j FROM 0 TO LENGTH OF myArray - i - 2
                    SET current TO myArray[j]
                    SET next TO myArray[j + 1]
                    IF current > next then
                        SWAP position j WITH position j + 1 IN myArray
                        SET swapped TO true
                    END IF
                END LOOP
                IF NOT swapped THEN
                    SET i TO LENGTH OF myArray - 1
                END IF
            END LOOP
            PRINT myArray
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "create",
                    dataStructure: "array",
                    type: "number",
                    varName: "myArray",
                    value: [50, 40, 30, 20, 10],
                    timestamp: undefined,
                    description:
                        "Created array myArray with values [50,40,30,20,10].",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "swapped",
                    type: "boolean",
                    value: true,
                    timestamp: undefined,
                    description: "Set variable swapped to true.",
                },
                {
                    line: 3,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 0,
                    timestamp: undefined,
                    description: "Set variable i to 0.",
                },
                {
                    line: 3,
                    operation: "loop_from_to",
                    condition: "i <= 4",
                    timestamp: undefined,
                    description: "loop from_to loop with condition i <= 4.",
                },
                {
                    line: 3,
                    operation: "if",
                    condition: "i <= 4",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if i <= 4.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "swapped",
                    type: "boolean",
                    value: false,
                    timestamp: undefined,
                    description: "Set variable swapped to false.",
                },
                {
                    line: 5,
                    operation: "set",
                    varName: "j",
                    type: "number",
                    value: 0,
                    timestamp: undefined,
                    description: "Set variable j to 0.",
                },
                {
                    line: 5,
                    operation: "loop_from_to",
                    condition: "j <= 3",
                    timestamp: undefined,
                    description: "loop from_to loop with condition j <= 3.",
                },
                {
                    line: 5,
                    operation: "if",
                    condition: "j <= 3",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if j <= 3.",
                },
                {
                    line: 6,
                    operation: "set",
                    varName: "current",
                    type: "number",
                    value: {
                        operation: "get",
                        type: "array",
                        varName: "myArray",
                        index: 0,
                        result: 50,
                    },
                    timestamp: undefined,
                    description: "Set variable current to myArray[0].",
                },
                {
                    line: 7,
                    operation: "set",
                    varName: "next",
                    type: "number",
                    value: {
                        operation: "get",
                        type: "array",
                        varName: "myArray",
                        index: 1,
                        result: 40,
                    },
                    timestamp: undefined,
                    description: "Set variable next to myArray[1].",
                },
                {
                    line: 8,
                    operation: "if",
                    condition: "current > next",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if current > next.",
                },
                {
                    line: 9,
                    operation: "swap",
                    dataStructure: "array",
                    firstPosition: 0,
                    secondPosition: 1,
                    varName: "myArray",
                    description:
                        "Swapped values in position 0 and 1 in array myArray.",
                    timestamp: undefined,
                },
                {
                    line: 10,
                    operation: "set",
                    varName: "swapped",
                    type: "boolean",
                    value: true,
                    timestamp: undefined,
                    description: "Set variable swapped to true.",
                },
                {
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                    description: "End of if statement.",
                },
                {
                    line: 5,
                    operation: "set",
                    varName: "j",
                    type: "number",
                    value: 1,
                    timestamp: undefined,
                    description: "Set variable j to 1.",
                },
                {
                    line: 5,
                    operation: "if",
                    condition: "j <= 3",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if j <= 3.",
                },
                {
                    line: 6,
                    operation: "set",
                    varName: "current",
                    type: "number",
                    value: {
                        operation: "get",
                        type: "array",
                        varName: "myArray",
                        index: 1,
                        result: 50,
                    },
                    timestamp: undefined,
                    description: "Set variable current to myArray[1].",
                },
                {
                    line: 7,
                    operation: "set",
                    varName: "next",
                    type: "number",
                    value: {
                        operation: "get",
                        type: "array",
                        varName: "myArray",
                        index: 2,
                        result: 30,
                    },
                    timestamp: undefined,
                    description: "Set variable next to myArray[2].",
                },
                {
                    line: 8,
                    operation: "if",
                    condition: "current > next",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if current > next.",
                },
                {
                    line: 9,
                    operation: "swap",
                    dataStructure: "array",
                    firstPosition: 1,
                    secondPosition: 2,
                    varName: "myArray",
                    description:
                        "Swapped values in position 1 and 2 in array myArray.",
                    timestamp: undefined,
                },
                {
                    line: 10,
                    operation: "set",
                    varName: "swapped",
                    type: "boolean",
                    value: true,
                    timestamp: undefined,
                    description: "Set variable swapped to true.",
                },
                {
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                    description: "End of if statement.",
                },
                {
                    line: 5,
                    operation: "set",
                    varName: "j",
                    type: "number",
                    value: 2,
                    timestamp: undefined,
                    description: "Set variable j to 2.",
                },
                {
                    line: 5,
                    operation: "if",
                    condition: "j <= 3",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if j <= 3.",
                },
                {
                    line: 6,
                    operation: "set",
                    varName: "current",
                    type: "number",
                    value: {
                        operation: "get",
                        type: "array",
                        varName: "myArray",
                        index: 2,
                        result: 50,
                    },
                    timestamp: undefined,
                    description: "Set variable current to myArray[2].",
                },
                {
                    line: 7,
                    operation: "set",
                    varName: "next",
                    type: "number",
                    value: {
                        operation: "get",
                        type: "array",
                        varName: "myArray",
                        index: 3,
                        result: 20,
                    },
                    timestamp: undefined,
                    description: "Set variable next to myArray[3].",
                },
                {
                    line: 8,
                    operation: "if",
                    condition: "current > next",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if current > next.",
                },
                {
                    line: 9,
                    operation: "swap",
                    dataStructure: "array",
                    firstPosition: 2,
                    secondPosition: 3,
                    varName: "myArray",
                    description:
                        "Swapped values in position 2 and 3 in array myArray.",
                    timestamp: undefined,
                },
                {
                    line: 10,
                    operation: "set",
                    varName: "swapped",
                    type: "boolean",
                    value: true,
                    timestamp: undefined,
                    description: "Set variable swapped to true.",
                },
                {
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                    description: "End of if statement.",
                },
                {
                    line: 5,
                    operation: "set",
                    varName: "j",
                    type: "number",
                    value: 3,
                    timestamp: undefined,
                    description: "Set variable j to 3.",
                },
                {
                    line: 5,
                    operation: "if",
                    condition: "j <= 3",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if j <= 3.",
                },
                {
                    line: 6,
                    operation: "set",
                    varName: "current",
                    type: "number",
                    value: {
                        operation: "get",
                        type: "array",
                        varName: "myArray",
                        index: 3,
                        result: 50,
                    },
                    timestamp: undefined,
                    description: "Set variable current to myArray[3].",
                },
                {
                    line: 7,
                    operation: "set",
                    varName: "next",
                    type: "number",
                    value: {
                        operation: "get",
                        type: "array",
                        varName: "myArray",
                        index: 4,
                        result: 10,
                    },
                    timestamp: undefined,
                    description: "Set variable next to myArray[4].",
                },
                {
                    line: 8,
                    operation: "if",
                    condition: "current > next",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if current > next.",
                },
                {
                    line: 9,
                    operation: "swap",
                    dataStructure: "array",
                    firstPosition: 3,
                    secondPosition: 4,
                    varName: "myArray",
                    description:
                        "Swapped values in position 3 and 4 in array myArray.",
                    timestamp: undefined,
                },
                {
                    line: 10,
                    operation: "set",
                    varName: "swapped",
                    type: "boolean",
                    value: true,
                    timestamp: undefined,
                    description: "Set variable swapped to true.",
                },
                {
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                    description: "End of if statement.",
                },
                {
                    line: 5,
                    operation: "set",
                    varName: "j",
                    type: "number",
                    value: 4,
                    timestamp: undefined,
                    description: "Set variable j to 4.",
                },
                {
                    line: 5,
                    operation: "if",
                    condition: "j <= 3",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if j <= 3.",
                },
                {
                    line: null,
                    operation: "loop_end",
                    timestamp: undefined,
                    description: "End of loop from_to loop",
                },
                {
                    line: 13,
                    operation: "if",
                    condition: "!swapped",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if !swapped.",
                },
                {
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                    description: "End of if statement.",
                },
                {
                    line: 3,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 1,
                    timestamp: undefined,
                    description: "Set variable i to 1.",
                },
                {
                    line: 3,
                    operation: "if",
                    condition: "i <= 4",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if i <= 4.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "swapped",
                    type: "boolean",
                    value: false,
                    timestamp: undefined,
                    description: "Set variable swapped to false.",
                },
                {
                    line: 5,
                    operation: "set",
                    varName: "j",
                    type: "number",
                    value: 0,
                    timestamp: undefined,
                    description: "Set variable j to 0.",
                },
                {
                    line: 5,
                    operation: "loop_from_to",
                    condition: "j <= 2",
                    timestamp: undefined,
                    description: "loop from_to loop with condition j <= 2.",
                },
                {
                    line: 5,
                    operation: "if",
                    condition: "j <= 2",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if j <= 2.",
                },
                {
                    line: 6,
                    operation: "set",
                    varName: "current",
                    type: "number",
                    value: {
                        operation: "get",
                        type: "array",
                        varName: "myArray",
                        index: 0,
                        result: 40,
                    },
                    timestamp: undefined,
                    description: "Set variable current to myArray[0].",
                },
                {
                    line: 7,
                    operation: "set",
                    varName: "next",
                    type: "number",
                    value: {
                        operation: "get",
                        type: "array",
                        varName: "myArray",
                        index: 1,
                        result: 30,
                    },
                    timestamp: undefined,
                    description: "Set variable next to myArray[1].",
                },
                {
                    line: 8,
                    operation: "if",
                    condition: "current > next",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if current > next.",
                },
                {
                    line: 9,
                    operation: "swap",
                    dataStructure: "array",
                    firstPosition: 0,
                    secondPosition: 1,
                    varName: "myArray",
                    description:
                        "Swapped values in position 0 and 1 in array myArray.",
                    timestamp: undefined,
                },
                {
                    line: 10,
                    operation: "set",
                    varName: "swapped",
                    type: "boolean",
                    value: true,
                    timestamp: undefined,
                    description: "Set variable swapped to true.",
                },
                {
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                    description: "End of if statement.",
                },
                {
                    line: 5,
                    operation: "set",
                    varName: "j",
                    type: "number",
                    value: 1,
                    timestamp: undefined,
                    description: "Set variable j to 1.",
                },
                {
                    line: 5,
                    operation: "if",
                    condition: "j <= 2",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if j <= 2.",
                },
                {
                    line: 6,
                    operation: "set",
                    varName: "current",
                    type: "number",
                    value: {
                        operation: "get",
                        type: "array",
                        varName: "myArray",
                        index: 1,
                        result: 40,
                    },
                    timestamp: undefined,
                    description: "Set variable current to myArray[1].",
                },
                {
                    line: 7,
                    operation: "set",
                    varName: "next",
                    type: "number",
                    value: {
                        operation: "get",
                        type: "array",
                        varName: "myArray",
                        index: 2,
                        result: 20,
                    },
                    timestamp: undefined,
                    description: "Set variable next to myArray[2].",
                },
                {
                    line: 8,
                    operation: "if",
                    condition: "current > next",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if current > next.",
                },
                {
                    line: 9,
                    operation: "swap",
                    dataStructure: "array",
                    firstPosition: 1,
                    secondPosition: 2,
                    varName: "myArray",
                    description:
                        "Swapped values in position 1 and 2 in array myArray.",
                    timestamp: undefined,
                },
                {
                    line: 10,
                    operation: "set",
                    varName: "swapped",
                    type: "boolean",
                    value: true,
                    timestamp: undefined,
                    description: "Set variable swapped to true.",
                },
                {
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                    description: "End of if statement.",
                },
                {
                    line: 5,
                    operation: "set",
                    varName: "j",
                    type: "number",
                    value: 2,
                    timestamp: undefined,
                    description: "Set variable j to 2.",
                },
                {
                    line: 5,
                    operation: "if",
                    condition: "j <= 2",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if j <= 2.",
                },
                {
                    line: 6,
                    operation: "set",
                    varName: "current",
                    type: "number",
                    value: {
                        operation: "get",
                        type: "array",
                        varName: "myArray",
                        index: 2,
                        result: 40,
                    },
                    timestamp: undefined,
                    description: "Set variable current to myArray[2].",
                },
                {
                    line: 7,
                    operation: "set",
                    varName: "next",
                    type: "number",
                    value: {
                        operation: "get",
                        type: "array",
                        varName: "myArray",
                        index: 3,
                        result: 10,
                    },
                    timestamp: undefined,
                    description: "Set variable next to myArray[3].",
                },
                {
                    line: 8,
                    operation: "if",
                    condition: "current > next",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if current > next.",
                },
                {
                    line: 9,
                    operation: "swap",
                    dataStructure: "array",
                    firstPosition: 2,
                    secondPosition: 3,
                    varName: "myArray",
                    description:
                        "Swapped values in position 2 and 3 in array myArray.",
                    timestamp: undefined,
                },
                {
                    line: 10,
                    operation: "set",
                    varName: "swapped",
                    type: "boolean",
                    value: true,
                    timestamp: undefined,
                    description: "Set variable swapped to true.",
                },
                {
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                    description: "End of if statement.",
                },
                {
                    line: 5,
                    operation: "set",
                    varName: "j",
                    type: "number",
                    value: 3,
                    timestamp: undefined,
                    description: "Set variable j to 3.",
                },
                {
                    line: 5,
                    operation: "if",
                    condition: "j <= 2",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if j <= 2.",
                },
                {
                    line: null,
                    operation: "loop_end",
                    timestamp: undefined,
                    description: "End of loop from_to loop",
                },
                {
                    line: 13,
                    operation: "if",
                    condition: "!swapped",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if !swapped.",
                },
                {
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                    description: "End of if statement.",
                },
                {
                    line: 3,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 2,
                    timestamp: undefined,
                    description: "Set variable i to 2.",
                },
                {
                    line: 3,
                    operation: "if",
                    condition: "i <= 4",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if i <= 4.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "swapped",
                    type: "boolean",
                    value: false,
                    timestamp: undefined,
                    description: "Set variable swapped to false.",
                },
                {
                    line: 5,
                    operation: "set",
                    varName: "j",
                    type: "number",
                    value: 0,
                    timestamp: undefined,
                    description: "Set variable j to 0.",
                },
                {
                    line: 5,
                    operation: "loop_from_to",
                    condition: "j <= 1",
                    timestamp: undefined,
                    description: "loop from_to loop with condition j <= 1.",
                },
                {
                    line: 5,
                    operation: "if",
                    condition: "j <= 1",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if j <= 1.",
                },
                {
                    line: 6,
                    operation: "set",
                    varName: "current",
                    type: "number",
                    value: {
                        operation: "get",
                        type: "array",
                        varName: "myArray",
                        index: 0,
                        result: 30,
                    },
                    timestamp: undefined,
                    description: "Set variable current to myArray[0].",
                },
                {
                    line: 7,
                    operation: "set",
                    varName: "next",
                    type: "number",
                    value: {
                        operation: "get",
                        type: "array",
                        varName: "myArray",
                        index: 1,
                        result: 20,
                    },
                    timestamp: undefined,
                    description: "Set variable next to myArray[1].",
                },
                {
                    line: 8,
                    operation: "if",
                    condition: "current > next",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if current > next.",
                },
                {
                    line: 9,
                    operation: "swap",
                    dataStructure: "array",
                    firstPosition: 0,
                    secondPosition: 1,
                    varName: "myArray",
                    description:
                        "Swapped values in position 0 and 1 in array myArray.",
                    timestamp: undefined,
                },
                {
                    line: 10,
                    operation: "set",
                    varName: "swapped",
                    type: "boolean",
                    value: true,
                    timestamp: undefined,
                    description: "Set variable swapped to true.",
                },
                {
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                    description: "End of if statement.",
                },
                {
                    line: 5,
                    operation: "set",
                    varName: "j",
                    type: "number",
                    value: 1,
                    timestamp: undefined,
                    description: "Set variable j to 1.",
                },
                {
                    line: 5,
                    operation: "if",
                    condition: "j <= 1",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if j <= 1.",
                },
                {
                    line: 6,
                    operation: "set",
                    varName: "current",
                    type: "number",
                    value: {
                        operation: "get",
                        type: "array",
                        varName: "myArray",
                        index: 1,
                        result: 30,
                    },
                    timestamp: undefined,
                    description: "Set variable current to myArray[1].",
                },
                {
                    line: 7,
                    operation: "set",
                    varName: "next",
                    type: "number",
                    value: {
                        operation: "get",
                        type: "array",
                        varName: "myArray",
                        index: 2,
                        result: 10,
                    },
                    timestamp: undefined,
                    description: "Set variable next to myArray[2].",
                },
                {
                    line: 8,
                    operation: "if",
                    condition: "current > next",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if current > next.",
                },
                {
                    line: 9,
                    operation: "swap",
                    dataStructure: "array",
                    firstPosition: 1,
                    secondPosition: 2,
                    varName: "myArray",
                    description:
                        "Swapped values in position 1 and 2 in array myArray.",
                    timestamp: undefined,
                },
                {
                    line: 10,
                    operation: "set",
                    varName: "swapped",
                    type: "boolean",
                    value: true,
                    timestamp: undefined,
                    description: "Set variable swapped to true.",
                },
                {
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                    description: "End of if statement.",
                },
                {
                    line: 5,
                    operation: "set",
                    varName: "j",
                    type: "number",
                    value: 2,
                    timestamp: undefined,
                    description: "Set variable j to 2.",
                },
                {
                    line: 5,
                    operation: "if",
                    condition: "j <= 1",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if j <= 1.",
                },
                {
                    line: null,
                    operation: "loop_end",
                    timestamp: undefined,
                    description: "End of loop from_to loop",
                },
                {
                    line: 13,
                    operation: "if",
                    condition: "!swapped",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if !swapped.",
                },
                {
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                    description: "End of if statement.",
                },
                {
                    line: 3,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 3,
                    timestamp: undefined,
                    description: "Set variable i to 3.",
                },
                {
                    line: 3,
                    operation: "if",
                    condition: "i <= 4",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if i <= 4.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "swapped",
                    type: "boolean",
                    value: false,
                    timestamp: undefined,
                    description: "Set variable swapped to false.",
                },
                {
                    line: 5,
                    operation: "set",
                    varName: "j",
                    type: "number",
                    value: 0,
                    timestamp: undefined,
                    description: "Set variable j to 0.",
                },
                {
                    line: 5,
                    operation: "loop_from_to",
                    condition: "j <= 0",
                    timestamp: undefined,
                    description: "loop from_to loop with condition j <= 0.",
                },
                {
                    line: 5,
                    operation: "if",
                    condition: "j <= 0",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if j <= 0.",
                },
                {
                    line: 6,
                    operation: "set",
                    varName: "current",
                    type: "number",
                    value: {
                        operation: "get",
                        type: "array",
                        varName: "myArray",
                        index: 0,
                        result: 20,
                    },
                    timestamp: undefined,
                    description: "Set variable current to myArray[0].",
                },
                {
                    line: 7,
                    operation: "set",
                    varName: "next",
                    type: "number",
                    value: {
                        operation: "get",
                        type: "array",
                        varName: "myArray",
                        index: 1,
                        result: 10,
                    },
                    timestamp: undefined,
                    description: "Set variable next to myArray[1].",
                },
                {
                    line: 8,
                    operation: "if",
                    condition: "current > next",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if current > next.",
                },
                {
                    line: 9,
                    operation: "swap",
                    dataStructure: "array",
                    firstPosition: 0,
                    secondPosition: 1,
                    varName: "myArray",
                    description:
                        "Swapped values in position 0 and 1 in array myArray.",
                    timestamp: undefined,
                },
                {
                    line: 10,
                    operation: "set",
                    varName: "swapped",
                    type: "boolean",
                    value: true,
                    timestamp: undefined,
                    description: "Set variable swapped to true.",
                },
                {
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                    description: "End of if statement.",
                },
                {
                    line: 5,
                    operation: "set",
                    varName: "j",
                    type: "number",
                    value: 1,
                    timestamp: undefined,
                    description: "Set variable j to 1.",
                },
                {
                    line: 5,
                    operation: "if",
                    condition: "j <= 0",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if j <= 0.",
                },
                {
                    line: null,
                    operation: "loop_end",
                    timestamp: undefined,
                    description: "End of loop from_to loop",
                },
                {
                    line: 13,
                    operation: "if",
                    condition: "!swapped",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if !swapped.",
                },
                {
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                    description: "End of if statement.",
                },
                {
                    line: 3,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 4,
                    timestamp: undefined,
                    description: "Set variable i to 4.",
                },
                {
                    line: 3,
                    operation: "if",
                    condition: "i <= 4",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if i <= 4.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "swapped",
                    type: "boolean",
                    value: false,
                    timestamp: undefined,
                    description: "Set variable swapped to false.",
                },
                {
                    line: 5,
                    operation: "set",
                    varName: "j",
                    type: "number",
                    value: 0,
                    timestamp: undefined,
                    description: "Set variable j to 0.",
                },
                {
                    line: 5,
                    operation: "loop_from_to",
                    condition: "j <= -1",
                    timestamp: undefined,
                    description: "loop from_to loop with condition j <= -1.",
                },
                {
                    line: 5,
                    operation: "if",
                    condition: "j <= -1",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if j <= -1.",
                },
                {
                    line: null,
                    operation: "loop_end",
                    timestamp: undefined,
                    description: "End of loop from_to loop",
                },
                {
                    line: 13,
                    operation: "if",
                    condition: "!swapped",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if !swapped.",
                },
                {
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                    description: "End of if statement.",
                },
                {
                    line: 3,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 5,
                    timestamp: undefined,
                    description: "Set variable i to 5.",
                },
                {
                    line: 3,
                    operation: "if",
                    condition: "i <= 4",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if i <= 4.",
                },
                {
                    line: null,
                    operation: "loop_end",
                    timestamp: undefined,
                    description: "End of loop from_to loop",
                },
                {
                    line: 17,
                    operation: "print",
                    isLiteral: false,
                    varName: "myArray",
                    literal: [10, 20, 30, 40, 50],
                    timestamp: undefined,
                    description: "Printed myArray.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        result.actionFrames.forEach((frame, index) => {
            frame.timestamp = expectedJson.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });
    it("should throw an error when trying to set a variable based on an uninitialized variable", () => {
        const pseudocode = `            SET result TO x * 2
        `;

        expect(() => PseudocodeProcessor.process(pseudocode)).to.throw(
            "Ensure that all variables are declared before being used in an expression."
        );
    });

    it("should throw an error when trying to use an uninitialized variable in a function call", () => {
        const pseudocode = `DEFINE add_numbers WITH PARAMETERS (a, b)
                RETURN a + b
            END FUNCTION
            SET result TO CALL add_numbers WITH (x, 5)
        `;

        expect(() => PseudocodeProcessor.process(pseudocode)).to.throw(
            "Variable 'x' is not declared. Ensure that 'x' is declared before it is used."
        );
    });

    it("should throw an error when trying to use an uninitialized variable in a conditional statement", () => {
        const pseudocode = `           IF x > 5 THEN
                PRINT "x is greater than 5"
            END IF
        `;

        expect(() => PseudocodeProcessor.process(pseudocode)).to.throw(
            "Variable 'x' is not declared. Ensure that 'x' is declared before it is used."
        );
    });

    it("should throw an error when trying to use an uninitialized variable in a loop", () => {
        const pseudocode = `LOOP UNTIL x > 10
                SET x TO x + 1
            END LOOP
        `;

        expect(() => PseudocodeProcessor.process(pseudocode)).to.throw(
            "Variable 'x' is not declared. Ensure that 'x' is declared before it is used."
        );
    });

    it("should throw an error when trying to access the length of an uninitialized array", () => {
        const pseudocode = `SET len TO LENGTH OF myArray
        `;

        expect(() => PseudocodeProcessor.process(pseudocode)).to.throw(
            "Variable 'myArray' is not declared. Ensure that 'myArray' is declared before it is used."
        );
    });

    it("should throw an error when trying to access an element of an uninitialized array", () => {
        const pseudocode = `SET e TO myArray[0]
        `;

        expect(() => PseudocodeProcessor.process(pseudocode)).to.throw(
            "Variable 'myArray' is not declared. Ensure that 'myArray' is declared before it is used."
        );
    });

    it("should throw an error when trying to call a function before it is declared", () => {
        const pseudocode = `SET result TO CALL myFunction WITH (5)
        `;

        expect(() => PseudocodeProcessor.process(pseudocode)).to.throw(
            "Function myFunction is not defined."
        );
    });

    it("should throw an error when trying to access a string index of an uninitialized variable", () => {
        const pseudocode = `SET firstChar TO CHARACTER AT 0 OF myString
        `;

        expect(() => PseudocodeProcessor.process(pseudocode)).to.throw(
            "Variable 'myString' is not declared. Ensure that 'myString' is declared before it is used."
        );
    });

    it("should correctly process multiplication before addition in arithmetic with parentheses in PseudocodeProcessor", () => {
        const pseudocode = `SET result TO (4 + 2) * (3 - 1)
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "result",
                    type: "number",
                    value: 12,
                    timestamp: undefined,
                    description: "Set variable result to (4 + 2) * (3 - 1).",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should correctly process multiple levels of parentheses in arithmetic in PseudocodeProcessor", () => {
        const pseudocode = `SET result TO (1 + (2 * (3 + 4)))
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "result",
                    type: "number",
                    value: 15,
                    timestamp: undefined,
                    description: "Set variable result to 1 + (2 * (3 + 4)).",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should correctly process nested parentheses in arithmetic in PseudocodeProcessor", () => {
        const pseudocode = `SET result TO (2 + (3 * 2)) - 5
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "result",
                    type: "number",
                    value: 3,
                    timestamp: undefined,
                    description: "Set variable result to (2 + (3 * 2)) - 5.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should correctly process simple arithmetic with parentheses in PseudocodeProcessor", () => {
        const pseudocode = `SET result TO (5 + 3) * 2
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "result",
                    type: "number",
                    value: 16,
                    timestamp: undefined,
                    description: "Set variable result to (5 + 3) * 2.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should throw an error when processing a function call with no return value inside a variable declaration", () => {
        const pseudocode = `DEFINE logMessage WITH PARAMETERS (message)
            PRINT message
        END FUNCTION
        SET result TO CALL logMessage WITH ("Test message")`;

        expect(() => {
            PseudocodeProcessor.process(pseudocode);
        }).to.throw(
            Error,
            "Function logMessage does not return a value and cannot be used in a variable declaration."
        );
    });

    it("should correctly process a function call within a variable declaration", () => {
        const pseudocode = `DEFINE addNumbers WITH PARAMETERS (a, b)
            RETURN a + b
        END FUNCTION
        SET sum TO CALL addNumbers WITH (5, 10)`;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "define",
                    varName: "addNumbers",
                    params: ["a", "b"],
                    timestamp: undefined,
                    description:
                        "Defined function addNumbers with parameters a, b.",
                },
                {
                    line: 4,
                    operation: "function_call",
                    varName: "addNumbers",
                    arguments: [5, 10],
                    timestamp: undefined,
                    description:
                        "Called function addNumbers with arguments 5,10.",
                },
                {
                    line: 2,
                    operation: "return",
                    value: 15,
                    timestamp: undefined,
                    description: "Returned 15.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "sum",
                    type: "number",
                    value: 15,
                    timestamp: undefined,
                    description:
                        "Set variable sum to function return value 15.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should correctly process a function with multiple parameters and no return", () => {
        const pseudocode = `DEFINE multiplyNumbers WITH PARAMETERS (num1, num2)
            PRINT num1 * num2
        END FUNCTION
        CALL multiplyNumbers WITH (5, 6)`;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "define",
                    varName: "multiplyNumbers",
                    params: ["num1", "num2"],
                    timestamp: undefined,
                    description:
                        "Defined function multiplyNumbers with parameters num1, num2.",
                },
                {
                    line: 4,
                    operation: "function_call",
                    varName: "multiplyNumbers",
                    arguments: [5, 6],
                    timestamp: undefined,
                    description:
                        "Called function multiplyNumbers with arguments 5,6.",
                },
                {
                    line: 2,
                    operation: "print",
                    isLiteral: true,
                    varName: null,
                    literal: 30,
                    timestamp: undefined,
                    description: "Printed 30.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should correctly process a function with zero parameters and no return statement", () => {
        const pseudocode = `DEFINE greetUser WITH PARAMETERS ()
            PRINT "Hello, user!"
        END FUNCTION
        CALL greetUser WITH ()`;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "define",
                    varName: "greetUser",
                    params: [],
                    timestamp: undefined,
                    description:
                        "Defined function greetUser with no parameters.",
                },
                {
                    line: 4,
                    operation: "function_call",
                    varName: "greetUser",
                    arguments: [],
                    timestamp: undefined,
                    description: "Called function greetUser with no arguments.",
                },
                {
                    line: 2,
                    operation: "print",
                    isLiteral: true,
                    varName: null,
                    literal: "Hello, user!",
                    timestamp: undefined,
                    description: "Printed Hello, user!.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should handle swap with expressions in position values", () => {
        const pseudocode = `CREATE number array AS myArray WITH VALUES [10, 20, 30, 40]
            SWAP position LENGTH OF myArray - 1 WITH position 0 IN myArray
            PRINT myArray
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "create",
                    dataStructure: "array",
                    type: "number",
                    varName: "myArray",
                    value: [10, 20, 30, 40],
                    timestamp: undefined,
                    description:
                        "Created array myArray with values [10,20,30,40].",
                },
                {
                    line: 2,
                    operation: "swap",
                    dataStructure: "array",
                    firstPosition: 3,
                    secondPosition: 0,
                    varName: "myArray",
                    description:
                        "Swapped values in position 3 and 0 in array myArray.",
                    timestamp: undefined,
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "myArray",
                    literal: [40, 20, 30, 10],
                    timestamp: undefined,
                    description: "Printed myArray.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        result.actionFrames.forEach((frame, index) => {
            frame.timestamp = expectedJson.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should correctly handle a for-each loop after swapping elements", () => {
        const pseudocode = `CREATE number array AS myArray WITH VALUES [5, 15, 25, 35]
        SWAP position 0 WITH position 3 IN myArray
        FOR EACH num IN myArray
            PRINT num
        END FOR
    `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "create",
                    dataStructure: "array",
                    type: "number",
                    varName: "myArray",
                    value: [5, 15, 25, 35],
                    timestamp: undefined,
                    description:
                        "Created array myArray with values [5,15,25,35].",
                },
                {
                    line: 2,
                    operation: "swap",
                    dataStructure: "array",
                    firstPosition: 0,
                    secondPosition: 3,
                    varName: "myArray",
                    description:
                        "Swapped values in position 0 and 3 in array myArray.",
                    timestamp: undefined,
                },
                {
                    line: 3,
                    operation: "for_each",
                    condition: "num in myArray",
                    timestamp: undefined,
                    description: "for each loop with condition num in myArray.",
                },
                {
                    line: 3,
                    operation: "if",
                    condition: "index < 4",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if index < 4",
                },
                {
                    line: 3,
                    operation: "set",
                    varName: "num",
                    type: "number",
                    value: {
                        operation: "get",
                        type: "array",
                        varName: "myArray",
                        index: 0,
                        result: 35,
                    },
                    timestamp: undefined,
                    description: "Set variable num to myArray[0].",
                },
                {
                    line: 4,
                    operation: "print",
                    isLiteral: false,
                    varName: "num",
                    literal: 35,
                    timestamp: undefined,
                    description: "Printed num.",
                },
                {
                    line: 3,
                    operation: "if",
                    condition: "index < 4",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if index < 4",
                },
                {
                    line: 3,
                    operation: "set",
                    varName: "num",
                    type: "number",
                    value: {
                        operation: "get",
                        type: "array",
                        varName: "myArray",
                        index: 1,
                        result: 15,
                    },
                    timestamp: undefined,
                    description: "Set variable num to myArray[1].",
                },
                {
                    line: 4,
                    operation: "print",
                    isLiteral: false,
                    varName: "num",
                    literal: 15,
                    timestamp: undefined,
                    description: "Printed num.",
                },
                {
                    line: 3,
                    operation: "if",
                    condition: "index < 4",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if index < 4",
                },
                {
                    line: 3,
                    operation: "set",
                    varName: "num",
                    type: "number",
                    value: {
                        operation: "get",
                        type: "array",
                        varName: "myArray",
                        index: 2,
                        result: 25,
                    },
                    timestamp: undefined,
                    description: "Set variable num to myArray[2].",
                },
                {
                    line: 4,
                    operation: "print",
                    isLiteral: false,
                    varName: "num",
                    literal: 25,
                    timestamp: undefined,
                    description: "Printed num.",
                },
                {
                    line: 3,
                    operation: "if",
                    condition: "index < 4",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if index < 4",
                },
                {
                    line: 3,
                    operation: "set",
                    varName: "num",
                    type: "number",
                    value: {
                        operation: "get",
                        type: "array",
                        varName: "myArray",
                        index: 3,
                        result: 5,
                    },
                    timestamp: undefined,
                    description: "Set variable num to myArray[3].",
                },
                {
                    line: 4,
                    operation: "print",
                    isLiteral: false,
                    varName: "num",
                    literal: 5,
                    timestamp: undefined,
                    description: "Printed num.",
                },
                {
                    line: 3,
                    operation: "if",
                    condition: "index < 4",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if num in myArray.",
                },
                {
                    line: null,
                    operation: "loop_end",
                    timestamp: undefined,
                    description: "End of for each loop",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        result.actionFrames.forEach((frame, index) => {
            frame.timestamp = expectedJson.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });
    it("should correctly handle swapping two elements in an array", () => {
        const pseudocode = `CREATE number array AS myArray WITH VALUES [10, 20, 30, 40, 50]
        SWAP position 1 WITH position 2 IN myArray
    `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "create",
                    dataStructure: "array",
                    type: "number",
                    varName: "myArray",
                    value: [10, 20, 30, 40, 50],
                    timestamp: undefined,
                    description:
                        "Created array myArray with values [10,20,30,40,50].",
                },
                {
                    line: 2,
                    operation: "swap",
                    dataStructure: "array",
                    firstPosition: 1,
                    secondPosition: 2,
                    varName: "myArray",
                    timestamp: undefined,
                    description:
                        "Swapped values in position 1 and 2 in array myArray.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        result.actionFrames.forEach((frame, index) => {
            frame.timestamp = expectedJson.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should correctly handle using an array after swapping elements", () => {
        const pseudocode = `CREATE number array AS myArray WITH VALUES [10, 20, 30, 40, 50]
        SWAP position 0 WITH position 4 IN myArray
        PRINT myArray
    `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "create",
                    dataStructure: "array",
                    type: "number",
                    varName: "myArray",
                    value: [10, 20, 30, 40, 50],
                    timestamp: undefined,
                    description:
                        "Created array myArray with values [10,20,30,40,50].",
                },
                {
                    line: 2,
                    operation: "swap",
                    dataStructure: "array",
                    firstPosition: 0,
                    secondPosition: 4,
                    varName: "myArray",
                    timestamp: undefined,
                    description:
                        "Swapped values in position 0 and 4 in array myArray.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "myArray",
                    literal: [50, 20, 30, 40, 10],
                    timestamp: undefined,
                    description: "Printed myArray.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        result.actionFrames.forEach((frame, index) => {
            frame.timestamp = expectedJson.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should throw an error when trying to swap with out-of-bounds positions", () => {
        const pseudocode = `CREATE number array AS myArray WITH VALUES [10, 20, 30]
        SWAP position 0 WITH position 3 IN myArray
    `;

        expect(() => PseudocodeProcessor.process(pseudocode)).to.throw(
            "Error at line 2: Swap positions must be within the bounds of the array myArray (size 3)."
        );
    });

    it("should correctly handle swapping two elements in an array with one-based pseudocode positions", () => {
        const pseudocode = `CREATE number array AS myArray WITH VALUES [10, 20, 30, 40, 50]
            SWAP position 1 WITH position 2 IN myArray`;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "create",
                    dataStructure: "array",
                    type: "number",
                    varName: "myArray",
                    value: [10, 20, 30, 40, 50],
                    timestamp: undefined,
                    description:
                        "Created array myArray with values [10,20,30,40,50].",
                },
                {
                    line: 2,
                    operation: "swap",
                    dataStructure: "array",
                    firstPosition: 1,
                    secondPosition: 2,
                    varName: "myArray",
                    timestamp: undefined,
                    description:
                        "Swapped values in position 1 and 2 in array myArray.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        result.actionFrames.forEach((frame, index) => {
            frame.timestamp = expectedJson.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should process a 'FOR EACH' loop followed by operations correctly", () => {
        const pseudocode = `SET total TO 0
            CREATE number array AS nums WITH values [1, 2, 3]
            FOR each num IN nums
                SET total TO total + num
            END FOR
            PRINT total`;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "total",
                    type: "number",
                    value: 0,
                    timestamp: undefined,
                    description: "Set variable total to 0.",
                },
                {
                    line: 2,
                    operation: "create",
                    dataStructure: "array",
                    type: "number",
                    varName: "nums",
                    value: [1, 2, 3],
                    timestamp: undefined,
                    description: "Created array nums with values [1,2,3].",
                },
                {
                    line: 3,
                    operation: "for_each",
                    condition: "num in nums",
                    timestamp: undefined,
                    description: "for each loop with condition num in nums.",
                },
                {
                    line: 3,
                    operation: "if",
                    condition: "index < 3",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if index < 3",
                },
                {
                    line: 3,
                    operation: "set",
                    varName: "num",
                    type: "number",
                    value: {
                        operation: "get",
                        type: "array",
                        varName: "nums",
                        index: 0,
                        result: 1,
                    },
                    timestamp: undefined,
                    description: "Set variable num to nums[0].",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "total",
                    type: "number",
                    value: 1,
                    timestamp: undefined,
                    description: "Set variable total to total + num.",
                },
                {
                    line: 3,
                    operation: "if",
                    condition: "index < 3",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if index < 3",
                },
                {
                    line: 3,
                    operation: "set",
                    varName: "num",
                    type: "number",
                    value: {
                        operation: "get",
                        type: "array",
                        varName: "nums",
                        index: 1,
                        result: 2,
                    },
                    timestamp: undefined,
                    description: "Set variable num to nums[1].",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "total",
                    type: "number",
                    value: 3,
                    timestamp: undefined,
                    description: "Set variable total to total + num.",
                },
                {
                    line: 3,
                    operation: "if",
                    condition: "index < 3",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if index < 3",
                },
                {
                    line: 3,
                    operation: "set",
                    varName: "num",
                    type: "number",
                    value: {
                        operation: "get",
                        type: "array",
                        varName: "nums",
                        index: 2,
                        result: 3,
                    },
                    timestamp: undefined,
                    description: "Set variable num to nums[2].",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "total",
                    type: "number",
                    value: 6,
                    timestamp: undefined,
                    description: "Set variable total to total + num.",
                },
                {
                    line: 3,
                    operation: "if",
                    condition: "index < 3",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if num in nums.",
                },
                {
                    line: null,
                    operation: "loop_end",
                    timestamp: undefined,
                    description: "End of for each loop",
                },
                {
                    line: 6,
                    operation: "print",
                    isLiteral: false,
                    varName: "total",
                    literal: 6,
                    timestamp: undefined,
                    description: "Printed total.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);
        result.actionFrames.forEach((frame, index) => {
            frame.timestamp = expectedJson.actionFrames[index].timestamp;
        });
        expect(result).to.deep.equal(expectedJson);
    });

    it("should process a simulated 'FOR EACH' loop using 'LOOP FROM TO'", () => {
        const pseudocode = `CREATE number array AS myArray WITH VALUES [10, 20, 30, 40, 50]
            LOOP i FROM 0 TO LENGTH OF myArray - 1
                SET temp TO myArray[i]
                PRINT temp
            END LOOP`;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "create",
                    dataStructure: "array",
                    type: "number",
                    varName: "myArray",
                    value: [10, 20, 30, 40, 50],
                    timestamp: undefined,
                    description:
                        "Created array myArray with values [10,20,30,40,50].",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 0,
                    timestamp: undefined,
                    description: "Set variable i to 0.",
                },
                {
                    line: 2,
                    operation: "loop_from_to",
                    condition: "i <= 4",
                    timestamp: undefined,
                    description: "loop from_to loop with condition i <= 4.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "i <= 4",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if i <= 4.",
                },
                {
                    line: 3,
                    operation: "set",
                    varName: "temp",
                    type: "number",
                    value: {
                        operation: "get",
                        type: "array",
                        varName: "myArray",
                        index: 0,
                        result: 10,
                    },
                    timestamp: undefined,
                    description: "Set variable temp to myArray[0].",
                },
                {
                    line: 4,
                    operation: "print",
                    isLiteral: false,
                    varName: "temp",
                    literal: 10,
                    timestamp: undefined,
                    description: "Printed temp.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 1,
                    timestamp: undefined,
                    description: "Set variable i to 1.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "i <= 4",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if i <= 4.",
                },
                {
                    line: 3,
                    operation: "set",
                    varName: "temp",
                    type: "number",
                    value: {
                        operation: "get",
                        type: "array",
                        varName: "myArray",
                        index: 1,
                        result: 20,
                    },
                    timestamp: undefined,
                    description: "Set variable temp to myArray[1].",
                },
                {
                    line: 4,
                    operation: "print",
                    isLiteral: false,
                    varName: "temp",
                    literal: 20,
                    timestamp: undefined,
                    description: "Printed temp.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 2,
                    timestamp: undefined,
                    description: "Set variable i to 2.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "i <= 4",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if i <= 4.",
                },
                {
                    line: 3,
                    operation: "set",
                    varName: "temp",
                    type: "number",
                    value: {
                        operation: "get",
                        type: "array",
                        varName: "myArray",
                        index: 2,
                        result: 30,
                    },
                    timestamp: undefined,
                    description: "Set variable temp to myArray[2].",
                },
                {
                    line: 4,
                    operation: "print",
                    isLiteral: false,
                    varName: "temp",
                    literal: 30,
                    timestamp: undefined,
                    description: "Printed temp.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 3,
                    timestamp: undefined,
                    description: "Set variable i to 3.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "i <= 4",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if i <= 4.",
                },
                {
                    line: 3,
                    operation: "set",
                    varName: "temp",
                    type: "number",
                    value: {
                        operation: "get",
                        type: "array",
                        varName: "myArray",
                        index: 3,
                        result: 40,
                    },
                    timestamp: undefined,
                    description: "Set variable temp to myArray[3].",
                },
                {
                    line: 4,
                    operation: "print",
                    isLiteral: false,
                    varName: "temp",
                    literal: 40,
                    timestamp: undefined,
                    description: "Printed temp.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 4,
                    timestamp: undefined,
                    description: "Set variable i to 4.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "i <= 4",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if i <= 4.",
                },
                {
                    line: 3,
                    operation: "set",
                    varName: "temp",
                    type: "number",
                    value: {
                        operation: "get",
                        type: "array",
                        varName: "myArray",
                        index: 4,
                        result: 50,
                    },
                    timestamp: undefined,
                    description: "Set variable temp to myArray[4].",
                },
                {
                    line: 4,
                    operation: "print",
                    isLiteral: false,
                    varName: "temp",
                    literal: 50,
                    timestamp: undefined,
                    description: "Printed temp.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 5,
                    timestamp: undefined,
                    description: "Set variable i to 5.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "i <= 4",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if i <= 4.",
                },
                {
                    line: null,
                    operation: "loop_end",
                    timestamp: undefined,
                    description: "End of loop from_to loop",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);
        result.actionFrames.forEach((frame, index) => {
            frame.timestamp = expectedJson.actionFrames[index].timestamp;
        });
        expect(result).to.deep.equal(expectedJson);
    });

    it("should process variable declarations with division and complex arithmetic", () => {
        const pseudocode = `SET p to number 100
        SET q to p / 4
        SET r to (q + 5) * 3`;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "p",
                    type: "number",
                    value: 100,
                    timestamp: undefined,
                    description: "Set variable p to 100.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "q",
                    type: "number",
                    value: 25,
                    timestamp: undefined,
                    description: "Set variable q to p / 4.",
                },
                {
                    line: 3,
                    operation: "set",
                    varName: "r",
                    type: "number",
                    value: 90,
                    timestamp: undefined,
                    description: "Set variable r to (q + 5) * 3.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should correctly process the creation of a boolean array and retrieving a value at an index", function () {
        const pseudocode = `create boolean array as boolArray with values [true, false, true]
            SET isTrue TO boolArray[0]
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "create",
                    varName: "boolArray",
                    dataStructure: "array",
                    value: [true, false, true],
                    type: "boolean",
                    timestamp: undefined,
                    description:
                        "Created array boolArray with values [true,false,true].",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "isTrue",
                    type: "boolean",
                    value: {
                        operation: "get",
                        type: "array",
                        varName: "boolArray",
                        index: 0,
                        result: true,
                    },
                    timestamp: undefined,
                    description: "Set variable isTrue to boolArray[0].",
                },
            ],
        };
        const jsonConverter = new JsonConverter();
        const processor = new Processor(jsonConverter);

        const result = processor.process(pseudocode, "jsonOutput.txt");

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should correctly process a function call and return the function body", () => {
        const pseudocode = `DEFINE add_numbers WITH PARAMETERS (a, b)
            RETURN a + b
        END FUNCTION
        SET x TO CALL add_numbers WITH (5, 10)`;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "define",
                    varName: "add_numbers",
                    params: ["a", "b"],
                    timestamp: undefined,
                    description:
                        "Defined function add_numbers with parameters a, b.",
                },
                {
                    line: 4,
                    operation: "function_call",
                    varName: "add_numbers",
                    arguments: [5, 10],
                    timestamp: undefined,
                    description:
                        "Called function add_numbers with arguments 5,10.",
                },
                {
                    line: 2,
                    operation: "return",
                    value: 15,
                    timestamp: undefined,
                    description: "Returned 15.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 15,
                    timestamp: undefined,
                    description: "Set variable x to function return value 15.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should process a function declaration with separate action frames for the body", () => {
        const pseudocode = `DEFINE add_numbers WITH PARAMETERS (a, b)
            RETURN a + b
        END FUNCTION`;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "define",
                    varName: "add_numbers",
                    params: ["a", "b"],
                    timestamp: undefined,
                    description:
                        "Defined function add_numbers with parameters a, b.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should correctly handle array operations with edge cases", () => {
        const pseudocode = `CREATE string array AS myStrings WITH SIZE 3
        SET element 0 OF myStrings TO "hello"
        SET element 1 OF myStrings TO "world"
        ADD "!" TO myStrings AT position 2
        REMOVE element 0 FROM myStrings
        PRINT myStrings
        SET firstElement TO myStrings[0]`;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "create",
                    type: "string",
                    dataStructure: "array",
                    varName: "myStrings",
                    value: ["", "", ""],
                    timestamp: undefined,
                    description: "Created array myStrings with size 3.",
                },
                {
                    line: 2,
                    operation: "set_array",
                    varName: "myStrings",
                    index: 0,
                    setValue: "hello",
                    timestamp: undefined,
                    description: "Set myStrings[0] to hello.",
                },
                {
                    line: 3,
                    operation: "set_array",
                    varName: "myStrings",
                    index: 1,
                    setValue: "world",
                    timestamp: undefined,
                    description: "Set myStrings[1] to world.",
                },
                {
                    line: 4,
                    operation: "add",
                    varName: "myStrings",
                    value: "!",
                    position: 2,
                    timestamp: undefined,
                    description: "Added ! to array myStrings at position 2.",
                },
                {
                    line: 5,
                    operation: "remove",
                    dataStructure: "array",
                    varName: "myStrings",
                    positionToRemove: 0,
                    timestamp: undefined,
                    description:
                        "Removed value at position 0 in array myStrings.",
                },
                {
                    line: 6,
                    operation: "print",
                    isLiteral: false,
                    varName: "myStrings",
                    literal: ["world", "!", ""],
                    timestamp: undefined,
                    description: "Printed myStrings.",
                },
                {
                    line: 7,
                    operation: "set",
                    varName: "firstElement",
                    type: "string",
                    value: {
                        operation: "get",
                        type: "array",
                        varName: "myStrings",
                        index: 0,
                        result: "world",
                    },
                    timestamp: undefined,
                    description: "Set variable firstElement to myStrings[0].",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should correctly process a series of array operations", () => {
        const pseudocode = `CREATE number array AS myArray WITH VALUES [5, 10, 15, 20, 25]
        INSERT 30 TO myArray AT position 3
        REMOVE element 4 FROM myArray
        SET element 2 OF myArray TO 50
        PRINT myArray
        SET totalLength TO LENGTH OF myArray`;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "create",
                    type: "number",
                    dataStructure: "array",
                    varName: "myArray",
                    value: [5, 10, 15, 20, 25],
                    timestamp: undefined,
                    description:
                        "Created array myArray with values [5,10,15,20,25].",
                },
                {
                    line: 2,
                    operation: "add",
                    varName: "myArray",
                    value: 30,
                    position: 3,
                    timestamp: undefined,
                    description: "Added 30 to array myArray at position 3.",
                },
                {
                    line: 3,
                    operation: "remove",
                    dataStructure: "array",
                    varName: "myArray",
                    positionToRemove: 4,
                    timestamp: undefined,
                    description:
                        "Removed value at position 4 in array myArray.",
                },
                {
                    line: 4,
                    operation: "set_array",
                    varName: "myArray",
                    index: 2,
                    setValue: 50,
                    timestamp: undefined,
                    description: "Set myArray[2] to 50.",
                },
                {
                    line: 5,
                    operation: "print",
                    isLiteral: false,
                    varName: "myArray",
                    literal: [5, 10, 50, 30, 25],
                    timestamp: undefined,
                    description: "Printed myArray.",
                },
                {
                    line: 6,
                    operation: "set",
                    varName: "totalLength",
                    type: "number",
                    value: 5,
                    timestamp: undefined,
                    description: "Set variable totalLength to 5.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should throw an error when trying to set a value at a negative index", () => {
        const pseudocode = `CREATE number array AS myArray WITH VALUES [10, 20, 30, 40, 50]
        SET element -1 OF myArray TO 25`;
        expect(() => PseudocodeProcessor.process(pseudocode)).to.throw(
            "Index -1 is out of bounds for array 'myArray'."
        );
    });
    it("should correctly set a value in a string array", () => {
        const pseudocode = `CREATE string array AS myArray WITH VALUES ["a", "b", "c", "d", "e"]
        SET element 2 OF myArray TO "z"`;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "create",
                    type: "string",
                    dataStructure: "array",
                    varName: "myArray",
                    value: ["a", "b", "c", "d", "e"],
                    timestamp: undefined,
                    description:
                        "Created array myArray with values [a,b,c,d,e].",
                },
                {
                    line: 2,
                    operation: "set_array",
                    varName: "myArray",
                    index: 2,
                    setValue: "z",
                    timestamp: undefined,
                    description: "Set myArray[2] to z.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should throw an error when trying to set a value of a different type than the array", () => {
        const pseudocode = `CREATE number array AS myArray WITH VALUES [10, 20, 30, 40, 50]
        SET element 2 OF myArray TO "stringValue"`;

        expect(() => PseudocodeProcessor.process(pseudocode)).to.throw(
            "Type mismatch at line 2: attempt to set an array of type number to a value of type string."
        );
    });

    it("should throw an error when trying to set a value in a non-array variable", () => {
        const pseudocode = `SET myVar TO 100
        SET element 2 OF myVar TO 25`;

        expect(() => PseudocodeProcessor.process(pseudocode)).to.throw(
            "Variable 'myVar' is not an array."
        );
    });

    it("should throw an error when trying to set a value in an uninitialized array", () => {
        const pseudocode = `SET element 2 OF myArray TO 25`;

        expect(() => PseudocodeProcessor.process(pseudocode)).to.throw(
            "Array 'myArray' is not initialized."
        );
    });

    it("should throw an error when trying to set a value at an out of bounds index", () => {
        const pseudocode = `CREATE number array AS myArray WITH VALUES [10, 20, 30, 40, 50]
        SET element 10 OF myArray TO 25`;

        expect(() => PseudocodeProcessor.process(pseudocode)).to.throw(
            "Index 10 is out of bounds for array 'myArray'."
        );
    });

    it("should correctly process setting a specific value in an array", () => {
        const pseudocode = `CREATE number array AS myArray WITH VALUES [10, 20, 30, 40, 50]
        SET element 2 OF myArray TO 25`;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "create",
                    type: "number",
                    dataStructure: "array",
                    varName: "myArray",
                    value: [10, 20, 30, 40, 50],
                    timestamp: undefined,
                    description:
                        "Created array myArray with values [10,20,30,40,50].",
                },
                {
                    line: 2,
                    operation: "set_array",
                    varName: "myArray",
                    index: 2,
                    setValue: 25,
                    timestamp: undefined,
                    description: "Set myArray[2] to 25.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should correctly process removing the last element from an array", () => {
        const pseudocode = `CREATE number array AS myArray WITH VALUES [100, 200, 300]
        REMOVE element 2 FROM myArray`;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "create",
                    type: "number",
                    dataStructure: "array",
                    varName: "myArray",
                    value: [100, 200, 300],
                    timestamp: undefined,
                    description:
                        "Created array myArray with values [100,200,300].",
                },
                {
                    line: 2,
                    operation: "remove",
                    dataStructure: "array",
                    varName: "myArray",
                    positionToRemove: 2,
                    timestamp: undefined,
                    description:
                        "Removed value at position 2 in array myArray.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should correctly process removing the first element from an array", () => {
        const pseudocode = `CREATE number array AS myArray WITH VALUES [10, 20, 30, 40, 50]
        REMOVE element 0 FROM myArray`;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "create",
                    type: "number",
                    dataStructure: "array",
                    varName: "myArray",
                    value: [10, 20, 30, 40, 50],
                    timestamp: undefined,
                    description:
                        "Created array myArray with values [10,20,30,40,50].",
                },
                {
                    line: 2,
                    operation: "remove",
                    dataStructure: "array",
                    varName: "myArray",
                    positionToRemove: 0,
                    timestamp: undefined,
                    description:
                        "Removed value at position 0 in array myArray.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should correctly process element removal from an array", () => {
        const pseudocode = `CREATE number array AS myArray WITH VALUES [1, 2, 3, 4, 5]
        REMOVE element 2 FROM myArray`;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "create",
                    type: "number",
                    dataStructure: "array",
                    varName: "myArray",
                    value: [1, 2, 3, 4, 5],
                    timestamp: undefined,
                    description:
                        "Created array myArray with values [1,2,3,4,5].",
                },
                {
                    line: 2,
                    operation: "remove",
                    dataStructure: "array",
                    varName: "myArray",
                    positionToRemove: 2,
                    timestamp: undefined,
                    description:
                        "Removed value at position 2 in array myArray.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });
    it("should correctly process array creation with size", () => {
        const pseudocode = `CREATE string array AS myArray WITH VALUES ["hi", "hello"]
            SET len to length of myArray
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "create",
                    dataStructure: "array",
                    type: "string",
                    varName: "myArray",
                    value: ["hi", "hello"],
                    timestamp: undefined,
                    description:
                        "Created array myArray with values [hi,hello].",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "len",
                    type: "number",
                    value: 2,
                    timestamp: undefined,
                    description: "Set variable len to 2.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode.trim());

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });
    it("should correctly process array creation and element access using high-level syntax", () => {
        const pseudocode = `CREATE number array AS myArray WITH VALUES [10, 20, 30]
            SET firstElement TO ELEMENT AT 0 OF myArray
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "create",
                    dataStructure: "array",
                    type: "number",
                    varName: "myArray",
                    value: [10, 20, 30],
                    timestamp: undefined,
                    description:
                        "Created array myArray with values [10,20,30].",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "firstElement",
                    value: {
                        operation: "get",
                        type: "array",
                        varName: "myArray",
                        index: 0,
                        result: 10,
                    },
                    type: "number",
                    timestamp: undefined,
                    description: "Set variable firstElement to myArray[0].",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should correctly process array creation and element access using traditional syntax", () => {
        const pseudocode = `CREATE number array AS myArray WITH VALUES [10, 20, 30]
            SET firstElement TO myArray[0]
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "create",
                    dataStructure: "array",
                    type: "number",
                    varName: "myArray",
                    value: [10, 20, 30],
                    timestamp: undefined,
                    description:
                        "Created array myArray with values [10,20,30].",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "firstElement",
                    value: {
                        operation: "get",
                        type: "array",
                        varName: "myArray",
                        index: 0,
                        result: 10,
                    },
                    type: "number",
                    timestamp: undefined,
                    description: "Set variable firstElement to myArray[0].",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });
    it("should correctly process array creation with values", () => {
        const pseudocode = `CREATE number Array AS myArray WITH VALUES [1, 2, 3]
            SET len to length of myArray
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "create",
                    dataStructure: "array",
                    type: "number",
                    varName: "myArray",
                    value: [1, 2, 3],
                    timestamp: undefined,
                    description: "Created array myArray with values [1,2,3].",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "len",
                    type: "number",
                    value: 3,
                    timestamp: undefined,
                    description: "Set variable len to 3.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode.trim());

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should correctly process linked list creation with size", () => {
        const pseudocode = `CREATE string array AS myArray WITH SIZE 10
            SET len to length of myArray
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "create",
                    dataStructure: "array",
                    type: "string",
                    varName: "myArray",
                    value: ["", "", "", "", "", "", "", "", "", ""],
                    timestamp: undefined,
                    description: "Created array myArray with size 10.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "len",
                    type: "number",
                    value: 10,
                    timestamp: undefined,
                    description: "Set variable len to 10.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode.trim());

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should handle multiple otherwise if conditions that all evaluate to false and execute a long otherwise block", () => {
        const pseudocode = `SET age TO number 10
            IF age > 65 THEN
                SET status TO string "Senior"
                SET discount TO string "20% on all items"
                SET membership TO string "Gold"
            OTHERWISE IF age > 40 THEN
                SET status TO string "Adult"
                SET discount TO string "10% on select items"
                SET membership TO string "Silver"
            OTHERWISE IF age > 18 THEN
                SET status TO string "Young Adult"
                SET discount TO string "5% on books"
                SET membership TO string "Bronze"
            OTHERWISE
                SET status TO string "Child"
                SET discount TO string "No discount"
                SET membership TO string "None"
                SET note TO string "Parental supervision required"
                SET activity TO string "Eligible for children's events"
            END IF`;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "age",
                    type: "number",
                    value: 10,
                    timestamp: undefined,
                    description: "Set variable age to 10.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "age > 65",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if age > 65.",
                },
                {
                    line: 6,
                    operation: "if",
                    condition: "age > 40",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if age > 40.",
                },
                {
                    line: 10,
                    operation: "if",
                    condition: "age > 18",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if age > 18.",
                },
                {
                    line: 15,
                    operation: "set",
                    varName: "status",
                    type: "string",
                    value: "Child",
                    timestamp: undefined,
                    description: "Set variable status to Child.",
                },
                {
                    line: 16,
                    operation: "set",
                    varName: "discount",
                    type: "string",
                    value: "No discount",
                    timestamp: undefined,
                    description: "Set variable discount to No discount.",
                },
                {
                    line: 17,
                    operation: "set",
                    varName: "membership",
                    type: "string",
                    value: "None",
                    timestamp: undefined,
                    description: "Set variable membership to None.",
                },
                {
                    line: 18,
                    operation: "set",
                    varName: "note",
                    type: "string",
                    value: "Parental supervision required",
                    timestamp: undefined,
                    description:
                        "Set variable note to Parental supervision required.",
                },
                {
                    line: 19,
                    operation: "set",
                    varName: "activity",
                    type: "string",
                    value: "Eligible for children's events",
                    timestamp: undefined,
                    description:
                        "Set variable activity to Eligible for children's events.",
                },
                {
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                    description: "End of if statement.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);
        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should evaluate multiple otherwise if with a long if block", () => {
        const pseudocode = `SET temp TO number 15
            IF temp > 30 THEN
                SET state TO string "Hot"
                SET action TO string "Turn on AC"
            OTHERWISE IF temp > 20 THEN
                SET state TO string "Warm"
                SET action TO string "Open windows"
            OTHERWISE IF temp > 10 THEN
                SET state TO string "Cool"
                SET action TO string "Do nothing"
            OTHERWISE
                SET state TO string "Cold"
                SET action TO string "Turn on heater"
            END IF`;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "temp",
                    type: "number",
                    value: 15,
                    timestamp: undefined,
                    description: "Set variable temp to 15.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "temp > 30",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if temp > 30.",
                },
                {
                    line: 5,
                    operation: "if",
                    condition: "temp > 20",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if temp > 20.",
                },
                {
                    line: 8,
                    operation: "if",
                    condition: "temp > 10",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if temp > 10.",
                },
                {
                    line: 9,
                    operation: "set",
                    varName: "state",
                    type: "string",
                    value: "Cool",
                    timestamp: undefined,
                    description: "Set variable state to Cool.",
                },
                {
                    line: 10,
                    operation: "set",
                    varName: "action",
                    type: "string",
                    value: "Do nothing",
                    timestamp: undefined,
                    description: "Set variable action to Do nothing.",
                },
                {
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                    description: "End of if statement.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);
        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });
    it("should handle if with no true condition and no otherwise block", () => {
        const pseudocode = `SET score TO number 65
            IF score > 90 THEN
                SET grade TO string "A"
            OTHERWISE IF score > 80 THEN
                SET grade TO string "B"
            END IF`;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "score",
                    type: "number",
                    value: 65,
                    timestamp: undefined,
                    description: "Set variable score to 65.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "score > 90",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if score > 90.",
                },
                {
                    line: 4,
                    operation: "if",
                    condition: "score > 80",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if score > 80.",
                },
                {
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                    description: "End of if statement.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);
        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });
    it("should correctly evaluate if with multiple otherwise if conditions and a big otherwise block", () => {
        const pseudocode = `SET x TO number 25
            IF x > 50 THEN
                SET response TO string "Greater than 50"
                SET detail TO string "High range"
            OTHERWISE IF x > 30 THEN
                SET response TO string "Greater than 30 but less than or equal to 50"
                SET detail TO string "Mid range"
            OTHERWISE
                SET response TO string "30 or less"
                SET detail TO string "Low range"
                SET note TO string "Consideration needed"
            END IF`;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 25,
                    timestamp: undefined,
                    description: "Set variable x to 25.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x > 50",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if x > 50.",
                },
                {
                    line: 5,
                    operation: "if",
                    condition: "x > 30",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if x > 30.",
                },
                {
                    line: 9,
                    operation: "set",
                    varName: "response",
                    type: "string",
                    value: "30 or less",
                    timestamp: undefined,
                    description: "Set variable response to 30 or less.",
                },
                {
                    line: 10,
                    operation: "set",
                    varName: "detail",
                    type: "string",
                    value: "Low range",
                    timestamp: undefined,
                    description: "Set variable detail to Low range.",
                },
                {
                    line: 11,
                    operation: "set",
                    varName: "note",
                    type: "string",
                    value: "Consideration needed",
                    timestamp: undefined,
                    description: "Set variable note to Consideration needed.",
                },
                {
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                    description: "End of if statement.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);
        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should handle simple if condition", () => {
        const pseudocode = `SET x TO number 5
            IF x < 10 THEN
                SET result TO string "Less than 10"
            END IF`;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 5,
                    timestamp: undefined,
                    description: "Set variable x to 5.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x < 10",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x < 10.",
                },
                {
                    line: 3,
                    operation: "set",
                    varName: "result",
                    type: "string",
                    value: "Less than 10",
                    timestamp: undefined,
                    description: "Set variable result to Less than 10.",
                },
                {
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                    description: "End of if statement.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);
        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should evaluate nested if conditions", () => {
        const pseudocode = `SET num TO number 15
            IF num > 10 THEN
                IF num < 20 THEN
                    SET range TO string "Between 10 and 20"
                END IF
            END IF`;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "num",
                    type: "number",
                    value: 15,
                    timestamp: undefined,
                    description: "Set variable num to 15.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "num > 10",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if num > 10.",
                },
                {
                    line: 3,
                    operation: "if",
                    condition: "num < 20",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if num < 20.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "range",
                    type: "string",
                    value: "Between 10 and 20",
                    timestamp: undefined,
                    description: "Set variable range to Between 10 and 20.",
                },
                {
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                    description: "End of if statement.",
                },
                {
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                    description: "End of if statement.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);
        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should handle if with no true condition and an otherwise", () => {
        const pseudocode = `SET value TO number 5
            IF value > 10 THEN
                SET response TO string "Greater than 10"
            OTHERWISE
                SET response TO string "10 or less"
            END IF`;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "value",
                    type: "number",
                    value: 5,
                    timestamp: undefined,
                    description: "Set variable value to 5.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "value > 10",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if value > 10.",
                },
                {
                    line: 5,
                    operation: "set",
                    varName: "response",
                    type: "string",
                    value: "10 or less",
                    timestamp: undefined,
                    description: "Set variable response to 10 or less.",
                },
                {
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                    description: "End of if statement.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);
        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });
    it("should correctly evaluate if with multiple otherwise if conditions", () => {
        const pseudocode = `SET x TO number 10
            IF x > 20 THEN
                SET y TO string "Greater than 20"
            OTHERWISE IF x > 15 THEN
                SET y TO string "Greater than 15 but less than or equal to 20"
            OTHERWISE IF x > 10 THEN
                SET y TO string "Greater than 10 but less than or equal to 15"
            OTHERWISE
                SET y TO string "10 or less"
            END IF`;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 10,
                    timestamp: undefined,
                    description: "Set variable x to 10.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x > 20",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if x > 20.",
                },
                {
                    line: 4,
                    operation: "if",
                    condition: "x > 15",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if x > 15.",
                },
                {
                    line: 6,
                    operation: "if",
                    condition: "x > 10",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if x > 10.",
                },
                {
                    line: 9,
                    operation: "set",
                    varName: "y",
                    type: "string",
                    value: "10 or less",
                    timestamp: undefined,
                    description: "Set variable y to 10 or less.",
                },
                {
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                    description: "End of if statement.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should correctly evaluate if with otherwise if conditions", () => {
        const pseudocode = `SET x TO number 10
            IF x > 15 THEN
                SET y TO string "Greater than 15"
            OTHERWISE IF x > 5 THEN
                SET y TO string "Greater than 5 but less than or equal to 15"
            OTHERWISE
                SET y TO string "5 or less"
            END IF`;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 10,
                    timestamp: undefined,
                    description: "Set variable x to 10.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x > 15",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if x > 15.",
                },
                {
                    line: 4,
                    operation: "if",
                    condition: "x > 5",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x > 5.",
                },
                {
                    line: 5,
                    operation: "set",
                    varName: "y",
                    type: "string",
                    value: "Greater than 5 but less than or equal to 15",
                    timestamp: undefined,
                    description:
                        "Set variable y to Greater than 5 but less than or equal to 15.",
                },
                {
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                    description: "End of if statement.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should correctly evaluate a basic indexing operation", () => {
        const pseudocode = `SET myString TO "Hello, World!"
            SET firstCharacter TO CHARACTER AT 0 OF myString
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "myString",
                    type: "string",
                    value: "Hello, World!",
                    timestamp: undefined,
                    description: "Set variable myString to Hello, World!.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "firstCharacter",
                    type: "string",
                    value: {
                        operation: "get",
                        type: "string",
                        varName: "myString",
                        index: 0,
                        result: "H",
                    },
                    timestamp: undefined,
                    description: "Set variable firstCharacter to myString[0].",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should correctly evaluate indexing with a variable index", () => {
        const pseudocode = `SET index TO 0
            SET myString TO "Hello, World!"
            SET characterAtIndex TO CHARACTER AT index OF myString
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "index",
                    type: "number",
                    value: 0,
                    timestamp: undefined,
                    description: "Set variable index to 0.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "myString",
                    type: "string",
                    value: "Hello, World!",
                    timestamp: undefined,
                    description: "Set variable myString to Hello, World!.",
                },
                {
                    line: 3,
                    operation: "set",
                    varName: "characterAtIndex",
                    type: "string",
                    value: {
                        operation: "get",
                        type: "string",
                        varName: "myString",
                        index: 0,
                        result: "H",
                    },
                    timestamp: undefined,
                    description:
                        "Set variable characterAtIndex to myString[0].",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should correctly evaluate indexing at the end of the string", () => {
        const pseudocode = `SET myString TO "Hello, World!"
            SET lastCharacter TO CHARACTER AT LENGTH OF myString - 1 OF myString
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "myString",
                    type: "string",
                    value: "Hello, World!",
                    timestamp: undefined,
                    description: "Set variable myString to Hello, World!.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "lastCharacter",
                    type: "string",
                    value: {
                        operation: "get",
                        type: "string",
                        varName: "myString",
                        index: 12,
                        result: "!",
                    },
                    timestamp: undefined,
                    description: "Set variable lastCharacter to myString[12].",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should correctly evaluate indexing an empty string", () => {
        const pseudocode = `SET emptyString TO ""
            SET emptyIndex TO CHARACTER AT 0 OF emptyString
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "emptyString",
                    type: "string",
                    value: "",
                    timestamp: undefined,
                    description: "Set variable emptyString to .",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "emptyIndex",
                    type: "string",
                    value: {
                        operation: "get",
                        type: "string",
                        varName: "emptyString",
                        index: 0,
                        result: "",
                    },
                    timestamp: undefined,
                    description: "Set variable emptyIndex to emptyString[0].",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should correctly evaluate a basic indexing operation", () => {
        const pseudocode = `SET myString TO "Hello, World!"
            SET firstCharacter TO CHARACTER AT 0 OF myString
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "myString",
                    type: "string",
                    value: "Hello, World!",
                    timestamp: undefined,
                    description: "Set variable myString to Hello, World!.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "firstCharacter",
                    type: "string",
                    value: {
                        operation: "get",
                        type: "string",
                        varName: "myString",
                        index: 0,
                        result: "H",
                    },
                    timestamp: undefined,
                    description: "Set variable firstCharacter to myString[0].",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should correctly evaluate a length operation in a conditional statement", () => {
        const pseudocode = `SET myString TO string "Test String"
            IF LENGTH OF myString > 5 THEN
                PRINT "String is long enough"
            OTHERWISE
                PRINT "String is too short"
            END IF
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "myString",
                    type: "string",
                    value: "Test String",
                    timestamp: undefined,
                    description: "Set variable myString to Test String.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "11 > 5",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if 11 > 5.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: true,
                    varName: null,
                    literal: "String is long enough",
                    timestamp: undefined,
                    description: "Printed String is long enough.",
                },
                {
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                    description: "End of if statement.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should throw an error when attempting to calculate the length of an undeclared variable", () => {
        const pseudocode = `SET lengthOfUndefined TO LENGTH OF undefinedVariable
        `;

        expect(() => PseudocodeProcessor.process(pseudocode)).to.throw(
            "Variable 'undefinedVariable' is not declared. Ensure that 'undefinedVariable' is declared before it is used."
        );
    });
    it("should process a length operation on a variable within an expression correctly", () => {
        const pseudocode = `SET myString TO string "Hello, World!"
            SET halfLength TO LENGTH OF myString / 2
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "myString",
                    type: "string",
                    value: "Hello, World!",
                    timestamp: undefined,
                    description: "Set variable myString to Hello, World!.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "halfLength",
                    type: "number",
                    value: 6.5,
                    timestamp: undefined,
                    description: "Set variable halfLength to 13 / 2.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should process a LENGTH OF operation with a string", () => {
        const pseudocode = `SET myString TO string "Hello, World!"
            SET lengthOfString TO LENGTH OF myString
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "myString",
                    type: "string",
                    value: "Hello, World!",
                    timestamp: undefined,
                    description: "Set variable myString to Hello, World!.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "lengthOfString",
                    type: "number",
                    value: 13,
                    timestamp: undefined,
                    description: "Set variable lengthOfString to 13.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should process a LENGTH OF operation followed by a print statement", () => {
        const pseudocode = `SET myString TO string "abc"
            SET lengthOfString TO LENGTH OF myString
            PRINT lengthOfString
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "myString",
                    type: "string",
                    value: "abc",
                    timestamp: undefined,
                    description: "Set variable myString to abc.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "lengthOfString",
                    type: "number",
                    value: 3,
                    timestamp: undefined,
                    description: "Set variable lengthOfString to 3.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "lengthOfString",
                    literal: 3,
                    timestamp: undefined,
                    description: "Printed lengthOfString.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should return the entire string when start is 0 and end is the length of the string in substring operation", () => {
        const pseudocode = `SET myString TO string "Hello, World!"
            SET subStr TO substring of myString FROM 0 TO 13
            PRINT subStr
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "myString",
                    type: "string",
                    value: "Hello, World!",
                    timestamp: undefined,
                    description: "Set variable myString to Hello, World!.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "subStr",
                    type: "string",
                    value: {
                        operation: "substring",
                        source: "myString",
                        start: 0,
                        end: 13,
                        result: "Hello, World!",
                    },
                    timestamp: undefined,
                    description:
                        "Set variable subStr to a substring of myString from index 0 to 13.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "subStr",
                    literal: "Hello, World!",
                    timestamp: undefined,
                    description: "Printed subStr.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should return an empty string when start and end indices are identical in substring operation", () => {
        const pseudocode = `SET myString TO string "Hello, World!"
            SET subStr TO substring of myString FROM 5 TO 5
            PRINT subStr
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "myString",
                    type: "string",
                    value: "Hello, World!",
                    timestamp: undefined,
                    description: "Set variable myString to Hello, World!.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "subStr",
                    type: "string",
                    value: {
                        operation: "substring",
                        source: "myString",
                        start: 5,
                        end: 5,
                        result: "",
                    },
                    timestamp: undefined,
                    description:
                        "Set variable subStr to an empty string as start and end indices are identical.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "subStr",
                    literal: "",
                    timestamp: undefined,
                    description: "Printed subStr.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should throw an error for a substring operation with a non-numeric end index", () => {
        const pseudocode = `SET myString TO string "Hello, World!"
            SET subStr TO substring of myString FROM 5 TO "ten"
            PRINT subStr
        `;

        expect(() => PseudocodeProcessor.process(pseudocode)).to.throw(
            "Invalid substring operation: 'start' and 'end' indices must be numeric."
        );
    });

    it("should throw an error for a substring operation with a non-numeric start index", () => {
        const pseudocode = `SET myString TO string "Hello, World!"
            SET subStr TO substring of myString FROM "five" TO 10
            PRINT subStr
        `;

        expect(() => PseudocodeProcessor.process(pseudocode)).to.throw(
            "Invalid substring operation: 'start' and 'end' indices must be numeric."
        );
    });

    it("should throw an error for a substring operation where start index is greater than end index", () => {
        const pseudocode = `SET myString TO string "Hello, World!"
            SET subStr TO substring of myString FROM 5 TO 2
            PRINT subStr
        `;

        expect(() => PseudocodeProcessor.process(pseudocode)).to.throw(
            "Invalid substring operation: 'start' index (5) cannot be greater than 'end' index (2)."
        );
    });

    it("should throw an error for a substring operation with a negative start index", () => {
        const pseudocode = `SET myString TO string "Hello, World!"
            SET subStr TO substring of myString FROM -1 TO 5
            PRINT subStr
        `;

        expect(() => PseudocodeProcessor.process(pseudocode)).to.throw(
            "Invalid substring operation: 'start' index cannot be negative."
        );
    });

    it("should process a substring operation with end index beyond string length correctly", () => {
        const pseudocode = `SET myString TO string "Hello"
            SET subStr TO substring of myString FROM 1 TO 10
            PRINT subStr
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "myString",
                    type: "string",
                    value: "Hello",
                    timestamp: undefined,
                    description: "Set variable myString to Hello.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "subStr",
                    type: "string",
                    value: {
                        operation: "substring",
                        source: "myString",
                        start: 1,
                        end: 10,
                        result: "ello",
                    },
                    timestamp: undefined,
                    description:
                        "Set variable subStr to a substring of myString from index 1 to 10.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "subStr",
                    literal: "ello",
                    timestamp: undefined,
                    description: "Printed subStr.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should process a substring operation with start index 0 correctly", () => {
        const pseudocode = `SET myString TO string "Hello, World!"
            SET subStr TO substring of myString FROM 0 TO 5
            PRINT subStr
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "myString",
                    type: "string",
                    value: "Hello, World!",
                    timestamp: undefined,
                    description: "Set variable myString to Hello, World!.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "subStr",
                    type: "string",
                    value: {
                        operation: "substring",
                        source: "myString",
                        start: 0,
                        end: 5,
                        result: "Hello",
                    },
                    timestamp: undefined,
                    description:
                        "Set variable subStr to a substring of myString from index 0 to 5.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "subStr",
                    literal: "Hello",
                    timestamp: undefined,
                    description: "Printed subStr.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should process a substring operation with variable start and end indices correctly", () => {
        const pseudocode = `SET myString TO string "Hello, World!"
            SET startIndex TO number 7
            SET endIndex TO number 12
            SET subStr TO substring of myString FROM startIndex TO endIndex
            PRINT subStr
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "myString",
                    type: "string",
                    value: "Hello, World!",
                    timestamp: undefined,
                    description: "Set variable myString to Hello, World!.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "startIndex",
                    type: "number",
                    value: 7,
                    timestamp: undefined,
                    description: "Set variable startIndex to 7.",
                },
                {
                    line: 3,
                    operation: "set",
                    varName: "endIndex",
                    type: "number",
                    value: 12,
                    timestamp: undefined,
                    description: "Set variable endIndex to 12.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "subStr",
                    type: "string",
                    value: {
                        end: 12,
                        operation: "substring",
                        result: "World",
                        source: "myString",
                        start: 7,
                    },
                    timestamp: undefined,
                    description:
                        "Set variable subStr to a substring of myString from index 7 to 12.",
                },
                {
                    line: 5,
                    operation: "print",
                    isLiteral: false,
                    varName: "subStr",
                    literal: "World",
                    timestamp: undefined,
                    description: "Printed subStr.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should process nested conditional logic with numeric comparisons correctly", () => {
        const pseudocode = `SET x TO number 3
            SET y TO number 100
            SET z TO number 42
            SET max TO number 0
            IF x IS greater THAN y THEN
                SET max TO x
            OTHERWISE
                SET max TO y
            END IF
            IF z IS greater THAN max THEN
                SET max TO z
            END IF
            PRINT max
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 3,
                    timestamp: undefined,
                    description: "Set variable x to 3.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "y",
                    type: "number",
                    value: 100,
                    timestamp: undefined,
                    description: "Set variable y to 100.",
                },
                {
                    line: 3,
                    operation: "set",
                    varName: "z",
                    type: "number",
                    value: 42,
                    timestamp: undefined,
                    description: "Set variable z to 42.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "max",
                    type: "number",
                    value: 0,
                    timestamp: undefined,
                    description: "Set variable max to 0.",
                },
                {
                    line: 5,
                    operation: "if",
                    condition: "x > y",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if x > y.",
                },
                {
                    line: 8,
                    operation: "set",
                    varName: "max",
                    type: "number",
                    value: 100,
                    timestamp: undefined,
                    description: "Set variable max to 100.",
                },
                {
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                    description: "End of if statement.",
                },
                {
                    line: 10,
                    operation: "if",
                    condition: "z > max",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if z > max.",
                },
                {
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                    description: "End of if statement.",
                },
                {
                    line: 13,
                    operation: "print",
                    isLiteral: false,
                    varName: "max",
                    literal: 100,
                    timestamp: undefined,
                    description: "Printed max.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should process substring operation correctly", () => {
        const pseudocode = `SET myString TO string "Hello, World!"
            SET subStr TO substring of myString FROM 7 TO 12
            PRINT subStr
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "myString",
                    type: "string",
                    value: "Hello, World!",
                    timestamp: undefined,
                    description: "Set variable myString to Hello, World!.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "subStr",
                    type: "string",
                    value: {
                        operation: "substring",
                        source: "myString",
                        start: 7,
                        end: 12,
                        result: "World",
                    },
                    timestamp: undefined,
                    description:
                        "Set variable subStr to a substring of myString from index 7 to 12.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "subStr",
                    literal: "World",
                    timestamp: undefined,
                    description: "Printed subStr.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should process 'display' as 'print' for a variable correctly", () => {
        const pseudocode = `SET x to number 10
            DISPLAY x
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 10,
                    timestamp: undefined,
                    description: "Set variable x to 10.",
                },
                {
                    line: 2,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 10,
                    timestamp: undefined,
                    description: "Printed x.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should process conditions with multiple NOT operators correctly", () => {
        const pseudocode = `SET p TO true
        SET q TO false
        IF NOT p AND NOT q THEN
            PRINT "Both are false"
        OTHERWISE
            PRINT "At least one is true"
        END IF
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "p",
                    type: "boolean",
                    value: true,
                    timestamp: undefined,
                    description: "Set variable p to true.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "q",
                    type: "boolean",
                    value: false,
                    timestamp: undefined,
                    description: "Set variable q to false.",
                },
                {
                    line: 3,
                    operation: "if",
                    condition: "!p && !q",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if !p && !q.",
                },
                {
                    line: 6,
                    operation: "print",
                    isLiteral: true,
                    varName: null,
                    literal: "At least one is true",
                    timestamp: undefined,
                    description: "Printed At least one is true.",
                },
                {
                    description: "End of if statement.",
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should process nested if statements followed by a calculation and another if statement correctly", () => {
        const pseudocode = `SET x to number 15
            SET y to number 10
            IF x is greater than y THEN
                IF x is less than 20 THEN
                    PRINT "x is between y and 20"
                END IF
            END IF
            SET z to x + y
            IF z is equal to 25 THEN
                PRINT "z is 25"
            END IF
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 15,
                    timestamp: undefined,
                    description: "Set variable x to 15.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "y",
                    type: "number",
                    value: 10,
                    timestamp: undefined,
                    description: "Set variable y to 10.",
                },
                {
                    line: 3,
                    operation: "if",
                    condition: "x > y",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x > y.",
                },
                {
                    line: 4,
                    operation: "if",
                    condition: "x < 20",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x < 20.",
                },
                {
                    line: 5,
                    operation: "print",
                    isLiteral: true,
                    varName: null,
                    literal: "x is between y and 20",
                    timestamp: undefined,
                    description: "Printed x is between y and 20.",
                },
                {
                    description: "End of if statement.",
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                },
                {
                    description: "End of if statement.",
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                },
                {
                    line: 8,
                    operation: "set",
                    varName: "z",
                    type: "number",
                    value: 25,
                    timestamp: undefined,
                    description: "Set variable z to x + y.",
                },
                {
                    line: 9,
                    operation: "if",
                    condition: "z == 25",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if z == 25.",
                },
                {
                    line: 10,
                    operation: "print",
                    isLiteral: true,
                    varName: null,
                    literal: "z is 25",
                    timestamp: undefined,
                    description: "Printed z is 25.",
                },
                {
                    description: "End of if statement.",
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should process nested if statements followed by normal pseudocode and another if statement correctly", () => {
        const pseudocode = `SET x to number 10
            SET y to number 20
            IF x is greater than 5 THEN
                IF y is less than 25 THEN
                    PRINT "y is less than 25"
                END IF
            END IF
            PRINT "This is a normal statement"
            IF y is equal to 20 THEN
                PRINT "y is equal to 20"
            END IF
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 10,
                    timestamp: undefined,
                    description: "Set variable x to 10.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "y",
                    type: "number",
                    value: 20,
                    timestamp: undefined,
                    description: "Set variable y to 20.",
                },
                {
                    line: 3,
                    operation: "if",
                    condition: "x > 5",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x > 5.",
                },
                {
                    line: 4,
                    operation: "if",
                    condition: "y < 25",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if y < 25.",
                },
                {
                    line: 5,
                    operation: "print",
                    isLiteral: true,
                    varName: null,
                    literal: "y is less than 25",
                    timestamp: undefined,
                    description: "Printed y is less than 25.",
                },
                {
                    description: "End of if statement.",
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                },
                {
                    description: "End of if statement.",
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                },
                {
                    line: 8,
                    operation: "print",
                    isLiteral: true,
                    varName: null,
                    literal: "This is a normal statement",
                    timestamp: undefined,
                    description: "Printed This is a normal statement.",
                },
                {
                    line: 9,
                    operation: "if",
                    condition: "y == 20",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if y == 20.",
                },
                {
                    line: 10,
                    operation: "print",
                    isLiteral: true,
                    varName: null,
                    literal: "y is equal to 20",
                    timestamp: undefined,
                    description: "Printed y is equal to 20.",
                },
                {
                    description: "End of if statement.",
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should process nested if-otherwise with otherwise on outer if correctly", () => {
        const pseudocode = `SET x to number 20
            SET y to number 5
            IF x is greater than 10 THEN
                IF y is greater than 10 THEN
                    PRINT "y is greater than 10"
                OTHERWISE
                    PRINT "y is 10 or less"
                END IF
            OTHERWISE
                PRINT "x is 10 or less"
            END IF
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 20,
                    timestamp: undefined,
                    description: "Set variable x to 20.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "y",
                    type: "number",
                    value: 5,
                    timestamp: undefined,
                    description: "Set variable y to 5.",
                },
                {
                    line: 3,
                    operation: "if",
                    condition: "x > 10",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x > 10.",
                },
                {
                    line: 4,
                    operation: "if",
                    condition: "y > 10",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if y > 10.",
                },
                {
                    line: 7,
                    operation: "print",
                    isLiteral: true,
                    varName: null,
                    literal: "y is 10 or less",
                    timestamp: undefined,
                    description: "Printed y is 10 or less.",
                },
                {
                    description: "End of if statement.",
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                },
                {
                    description: "End of if statement.",
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should process nested if statements with otherwise correctly", () => {
        const pseudocode = `SET x to number 5
            IF x is greater than 10 THEN
                PRINT "x is greater than 10"
            OTHERWISE
                IF x is greater than 3 THEN
                    PRINT "x is greater than 3 but not greater than 10"
                OTHERWISE
                    PRINT "x is 3 or less"
                END IF
            END IF
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 5,
                    timestamp: undefined,
                    description: "Set variable x to 5.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x > 10",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if x > 10.",
                },
                {
                    line: 5,
                    operation: "if",
                    condition: "x > 3",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x > 3.",
                },
                {
                    line: 6,
                    operation: "print",
                    isLiteral: true,
                    varName: null,
                    literal: "x is greater than 3 but not greater than 10",
                    timestamp: undefined,
                    description:
                        "Printed x is greater than 3 but not greater than 10.",
                },
                {
                    description: "End of if statement.",
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                },
                {
                    description: "End of if statement.",
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should process complex nested if-otherwise statements with multiple levels correctly", () => {
        const pseudocode = `SET a to number 5
            SET b to number 15
            IF a is less than 10 THEN
                IF b is greater than 10 THEN
                    PRINT "b is greater than 10"
                    IF b is less than 20 THEN
                        PRINT "b is less than 20"
                    OTHERWISE
                        PRINT "b is 20 or more"
                    END IF
                OTHERWISE
                    PRINT "b is 10 or less"
                END IF
            END IF
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "a",
                    type: "number",
                    value: 5,
                    timestamp: undefined,
                    description: "Set variable a to 5.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "b",
                    type: "number",
                    value: 15,
                    timestamp: undefined,
                    description: "Set variable b to 15.",
                },
                {
                    line: 3,
                    operation: "if",
                    condition: "a < 10",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if a < 10.",
                },
                {
                    line: 4,
                    operation: "if",
                    condition: "b > 10",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if b > 10.",
                },
                {
                    line: 5,
                    operation: "print",
                    isLiteral: true,
                    varName: null,
                    literal: "b is greater than 10",
                    timestamp: undefined,
                    description: "Printed b is greater than 10.",
                },
                {
                    line: 6,
                    operation: "if",
                    condition: "b < 20",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if b < 20.",
                },
                {
                    line: 7,
                    operation: "print",
                    isLiteral: true,
                    varName: null,
                    literal: "b is less than 20",
                    timestamp: undefined,
                    description: "Printed b is less than 20.",
                },
                {
                    description: "End of if statement.",
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                },
                {
                    description: "End of if statement.",
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                },
                {
                    description: "End of if statement.",
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should process nested if-otherwise statements correctly", () => {
        const pseudocode = `SET x to number 20
            IF x is greater than 10 THEN
                IF x is less than 30 THEN
                    PRINT "x is between 10 and 30"
                OTHERWISE
                    PRINT "x is 30 or more"
                END IF
            END IF
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 20,
                    timestamp: undefined,
                    description: "Set variable x to 20.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x > 10",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x > 10.",
                },
                {
                    line: 3,
                    operation: "if",
                    condition: "x < 30",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x < 30.",
                },
                {
                    line: 4,
                    operation: "print",
                    isLiteral: true,
                    varName: null,
                    literal: "x is between 10 and 30",
                    timestamp: undefined,
                    description: "Printed x is between 10 and 30.",
                },
                {
                    description: "End of if statement.",
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                },
                {
                    description: "End of if statement.",
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should declare two string variables and concatenate them", () => {
        const pseudocode = `SET firstName TO "John"
            SET lastName TO "Doe"
            SET fullName TO firstName + " " + lastName
            PRINT fullName
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "firstName",
                    type: "string",
                    value: "John",
                    timestamp: undefined,
                    description: "Set variable firstName to John.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "lastName",
                    type: "string",
                    value: "Doe",
                    timestamp: undefined,
                    description: "Set variable lastName to Doe.",
                },
                {
                    line: 3,
                    operation: "set",
                    varName: "fullName",
                    type: "string",
                    value: "John Doe",
                    timestamp: undefined,
                    description: "Set variable fullName to John Doe.",
                },
                {
                    line: 4,
                    operation: "print",
                    isLiteral: false,
                    varName: "fullName",
                    literal: "John Doe",
                    timestamp: undefined,
                    description: "Printed fullName.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });
    it("should process NOT operator correctly", () => {
        const pseudocode = `SET isTrue TO true
            IF NOT isTrue THEN 
                PRINT "isTrue is false" 
            END IF`;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "isTrue",
                    type: "boolean",
                    value: true,
                    timestamp: undefined,
                    description: "Set variable isTrue to true.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "!isTrue",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if !isTrue.",
                },
                {
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                    description: "End of if statement.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });
    it("should process setting a variable to a boolean and using it in a conditional", () => {
        writeTestNumber(2);

        const pseudocode = `SET isTrue TO boolean true
        IF isTrue THEN
            PRINT "Boolean is true"
        OTHERWISE
            PRINT "Boolean is false"
        END IF
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "isTrue",
                    type: "boolean",
                    value: true,
                    timestamp: undefined,
                    description: "Set variable isTrue to true.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "isTrue",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if isTrue.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: true,
                    varName: null,
                    literal: "Boolean is true",
                    timestamp: undefined,
                    description: "Printed Boolean is true.",
                },
                {
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                    description: "End of if statement.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });
    it("should process complex boolean logic correctly", () => {
        const pseudocode = `SET isTrue TO true
            SET isFalse TO false
            IF isTrue OR (isFalse AND NOT isTrue) THEN 
                PRINT "Complex Condition Met" 
            OTHERWISE 
                PRINT "Complex Condition Not Met" 
            END IF
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "isTrue",
                    type: "boolean",
                    value: true,
                    timestamp: undefined,
                    description: "Set variable isTrue to true.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "isFalse",
                    type: "boolean",
                    value: false,
                    timestamp: undefined,
                    description: "Set variable isFalse to false.",
                },
                {
                    line: 3,
                    operation: "if",
                    condition: "isTrue || isFalse && !isTrue",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if isTrue || isFalse && !isTrue.",
                },
                {
                    line: 4,
                    operation: "print",
                    isLiteral: true,
                    varName: null,
                    literal: "Complex Condition Met",
                    timestamp: undefined,
                    description: "Printed Complex Condition Met.",
                },
                {
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                    description: "End of if statement.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should handle boolean expressions with mixed operators correctly", () => {
        const pseudocode = `SET isTrue TO true
            SET isFalse TO false
            IF isTrue AND NOT isFalse THEN 
                PRINT "Correct" 
            OTHERWISE 
                PRINT "Incorrect" 
            END IF
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "isTrue",
                    type: "boolean",
                    value: true,
                    timestamp: undefined,
                    description: "Set variable isTrue to true.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "isFalse",
                    type: "boolean",
                    value: false,
                    timestamp: undefined,
                    description: "Set variable isFalse to false.",
                },
                {
                    line: 3,
                    operation: "if",
                    condition: "isTrue && !isFalse",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if isTrue && !isFalse.",
                },
                {
                    line: 4,
                    operation: "print",
                    isLiteral: true,
                    varName: null,
                    literal: "Correct",
                    timestamp: undefined,
                    description: "Printed Correct.",
                },
                {
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                    description: "End of if statement.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });
    it("should process setting a variable to a boolean", () => {
        const pseudocode = `SET isTrue TO true
            SET isFalse TO false
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "isTrue",
                    type: "boolean",
                    value: true,
                    timestamp: undefined,
                    description: "Set variable isTrue to true.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "isFalse",
                    type: "boolean",
                    value: false,
                    timestamp: undefined,
                    description: "Set variable isFalse to false.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should process boolean expressions correctly", () => {
        const pseudocode = `SET isTrue TO true
            SET isFalse TO false
            IF isTrue AND isFalse THEN 
                PRINT "Both are booleans" 
            END IF
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "isTrue",
                    type: "boolean",
                    value: true,
                    timestamp: undefined,
                    description: "Set variable isTrue to true.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "isFalse",
                    type: "boolean",
                    value: false,
                    timestamp: undefined,
                    description: "Set variable isFalse to false.",
                },
                {
                    line: 3,
                    operation: "if",
                    condition: "isTrue && isFalse",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if isTrue && isFalse.",
                },
                {
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                    description: "End of if statement.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should process setting a variable to a string and print it", () => {
        writeTestNumber(1);

        const pseudocode = `SET myVar TO "Hello, World!"
        PRINT myVar
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "myVar",
                    type: "string",
                    value: "Hello, World!",
                    timestamp: undefined,
                    description: "Set variable myVar to Hello, World!.",
                },
                {
                    line: 2,
                    operation: "print",
                    isLiteral: false,
                    varName: "myVar",
                    literal: "Hello, World!",
                    timestamp: undefined,
                    description: "Printed myVar.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should process a 'LOOP UNTIL' statement with a conditional update inside correctly", () => {
        const pseudocode = `SET x TO 1
            LOOP UNTIL x >= 10
                PRINT x
                IF x < 5 THEN
                    SET x TO x + 2
                OTHERWISE
                    SET x TO x + 3
                END IF
            END LOOP`;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 1,
                    timestamp: undefined,
                    description: "Set variable x to 1.",
                },
                {
                    line: 2,
                    operation: "while",
                    condition: "x < 10",
                    timestamp: undefined,
                    description: "while loop with condition x < 10.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x < 10",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x < 10.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 1,
                    timestamp: undefined,
                    description: "Printed x.",
                },
                {
                    line: 4,
                    operation: "if",
                    condition: "x < 5",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x < 5.",
                },
                {
                    line: 5,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 3,
                    timestamp: undefined,
                    description: "Set variable x to x + 2.",
                },
                {
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                    description: "End of if statement.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x < 10",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x < 10.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 3,
                    timestamp: undefined,
                    description: "Printed x.",
                },
                {
                    line: 4,
                    operation: "if",
                    condition: "x < 5",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x < 5.",
                },
                {
                    line: 5,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 5,
                    timestamp: undefined,
                    description: "Set variable x to x + 2.",
                },
                {
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                    description: "End of if statement.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x < 10",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x < 10.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 5,
                    timestamp: undefined,
                    description: "Printed x.",
                },
                {
                    line: 4,
                    operation: "if",
                    condition: "x < 5",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if x < 5.",
                },
                {
                    line: 7,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 8,
                    timestamp: undefined,
                    description: "Set variable x to x + 3.",
                },
                {
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                    description: "End of if statement.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x < 10",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x < 10.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 8,
                    timestamp: undefined,
                    description: "Printed x.",
                },
                {
                    line: 4,
                    operation: "if",
                    condition: "x < 5",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if x < 5.",
                },
                {
                    line: 7,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 11,
                    timestamp: undefined,
                    description: "Set variable x to x + 3.",
                },
                {
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                    description: "End of if statement.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x < 10",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if x < 10.",
                },
                {
                    line: null,
                    operation: "loop_end",
                    timestamp: undefined,
                    description: "End of while loop",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);
        result.actionFrames.forEach((frame, index) => {
            frame.timestamp = expectedJson.actionFrames[index].timestamp;
        });
        expect(result).to.deep.equal(expectedJson);
    });

    it("should correctly process a while loop with multiple variables and operations", () => {
        const pseudocode = `SET x to number 5
            SET y to number 0
            WHILE x > 0
                PRINT x
                SET y to y + x
                SET x to x - 1
            END WHILE
            PRINT y`;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 5,
                    timestamp: undefined,
                    description: "Set variable x to 5.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "y",
                    type: "number",
                    value: 0,
                    timestamp: undefined,
                    description: "Set variable y to 0.",
                },
                {
                    line: 3,
                    operation: "while",
                    condition: "x > 0",
                    timestamp: undefined,
                    description: "while loop with condition x > 0.",
                },
                {
                    line: 3,
                    operation: "if",
                    condition: "x > 0",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x > 0.",
                },
                {
                    line: 4,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 5,
                    timestamp: undefined,
                    description: "Printed x.",
                },
                {
                    line: 5,
                    operation: "set",
                    varName: "y",
                    type: "number",
                    value: 5,
                    timestamp: undefined,
                    description: "Set variable y to y + x.",
                },
                {
                    line: 6,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 4,
                    timestamp: undefined,
                    description: "Set variable x to x - 1.",
                },
                {
                    line: 3,
                    operation: "if",
                    condition: "x > 0",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x > 0.",
                },
                {
                    line: 4,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 4,
                    timestamp: undefined,
                    description: "Printed x.",
                },
                {
                    line: 5,
                    operation: "set",
                    varName: "y",
                    type: "number",
                    value: 9,
                    timestamp: undefined,
                    description: "Set variable y to y + x.",
                },
                {
                    line: 6,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 3,
                    timestamp: undefined,
                    description: "Set variable x to x - 1.",
                },
                {
                    line: 3,
                    operation: "if",
                    condition: "x > 0",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x > 0.",
                },
                {
                    line: 4,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 3,
                    timestamp: undefined,
                    description: "Printed x.",
                },
                {
                    line: 5,
                    operation: "set",
                    varName: "y",
                    type: "number",
                    value: 12,
                    timestamp: undefined,
                    description: "Set variable y to y + x.",
                },
                {
                    line: 6,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 2,
                    timestamp: undefined,
                    description: "Set variable x to x - 1.",
                },
                {
                    line: 3,
                    operation: "if",
                    condition: "x > 0",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x > 0.",
                },
                {
                    line: 4,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 2,
                    timestamp: undefined,
                    description: "Printed x.",
                },
                {
                    line: 5,
                    operation: "set",
                    varName: "y",
                    type: "number",
                    value: 14,
                    timestamp: undefined,
                    description: "Set variable y to y + x.",
                },
                {
                    line: 6,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 1,
                    timestamp: undefined,
                    description: "Set variable x to x - 1.",
                },
                {
                    line: 3,
                    operation: "if",
                    condition: "x > 0",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x > 0.",
                },
                {
                    line: 4,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 1,
                    timestamp: undefined,
                    description: "Printed x.",
                },
                {
                    line: 5,
                    operation: "set",
                    varName: "y",
                    type: "number",
                    value: 15,
                    timestamp: undefined,
                    description: "Set variable y to y + x.",
                },
                {
                    line: 6,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 0,
                    timestamp: undefined,
                    description: "Set variable x to x - 1.",
                },
                {
                    line: 3,
                    operation: "if",
                    condition: "x > 0",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if x > 0.",
                },
                {
                    line: null,
                    operation: "loop_end",
                    timestamp: undefined,
                    description: "End of while loop",
                },
                {
                    line: 8,
                    operation: "print",
                    isLiteral: false,
                    varName: "y",
                    literal: 15,
                    timestamp: undefined,
                    description: "Printed y.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should process a 'LOOP FROM TO' followed by additional operations correctly", () => {
        const pseudocode = `SET sum TO 0
            LOOP i FROM 1 TO 3
                PRINT i
                SET sum TO sum + i
            END LOOP
            PRINT sum
            SET sum TO sum * 2
            PRINT sum`;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "sum",
                    type: "number",
                    value: 0,
                    timestamp: undefined,
                    description: "Set variable sum to 0.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 1,
                    timestamp: undefined,
                    description: "Set variable i to 1.",
                },
                {
                    line: 2,
                    operation: "loop_from_to",
                    condition: "i <= 3",
                    timestamp: undefined,
                    description: "loop from_to loop with condition i <= 3.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "i <= 3",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if i <= 3.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "i",
                    literal: 1,
                    timestamp: undefined,
                    description: "Printed i.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "sum",
                    type: "number",
                    value: 1,
                    timestamp: undefined,
                    description: "Set variable sum to sum + i.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 2,
                    timestamp: undefined,
                    description: "Set variable i to 2.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "i <= 3",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if i <= 3.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "i",
                    literal: 2,
                    timestamp: undefined,
                    description: "Printed i.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "sum",
                    type: "number",
                    value: 3,
                    timestamp: undefined,
                    description: "Set variable sum to sum + i.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 3,
                    timestamp: undefined,
                    description: "Set variable i to 3.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "i <= 3",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if i <= 3.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "i",
                    literal: 3,
                    timestamp: undefined,
                    description: "Printed i.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "sum",
                    type: "number",
                    value: 6,
                    timestamp: undefined,
                    description: "Set variable sum to sum + i.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 4,
                    timestamp: undefined,
                    description: "Set variable i to 4.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "i <= 3",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if i <= 3.",
                },
                {
                    line: null,
                    operation: "loop_end",
                    timestamp: undefined,
                    description: "End of loop from_to loop",
                },
                {
                    line: 6,
                    operation: "print",
                    isLiteral: false,
                    varName: "sum",
                    literal: 6,
                    timestamp: undefined,
                    description: "Printed sum.",
                },
                {
                    line: 7,
                    operation: "set",
                    varName: "sum",
                    type: "number",
                    value: 12,
                    timestamp: undefined,
                    description: "Set variable sum to sum * 2.",
                },
                {
                    line: 8,
                    operation: "print",
                    isLiteral: false,
                    varName: "sum",
                    literal: 12,
                    timestamp: undefined,
                    description: "Printed sum.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);
        result.actionFrames.forEach((frame, index) => {
            frame.timestamp = expectedJson.actionFrames[index].timestamp;
        });
        expect(result).to.deep.equal(expectedJson);
    });

    it("should process a 'LOOP FROM TO' with an additional operation correctly", () => {
        const pseudocode = `SET sum TO 0
            LOOP i FROM 1 TO 5
                PRINT i
                SET sum TO sum + i
            END LOOP`;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "sum",
                    type: "number",
                    value: 0,
                    timestamp: undefined,
                    description: "Set variable sum to 0.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 1,
                    timestamp: undefined,
                    description: "Set variable i to 1.",
                },
                {
                    line: 2,
                    operation: "loop_from_to",
                    condition: "i <= 5",
                    timestamp: undefined,
                    description: "loop from_to loop with condition i <= 5.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "i <= 5",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if i <= 5.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "i",
                    literal: 1,
                    timestamp: undefined,
                    description: "Printed i.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "sum",
                    type: "number",
                    value: 1,
                    timestamp: undefined,
                    description: "Set variable sum to sum + i.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 2,
                    timestamp: undefined,
                    description: "Set variable i to 2.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "i <= 5",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if i <= 5.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "i",
                    literal: 2,
                    timestamp: undefined,
                    description: "Printed i.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "sum",
                    type: "number",
                    value: 3,
                    timestamp: undefined,
                    description: "Set variable sum to sum + i.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 3,
                    timestamp: undefined,
                    description: "Set variable i to 3.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "i <= 5",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if i <= 5.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "i",
                    literal: 3,
                    timestamp: undefined,
                    description: "Printed i.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "sum",
                    type: "number",
                    value: 6,
                    timestamp: undefined,
                    description: "Set variable sum to sum + i.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 4,
                    timestamp: undefined,
                    description: "Set variable i to 4.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "i <= 5",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if i <= 5.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "i",
                    literal: 4,
                    timestamp: undefined,
                    description: "Printed i.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "sum",
                    type: "number",
                    value: 10,
                    timestamp: undefined,
                    description: "Set variable sum to sum + i.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 5,
                    timestamp: undefined,
                    description: "Set variable i to 5.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "i <= 5",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if i <= 5.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "i",
                    literal: 5,
                    timestamp: undefined,
                    description: "Printed i.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "sum",
                    type: "number",
                    value: 15,
                    timestamp: undefined,
                    description: "Set variable sum to sum + i.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 6,
                    timestamp: undefined,
                    description: "Set variable i to 6.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "i <= 5",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if i <= 5.",
                },
                {
                    line: null,
                    operation: "loop_end",
                    timestamp: undefined,
                    description: "End of loop from_to loop",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);
        result.actionFrames.forEach((frame, index) => {
            frame.timestamp = expectedJson.actionFrames[index].timestamp;
        });
        expect(result).to.deep.equal(expectedJson);
    });

    it("should process a 'LOOP FROM TO' statement correctly", () => {
        const pseudocode = `LOOP i FROM 0 TO 5
                PRINT i
            END LOOP`;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 0,
                    timestamp: undefined,
                    description: "Set variable i to 0.",
                },
                {
                    line: 1,
                    operation: "loop_from_to",
                    condition: "i <= 5",
                    timestamp: undefined,
                    description: "loop from_to loop with condition i <= 5.",
                },
                {
                    line: 1,
                    operation: "if",
                    condition: "i <= 5",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if i <= 5.",
                },
                {
                    line: 2,
                    operation: "print",
                    isLiteral: false,
                    varName: "i",
                    literal: 0,
                    timestamp: undefined,
                    description: "Printed i.",
                },
                {
                    line: 1,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 1,
                    timestamp: undefined,
                    description: "Set variable i to 1.",
                },
                {
                    line: 1,
                    operation: "if",
                    condition: "i <= 5",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if i <= 5.",
                },
                {
                    line: 2,
                    operation: "print",
                    isLiteral: false,
                    varName: "i",
                    literal: 1,
                    timestamp: undefined,
                    description: "Printed i.",
                },
                {
                    line: 1,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 2,
                    timestamp: undefined,
                    description: "Set variable i to 2.",
                },
                {
                    line: 1,
                    operation: "if",
                    condition: "i <= 5",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if i <= 5.",
                },
                {
                    line: 2,
                    operation: "print",
                    isLiteral: false,
                    varName: "i",
                    literal: 2,
                    timestamp: undefined,
                    description: "Printed i.",
                },
                {
                    line: 1,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 3,
                    timestamp: undefined,
                    description: "Set variable i to 3.",
                },
                {
                    line: 1,
                    operation: "if",
                    condition: "i <= 5",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if i <= 5.",
                },
                {
                    line: 2,
                    operation: "print",
                    isLiteral: false,
                    varName: "i",
                    literal: 3,
                    timestamp: undefined,
                    description: "Printed i.",
                },
                {
                    line: 1,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 4,
                    timestamp: undefined,
                    description: "Set variable i to 4.",
                },
                {
                    line: 1,
                    operation: "if",
                    condition: "i <= 5",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if i <= 5.",
                },
                {
                    line: 2,
                    operation: "print",
                    isLiteral: false,
                    varName: "i",
                    literal: 4,
                    timestamp: undefined,
                    description: "Printed i.",
                },
                {
                    line: 1,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 5,
                    timestamp: undefined,
                    description: "Set variable i to 5.",
                },
                {
                    line: 1,
                    operation: "if",
                    condition: "i <= 5",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if i <= 5.",
                },
                {
                    line: 2,
                    operation: "print",
                    isLiteral: false,
                    varName: "i",
                    literal: 5,
                    timestamp: undefined,
                    description: "Printed i.",
                },
                {
                    line: 1,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 6,
                    timestamp: undefined,
                    description: "Set variable i to 6.",
                },
                {
                    line: 1,
                    operation: "if",
                    condition: "i <= 5",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if i <= 5.",
                },
                {
                    line: null,
                    operation: "loop_end",
                    timestamp: undefined,
                    description: "End of loop from_to loop",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);
        result.actionFrames.forEach((frame, index) => {
            frame.timestamp = expectedJson.actionFrames[index].timestamp;
        });
        expect(result).to.deep.equal(expectedJson);
    });

    it("should process a 'LOOP UNTIL' statement correctly", () => {
        const pseudocode = `SET x TO 10
            LOOP UNTIL x == 0
                PRINT x
                SET x TO x - 1
            END LOOP`;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 10,
                    timestamp: undefined,
                    description: "Set variable x to 10.",
                },
                {
                    line: 2,
                    operation: "while",
                    condition: "x != 0",
                    timestamp: undefined,
                    description: "while loop with condition x != 0.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x != 0",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x != 0.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 10,
                    timestamp: undefined,
                    description: "Printed x.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 9,
                    timestamp: undefined,
                    description: "Set variable x to x - 1.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x != 0",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x != 0.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 9,
                    timestamp: undefined,
                    description: "Printed x.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 8,
                    timestamp: undefined,
                    description: "Set variable x to x - 1.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x != 0",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x != 0.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 8,
                    timestamp: undefined,
                    description: "Printed x.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 7,
                    timestamp: undefined,
                    description: "Set variable x to x - 1.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x != 0",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x != 0.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 7,
                    timestamp: undefined,
                    description: "Printed x.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 6,
                    timestamp: undefined,
                    description: "Set variable x to x - 1.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x != 0",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x != 0.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 6,
                    timestamp: undefined,
                    description: "Printed x.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 5,
                    timestamp: undefined,
                    description: "Set variable x to x - 1.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x != 0",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x != 0.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 5,
                    timestamp: undefined,
                    description: "Printed x.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 4,
                    timestamp: undefined,
                    description: "Set variable x to x - 1.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x != 0",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x != 0.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 4,
                    timestamp: undefined,
                    description: "Printed x.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 3,
                    timestamp: undefined,
                    description: "Set variable x to x - 1.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x != 0",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x != 0.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 3,
                    timestamp: undefined,
                    description: "Printed x.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 2,
                    timestamp: undefined,
                    description: "Set variable x to x - 1.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x != 0",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x != 0.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 2,
                    timestamp: undefined,
                    description: "Printed x.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 1,
                    timestamp: undefined,
                    description: "Set variable x to x - 1.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x != 0",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x != 0.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 1,
                    timestamp: undefined,
                    description: "Printed x.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 0,
                    timestamp: undefined,
                    description: "Set variable x to x - 1.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x != 0",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if x != 0.",
                },
                {
                    line: null,
                    operation: "loop_end",
                    timestamp: undefined,
                    description: "End of while loop",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);
        result.actionFrames.forEach((frame, index) => {
            frame.timestamp = expectedJson.actionFrames[index].timestamp;
        });
        expect(result).to.deep.equal(expectedJson);
    });

    it("should correctly process a while loop with repeated if statements and loop_end", () => {
        const pseudocode = `SET x to number 5
        WHILE x > 0
            PRINT x
            SET x to x - 1
        END WHILE
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 5,
                    timestamp: undefined,
                    description: "Set variable x to 5.",
                },
                {
                    line: 2,
                    operation: "while",
                    condition: "x > 0",
                    timestamp: undefined,
                    description: "while loop with condition x > 0.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x > 0",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x > 0.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 5,
                    timestamp: undefined,
                    description: "Printed x.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 4,
                    timestamp: undefined,
                    description: "Set variable x to x - 1.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x > 0",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x > 0.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 4,
                    timestamp: undefined,
                    description: "Printed x.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 3,
                    timestamp: undefined,
                    description: "Set variable x to x - 1.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x > 0",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x > 0.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 3,
                    timestamp: undefined,
                    description: "Printed x.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 2,
                    timestamp: undefined,
                    description: "Set variable x to x - 1.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x > 0",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x > 0.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 2,
                    timestamp: undefined,
                    description: "Printed x.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 1,
                    timestamp: undefined,
                    description: "Set variable x to x - 1.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x > 0",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x > 0.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 1,
                    timestamp: undefined,
                    description: "Printed x.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 0,
                    timestamp: undefined,
                    description: "Set variable x to x - 1.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x > 0",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if x > 0.",
                },
                {
                    line: null,
                    operation: "loop_end",
                    timestamp: undefined,
                    description: "End of while loop",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });
    it("should process a 'FOR LOOP FROM TO' with traditional syntax correctly", () => {
        writeTestNumber(16);
        const pseudocode = `LOOP i FROM 0 TO 10
                PRINT i
            END LOOP`;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 0,
                    timestamp: undefined,
                    description: "Set variable i to 0.",
                },
                {
                    line: 1,
                    operation: "loop_from_to",
                    condition: "i <= 10",
                    timestamp: undefined,
                    description: "loop from_to loop with condition i <= 10.",
                },
                {
                    line: 1,
                    operation: "if",
                    condition: "i <= 10",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if i <= 10.",
                },
                {
                    line: 2,
                    operation: "print",
                    isLiteral: false,
                    varName: "i",
                    literal: 0,
                    timestamp: undefined,
                    description: "Printed i.",
                },
                {
                    line: 1,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 1,
                    timestamp: undefined,
                    description: "Set variable i to 1.",
                },
                {
                    line: 1,
                    operation: "if",
                    condition: "i <= 10",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if i <= 10.",
                },
                {
                    line: 2,
                    operation: "print",
                    isLiteral: false,
                    varName: "i",
                    literal: 1,
                    timestamp: undefined,
                    description: "Printed i.",
                },
                {
                    line: 1,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 2,
                    timestamp: undefined,
                    description: "Set variable i to 2.",
                },
                {
                    line: 1,
                    operation: "if",
                    condition: "i <= 10",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if i <= 10.",
                },
                {
                    line: 2,
                    operation: "print",
                    isLiteral: false,
                    varName: "i",
                    literal: 2,
                    timestamp: undefined,
                    description: "Printed i.",
                },
                {
                    line: 1,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 3,
                    timestamp: undefined,
                    description: "Set variable i to 3.",
                },
                {
                    line: 1,
                    operation: "if",
                    condition: "i <= 10",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if i <= 10.",
                },
                {
                    line: 2,
                    operation: "print",
                    isLiteral: false,
                    varName: "i",
                    literal: 3,
                    timestamp: undefined,
                    description: "Printed i.",
                },
                {
                    line: 1,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 4,
                    timestamp: undefined,
                    description: "Set variable i to 4.",
                },
                {
                    line: 1,
                    operation: "if",
                    condition: "i <= 10",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if i <= 10.",
                },
                {
                    line: 2,
                    operation: "print",
                    isLiteral: false,
                    varName: "i",
                    literal: 4,
                    timestamp: undefined,
                    description: "Printed i.",
                },
                {
                    line: 1,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 5,
                    timestamp: undefined,
                    description: "Set variable i to 5.",
                },
                {
                    line: 1,
                    operation: "if",
                    condition: "i <= 10",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if i <= 10.",
                },
                {
                    line: 2,
                    operation: "print",
                    isLiteral: false,
                    varName: "i",
                    literal: 5,
                    timestamp: undefined,
                    description: "Printed i.",
                },
                {
                    line: 1,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 6,
                    timestamp: undefined,
                    description: "Set variable i to 6.",
                },
                {
                    line: 1,
                    operation: "if",
                    condition: "i <= 10",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if i <= 10.",
                },
                {
                    line: 2,
                    operation: "print",
                    isLiteral: false,
                    varName: "i",
                    literal: 6,
                    timestamp: undefined,
                    description: "Printed i.",
                },
                {
                    line: 1,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 7,
                    timestamp: undefined,
                    description: "Set variable i to 7.",
                },
                {
                    line: 1,
                    operation: "if",
                    condition: "i <= 10",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if i <= 10.",
                },
                {
                    line: 2,
                    operation: "print",
                    isLiteral: false,
                    varName: "i",
                    literal: 7,
                    timestamp: undefined,
                    description: "Printed i.",
                },
                {
                    line: 1,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 8,
                    timestamp: undefined,
                    description: "Set variable i to 8.",
                },
                {
                    line: 1,
                    operation: "if",
                    condition: "i <= 10",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if i <= 10.",
                },
                {
                    line: 2,
                    operation: "print",
                    isLiteral: false,
                    varName: "i",
                    literal: 8,
                    timestamp: undefined,
                    description: "Printed i.",
                },
                {
                    line: 1,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 9,
                    timestamp: undefined,
                    description: "Set variable i to 9.",
                },
                {
                    line: 1,
                    operation: "if",
                    condition: "i <= 10",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if i <= 10.",
                },
                {
                    line: 2,
                    operation: "print",
                    isLiteral: false,
                    varName: "i",
                    literal: 9,
                    timestamp: undefined,
                    description: "Printed i.",
                },
                {
                    line: 1,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 10,
                    timestamp: undefined,
                    description: "Set variable i to 10.",
                },
                {
                    line: 1,
                    operation: "if",
                    condition: "i <= 10",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if i <= 10.",
                },
                {
                    line: 2,
                    operation: "print",
                    isLiteral: false,
                    varName: "i",
                    literal: 10,
                    timestamp: undefined,
                    description: "Printed i.",
                },
                {
                    line: 1,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 11,
                    timestamp: undefined,
                    description: "Set variable i to 11.",
                },
                {
                    line: 1,
                    operation: "if",
                    condition: "i <= 10",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if i <= 10.",
                },
                {
                    line: null,
                    operation: "loop_end",
                    timestamp: undefined,
                    description: "End of loop from_to loop",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);
        result.actionFrames.forEach((frame, index) => {
            frame.timestamp = expectedJson.actionFrames[index].timestamp;
        });
        expect(result).to.deep.equal(expectedJson);
    });

    it("should process complex pseudocode with if-else, array creation, and array insertion", () => {
        writeTestNumber(1);
        const pseudocode = `SET x to 10
        IF x is greater than 5 THEN
            PRINT "x is greater than 5"
        OTHERWISE
            PRINT "x is 5 or less"
        END IF
        CREATE number array as nums with values [1,2,3,4,5,6,7,8,9]
        CREATE string array as letters with values ["a","b","c","d","e","f","g"]
        INSERT 5 TO nums AT position 4
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 10,
                    timestamp: undefined,
                    description: "Set variable x to 10.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x > 5",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x > 5.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: true,
                    varName: null,
                    literal: "x is greater than 5",
                    timestamp: undefined,
                    description: "Printed x is greater than 5.",
                },
                {
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                    description: "End of if statement.",
                },
                {
                    line: 7,
                    operation: "create",
                    dataStructure: "array",
                    type: "number",
                    varName: "nums",
                    value: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    timestamp: undefined,
                    description:
                        "Created array nums with values [1,2,3,4,5,6,7,8,9].",
                },
                {
                    line: 8,
                    operation: "create",
                    dataStructure: "array",
                    type: "string",
                    varName: "letters",
                    value: ["a", "b", "c", "d", "e", "f", "g"],
                    timestamp: undefined,
                    description:
                        "Created array letters with values [a,b,c,d,e,f,g].",
                },
                {
                    line: 9,
                    operation: "add",
                    varName: "nums",
                    value: 5,
                    position: 4,
                    timestamp: undefined,
                    description: "Added 5 to array nums at position 4.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should process a simple variable declaration", () => {
        writeTestNumber(1);
        const pseudocode = `SET x to number 10
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 10,
                    timestamp: undefined,
                    description: "Set variable x to 10.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should process a simple if statement with print", () => {
        writeTestNumber(2);
        const pseudocode = `SET x to number 10
        IF x is greater than 5 THEN
            PRINT "x is greater than 5"
        END IF`;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 10,
                    timestamp: undefined,
                    description: "Set variable x to 10.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x > 5",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x > 5.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: true,
                    varName: null,
                    literal: "x is greater than 5",
                    timestamp: undefined,
                    description: "Printed x is greater than 5.",
                },
                {
                    description: "End of if statement.",
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should process array creation", () => {
        writeTestNumber(3);
        const pseudocode = `CREATE number array as numbers with values [0]
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "create",
                    dataStructure: "array",
                    type: "number",
                    varName: "numbers",
                    value: [0],
                    timestamp: undefined,
                    description: "Created array numbers with values [0].",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should process array operations correctly", () => {
        writeTestNumber(4);
        const pseudocode = `CREATE number array as numbers with values [0]
        INSERT 1 TO numbers AT position 1
        INSERT 2 TO numbers AT position 2
        INSERT 3 TO numbers AT position 3
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "create",
                    dataStructure: "array",
                    type: "number",
                    varName: "numbers",
                    value: [0],
                    timestamp: undefined,
                    description: "Created array numbers with values [0].",
                },
                {
                    line: 2,
                    operation: "add",
                    varName: "numbers",
                    value: 1,
                    position: 1,
                    timestamp: undefined,
                    description: "Added 1 to array numbers at position 1.",
                },
                {
                    line: 3,
                    operation: "add",
                    varName: "numbers",
                    value: 2,
                    position: 2,
                    timestamp: undefined,
                    description: "Added 2 to array numbers at position 2.",
                },
                {
                    line: 4,
                    operation: "add",
                    varName: "numbers",
                    value: 3,
                    position: 3,
                    timestamp: undefined,
                    description: "Added 3 to array numbers at position 3.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should process nested if statements correctly", () => {
        writeTestNumber(7);
        const pseudocode = `SET x to number 10
        SET y to number 5
        IF x is greater than 5 THEN
            IF y is less than 10 THEN
                PRINT "y is less than 10"
            END IF
        END IF
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 10,
                    timestamp: undefined,
                    description: "Set variable x to 10.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "y",
                    type: "number",
                    value: 5,
                    timestamp: undefined,
                    description: "Set variable y to 5.",
                },
                {
                    line: 3,
                    operation: "if",
                    condition: "x > 5",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x > 5.",
                },
                {
                    line: 4,
                    operation: "if",
                    condition: "y < 10",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if y < 10.",
                },
                {
                    line: 5,
                    operation: "print",
                    isLiteral: true,
                    varName: null,
                    literal: "y is less than 10",
                    timestamp: undefined,
                    description: "Printed y is less than 10.",
                },
                {
                    description: "End of if statement.",
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                },
                {
                    description: "End of if statement.",
                    line: null,
                    operation: "endif",
                    timestamp: undefined,
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
            if (frame.body) {
                frame.body.forEach((subFrame, subIndex) => {
                    subFrame.timestamp =
                        result.actionFrames[index].body[subIndex].timestamp;
                });
            }
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should process variable declarations with arithmetic expressions", () => {
        writeTestNumber(17);
        const pseudocode = `SET x to number 5
        SET y to x + 3
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 5,
                    timestamp: undefined,
                    description: "Set variable x to 5.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "y",
                    type: "number",
                    value: 8,
                    timestamp: undefined,
                    description: "Set variable y to x + 3.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });
    it("should process variable declarations with simple addition", () => {
        const pseudocode = `SET a to number 5
        SET b to number 10
        SET c to a + b
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "a",
                    type: "number",
                    value: 5,
                    timestamp: undefined,
                    description: "Set variable a to 5.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "b",
                    type: "number",
                    value: 10,
                    timestamp: undefined,
                    description: "Set variable b to 10.",
                },
                {
                    line: 3,
                    operation: "set",
                    varName: "c",
                    type: "number",
                    value: 15,
                    timestamp: undefined,
                    description: "Set variable c to a + b.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should process variable declarations with subtraction and multiplication", () => {
        const pseudocode = `SET x to number 20
        SET y to x - 5
        SET z to y * 2
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 20,
                    timestamp: undefined,
                    description: "Set variable x to 20.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "y",
                    type: "number",
                    value: 15,
                    timestamp: undefined,
                    description: "Set variable y to x - 5.",
                },
                {
                    line: 3,
                    operation: "set",
                    varName: "z",
                    type: "number",
                    value: 30,
                    timestamp: undefined,
                    description: "Set variable z to y * 2.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should process arithmetic with variables only", () => {
        const pseudocode = `SET x to number 10
        SET y to number 5
        SET z to x * y
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 10,
                    timestamp: undefined,
                    description: "Set variable x to 10.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "y",
                    type: "number",
                    value: 5,
                    timestamp: undefined,
                    description: "Set variable y to 5.",
                },
                {
                    line: 3,
                    operation: "set",
                    varName: "z",
                    type: "number",
                    value: 50,
                    timestamp: undefined,
                    description: "Set variable z to x * y.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should correctly process a while loop with repeated if statements and loop_end", () => {
        const pseudocode = `SET x to number 5
        WHILE x > 0
            PRINT x
            SET x to x - 1
        END WHILE
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 5,
                    timestamp: undefined,
                    description: "Set variable x to 5.",
                },
                {
                    line: 2,
                    operation: "while",
                    condition: "x > 0",
                    timestamp: undefined,
                    description: "while loop with condition x > 0.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x > 0",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x > 0.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 5,
                    timestamp: undefined,
                    description: "Printed x.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 4,
                    timestamp: undefined,
                    description: "Set variable x to x - 1.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x > 0",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x > 0.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 4,
                    timestamp: undefined,
                    description: "Printed x.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 3,
                    timestamp: undefined,
                    description: "Set variable x to x - 1.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x > 0",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x > 0.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 3,
                    timestamp: undefined,
                    description: "Printed x.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 2,
                    timestamp: undefined,
                    description: "Set variable x to x - 1.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x > 0",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x > 0.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 2,
                    timestamp: undefined,
                    description: "Printed x.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 1,
                    timestamp: undefined,
                    description: "Set variable x to x - 1.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x > 0",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x > 0.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 1,
                    timestamp: undefined,
                    description: "Printed x.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 0,
                    timestamp: undefined,
                    description: "Set variable x to x - 1.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x > 0",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if x > 0.",
                },
                {
                    line: null,
                    operation: "loop_end",
                    timestamp: undefined,
                    description: "End of while loop",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });
});
