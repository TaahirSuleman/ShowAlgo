import { expect } from "chai";
import PseudocodeProcessor from "../src/models/PseudocodeProcessor.js";
import fs from "fs";

function writeTestNumber(testNumber) {
    fs.appendFileSync("output.txt", `Test case ${testNumber}\n\n`);
}

describe("PseudocodeProcessor", () => {
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
        const pseudocode = `
        SET x to number 10
        IF x is greater than 5 THEN
            PRINT "x is greater than 5"
        END IF
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "x",
                    value: 10,
                    timestamp: undefined,
                    description: "Set variable x to 10.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x greater 5",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x greater 5.",
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
                    operation: "create",
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
                    operation: "create",
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
                    operation: "create",
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

    it("should process a while loop with a print statement", () => {
        writeTestNumber(6);
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
                    value: 5,
                    timestamp: undefined,
                    description: "Set variable x to 5.",
                },
                {
                    line: 2,
                    operation: "while",
                    condition: "x > 0",
                    body: [
                        {
                            line: 3,
                            operation: "print",
                            isLiteral: true,
                            varName: null,
                            literal: "x",
                            timestamp: undefined,
                            description: "Printed x.",
                        },
                        {
                            line: 4,
                            operation: "set",
                            varName: "x",
                            value: "x - 1",
                            timestamp: undefined,
                            description: "Set variable x to x - 1.",
                        },
                    ],
                    timestamp: undefined,
                    description: "While loop with condition x > 0.",
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
                    value: 10,
                    timestamp: undefined,
                    description: "Set variable x to 10.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "y",
                    value: 5,
                    timestamp: undefined,
                    description: "Set variable y to 5.",
                },
                {
                    line: 3,
                    operation: "if",
                    condition: "x greater 5",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x greater 5.",
                },
                {
                    line: 4,
                    operation: "if",
                    condition: "y less 10",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if y less 10.",
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

    it("should process pseudocode and convert to final JSON format", () => {
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
                    value: 10,
                    timestamp: undefined,
                    description: "Set variable x to 10.",
                },
                {
                    line: 2,
                    operation: "create",
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
                    line: 5,
                    operation: "if",
                    condition: "x greater 5",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x greater 5.",
                },
                {
                    line: 6,
                    operation: "print",
                    isLiteral: true,
                    varName: null,
                    literal: "x is greater than 5",
                    timestamp: undefined,
                    description: "Printed x is greater than 5.",
                },
                {
                    line: 7,
                    operation: "for",
                    iterator: "num",
                    collection: "nums",
                    body: [
                        {
                            line: 8,
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
                    line: 9,
                    operation: "while",
                    condition: "x > 0",
                    body: [
                        {
                            line: 10,
                            operation: "print",
                            isLiteral: true,
                            varName: null,
                            literal: "x",
                            timestamp: undefined,
                            description: "Printed x.",
                        },
                        {
                            line: 11,
                            operation: "set",
                            varName: "x",
                            value: "x - 1",
                            timestamp: undefined,
                            description: "Set variable x to x - 1.",
                        },
                    ],
                    timestamp: undefined,
                    description: "While loop with condition x > 0.",
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
});
