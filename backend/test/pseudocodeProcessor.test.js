import { expect } from "chai";
import PseudocodeProcessor from "../src/models/PseudocodeProcessor.js";

describe("PseudocodeProcessor", () => {
    it("should process pseudocode and convert to final JSON format", () => {
        const pseudocode = `
        SET x to number 10
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
                    operation: "set",
                    varName: "x",
                    value: "10",
                    timestamp: undefined,
                    description: "Set variable x to 10.",
                },
                {
                    operation: "define",
                    varName: "add_numbers",
                    params: ["a", "b"],
                    body: [
                        {
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
                    operation: "if",
                    condition: "x greater 5",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x greater 5.",
                },
                {
                    operation: "print",
                    isLiteral: true,
                    varName: null,
                    literal: "x is greater than 5",
                    timestamp: undefined,
                    description: "Printed x is greater than 5.",
                },
                {
                    operation: "for",
                    iterator: "num",
                    collection: "nums",
                    body: [
                        {
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
                    operation: "while",
                    condition: "x > 0",
                    body: [
                        {
                            operation: "print",
                            isLiteral: true,
                            varName: null,
                            literal: "x",
                            timestamp: undefined,
                            description: "Printed x.",
                        },
                        {
                            operation: "set",
                            varName: "x",
                            value: "x - 1",
                            timestamp: undefined,
                            description: `Set variable x to x - 1.`,
                        },
                    ],
                    timestamp: undefined,
                    description: "While loop with condition x > 0.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        // Update expectedJson with actual timestamps from result
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
