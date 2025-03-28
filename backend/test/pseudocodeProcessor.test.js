import { expect } from "chai";
import PseudocodeProcessor from "../src/models/PseudocodeProcessor.js";
import fs from "fs";

function writeTestNumber(testNumber) {
    fs.appendFileSync("output.txt", `Test case ${testNumber}\n\n`);
}

describe("PseudocodeProcessor", () => {
    it("should process a function declaration pseudocode and convert it to the final JSON format", () => {
        const pseudocode = `
        DEFINE add_numbers WITH PARAMETERS (a, b)
            RETURN a + b
        END FUNCTION
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "define",
                    varName: "add_numbers",
                    params: ["a", "b"],
                    body: [
                        {
                            line: 2,
                            operation: "return",
                            value: {
                                left: "a",
                                operator: "+",
                                right: "b",
                            },
                            timestamp: undefined,
                            description: `Returned {"left":"a","operator":"+","right":"b"}.`,
                        },
                    ],
                    timestamp: undefined,
                    description:
                        "Defined function add_numbers with parameters a, b.",
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

    it("should process a 'LOOP UNTIL' statement with a conditional update inside correctly", () => {
        const pseudocode = `
            SET x TO 1
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
                    line: 8,
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
                    line: 8,
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
                    line: 8,
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
                    line: 8,
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
                    line: 9,
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
        const pseudocode = `
            SET x to number 5
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
                    line: 7,
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
        const pseudocode = `
            SET sum TO 0
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
                    line: 5,
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
        const pseudocode = `
            SET sum TO 0
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
                    line: 5,
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
                    line: 3,
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
        const pseudocode = `
            SET x TO 10
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
                    line: 5,
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
        const pseudocode = `
        SET x to number 5
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
                    literal: 5, // Reflecting the value of x at this point
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
                    literal: 4, // Reflecting the value of x at this point
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
                    literal: 3, // Reflecting the value of x at this point
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
                    literal: 2, // Reflecting the value of x at this point
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
                    literal: 1, // Reflecting the value of x at this point
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
                    line: 5,
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
        const pseudocode = `
            LOOP i FROM 0 TO 10
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
                    line: 3,
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
        const pseudocode = `
        SET x to 10
        IF x is greater than 5 THEN
            PRINT "x is greater than 5"
        OTHERWISE
            PRINT "x is 5 or less"
        END IF
        CREATE array as nums with [1,2,3,4,5,6,7,8,9]
        CREATE array as letters with ["a","b","c","d","e","f","g"]
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
                    line: 6,
                    operation: "endif",
                    timestamp: undefined,
                    description: "End of if statement.",
                },
                {
                    line: 7,
                    operation: "create_array",
                    varName: "nums",
                    value: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                    timestamp: undefined,
                    description: "Created array nums.",
                },
                {
                    line: 8,
                    operation: "create_array",
                    varName: "letters",
                    value: ["a", "b", "c", "d", "e", "f", "g"],
                    timestamp: undefined,
                    description: "Created array letters.",
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
                    line: 4,
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
        const pseudocode = `
        CREATE array as numbers with [0]
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "create_array",
                    varName: "numbers",
                    value: [0],
                    timestamp: undefined,
                    description: "Created array numbers.",
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
        const pseudocode = `
        CREATE array as numbers with [0]
        INSERT 1 TO numbers AT position 1
        INSERT 2 TO numbers AT position 2
        INSERT 3 TO numbers AT position 3
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "create_array",
                    varName: "numbers",
                    value: [0],
                    timestamp: undefined,
                    description: "Created array numbers.",
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

    it("should process a for each loop correctly", () => {
        writeTestNumber(5);
        const pseudocode = `
        CREATE array as nums with [1, 2, 3]
        FOR each num IN nums
            PRINT num
        END FOR
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "create_array",
                    varName: "nums",
                    value: [1, 2, 3],
                    timestamp: undefined,
                    description: "Created array nums.",
                },
                {
                    line: 2,
                    operation: "for",
                    iterator: "num",
                    collection: "nums",
                    body: [
                        {
                            line: 3,
                            operation: "print",
                            isLiteral: true,
                            varName: null,
                            literal: "num",
                            timestamp: undefined,
                            description: "Printed num.",
                        },
                    ],
                    timestamp: undefined,
                    description: "Iterating over nums with num.",
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

    it("should process nested if statements correctly", () => {
        writeTestNumber(7);
        const pseudocode = `
        SET x to number 10
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
                    line: 6,
                    operation: "endif",
                    timestamp: undefined,
                },
                {
                    description: "End of if statement.",
                    line: 7,
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
    it.skip("should process pseudocode and convert to final JSON format", () => {
        writeTestNumber(8);
        const pseudocode = `
        SET x to number 10
        CREATE array as nums with [1, 2, 3]
        DEFINE add_numbers WITH PARAMETERS (a, b)
            RETURN a + b
        END FUNCTION
        IF x is greater than 5 THEN
            PRINT "x is greater than 5"
        OTHERWISE
            PRINT "x is not greater than 5"
        END IF
        FOR each num IN nums
            PRINT num
        END FOR
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
                    value: 10,
                    timestamp: undefined,
                    description: "Set variable x to 10.",
                },
                {
                    line: 2,
                    operation: "create_array",
                    varName: "nums",
                    value: [1, 2, 3],
                    timestamp: undefined,
                    description: "Created array nums.",
                },
                {
                    line: 3,
                    operation: "define",
                    varName: "add_numbers",
                    params: ["a", "b"],
                    body: [
                        {
                            line: 4,
                            operation: "return",
                            value: {
                                left: "a",
                                operator: "+",
                                right: "b",
                            },
                            timestamp: undefined,
                            description: `Returned {"left":"a","operator":"+","right":"b"}.`,
                        },
                    ],
                    timestamp: undefined,
                    description:
                        "Defined function add_numbers with parameters a, b.",
                },
                {
                    line: 6,
                    operation: "if",
                    condition: "x > 5",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x > 5.",
                },
                {
                    line: 7,
                    operation: "print",
                    isLiteral: true,
                    varName: null,
                    literal: "x is greater than 5",
                    timestamp: undefined,
                    description: "Printed x is greater than 5.",
                },
                {
                    description: "End of if statement.",
                    line: 10,
                    operation: "endif",
                    timestamp: undefined,
                },
                {
                    line: 11,
                    operation: "for",
                    iterator: "num",
                    collection: "nums",
                    body: [
                        {
                            line: 12,
                            operation: "print",
                            isLiteral: true,
                            varName: null,
                            literal: "num",
                            timestamp: undefined,
                            description: "Printed num.",
                        },
                    ],
                    timestamp: undefined,
                    description: "Iterating over nums with num.",
                },
                {
                    line: 13,
                    operation: "while",
                    condition: "x > 0",
                    timestamp: undefined,
                    description: "while loop with condition x > 0.",
                },
                {
                    line: 13,
                    operation: "if",
                    condition: "x > 0",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x > 0.",
                },
                {
                    line: 14,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 10, // Reflecting the value of x at this point
                    timestamp: undefined,
                    description: "Printed x.",
                },
                {
                    line: 15,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 9,
                    timestamp: undefined,
                    description: "Set variable x to x - 1.",
                },
                {
                    line: 13,
                    operation: "if",
                    condition: "x > 0",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x > 0.",
                },
                {
                    line: 14,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 9, // Reflecting the value of x at this point
                    timestamp: undefined,
                    description: "Printed x.",
                },
                {
                    line: 15,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 8,
                    timestamp: undefined,
                    description: "Set variable x to x - 1.",
                },
                {
                    line: 13,
                    operation: "if",
                    condition: "x > 0",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x > 0.",
                },
                {
                    line: 14,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 8, // Reflecting the value of x at this point
                    timestamp: undefined,
                    description: "Printed x.",
                },
                {
                    line: 15,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 7,
                    timestamp: undefined,
                    description: "Set variable x to x - 1.",
                },
                {
                    line: 13,
                    operation: "if",
                    condition: "x > 0",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x > 0.",
                },
                {
                    line: 14,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 7, // Reflecting the value of x at this point
                    timestamp: undefined,
                    description: "Printed x.",
                },
                {
                    line: 15,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 6,
                    timestamp: undefined,
                    description: "Set variable x to x - 1.",
                },
                {
                    line: 13,
                    operation: "if",
                    condition: "x > 0",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x > 0.",
                },
                {
                    line: 14,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 6, // Reflecting the value of x at this point
                    timestamp: undefined,
                    description: "Printed x.",
                },
                {
                    line: 15,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 5,
                    timestamp: undefined,
                    description: "Set variable x to x - 1.",
                },
                {
                    line: 13,
                    operation: "if",
                    condition: "x > 0",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x > 0.",
                },
                {
                    line: 14,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 5, // Reflecting the value of x at this point
                    timestamp: undefined,
                    description: "Printed x.",
                },
                {
                    line: 15,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 4,
                    timestamp: undefined,
                    description: "Set variable x to x - 1.",
                },
                {
                    line: 13,
                    operation: "if",
                    condition: "x > 0",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x > 0.",
                },
                {
                    line: 14,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 4, // Reflecting the value of x at this point
                    timestamp: undefined,
                    description: "Printed x.",
                },
                {
                    line: 15,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 3,
                    timestamp: undefined,
                    description: "Set variable x to x - 1.",
                },
                {
                    line: 13,
                    operation: "if",
                    condition: "x > 0",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x > 0.",
                },
                {
                    line: 14,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 3, // Reflecting the value of x at this point
                    timestamp: undefined,
                    description: "Printed x.",
                },
                {
                    line: 15,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 2,
                    timestamp: undefined,
                    description: "Set variable x to x - 1.",
                },
                {
                    line: 13,
                    operation: "if",
                    condition: "x > 0",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x > 0.",
                },
                {
                    line: 14,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 2, // Reflecting the value of x at this point
                    timestamp: undefined,
                    description: "Printed x.",
                },
                {
                    line: 15,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 1,
                    timestamp: undefined,
                    description: "Set variable x to x - 1.",
                },
                {
                    line: 13,
                    operation: "if",
                    condition: "x > 0",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x > 0.",
                },
                {
                    line: 14,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 1, // Reflecting the value of x at this point
                    timestamp: undefined,
                    description: "Printed x.",
                },
                {
                    line: 15,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 0,
                    timestamp: undefined,
                    description: "Set variable x to x - 1.",
                },
                {
                    line: 13,
                    operation: "if",
                    condition: "x > 0",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if x > 0.",
                },
                {
                    line: 17,
                    operation: "loop_end",
                    timestamp: undefined,
                    description: "End of while loop",
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
        const pseudocode = `
        SET x to number 5
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
                    value: 8, // Expected result of x + 3
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
        const pseudocode = `
        SET a to number 5
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
        const pseudocode = `
        SET x to number 20
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

    it("should process variable declarations with division and complex arithmetic", () => {
        const pseudocode = `
        SET p to number 100
        SET q to p / 4
        SET r to (q + 5) * 3
        `;

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

    it("should handle division by zero", () => {
        const pseudocode = `
        SET x to number 10
        SET y to x / 0
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
                    value: Infinity,
                    timestamp: undefined,
                    description: "Set variable y to x / 0.",
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
        const pseudocode = `
        SET a to number -5
        SET b to a + 10
        SET c to b * -2
        `;

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

    it("should process arithmetic with variables only", () => {
        const pseudocode = `
        SET x to number 10
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
        const pseudocode = `
        SET x to number 5
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
                    literal: 5, // Reflecting the value of x at this point
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
                    literal: 4, // Reflecting the value of x at this point
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
                    literal: 3, // Reflecting the value of x at this point
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
                    literal: 2, // Reflecting the value of x at this point
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
                    literal: 1, // Reflecting the value of x at this point
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
                    line: 5,
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
