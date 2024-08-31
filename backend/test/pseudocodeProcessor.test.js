import { expect } from "chai";
import PseudocodeProcessor from "../src/models/PseudocodeProcessor.js";
import fs from "fs";

function writeTestNumber(testNumber) {
    fs.appendFileSync("output.txt", `Test case ${testNumber}\n\n`);
}

describe("PseudocodeProcessor", () => {
    it.skip("should correctly evaluate arithmetic and comparison expressions in otherwise if conditions", () => {
        const pseudocode = `SET x TO number 5
            IF x * 2 > 20 THEN
                SET output TO string "Double x is greater than 20"
            OTHERWISE IF x + 10 > 10 THEN
                SET output TO string "x plus 10 is greater than 10"
            OTHERWISE IF x - 3 < 5 THEN
                SET output TO string "x minus 3 is less than 5"
            OTHERWISE
                SET output TO string "All conditions failed"
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
                    condition: "x * 2 > 20",
                    result: false,
                    timestamp: undefined,
                    description: "Checked if double x > 20.",
                },
                {
                    line: 4,
                    operation: "if",
                    condition: "x + 10 > 10",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if x plus 10 > 10.",
                },
                {
                    line: 5,
                    operation: "set",
                    varName: "output",
                    type: "string",
                    value: "x plus 10 is greater than 10",
                    timestamp: undefined,
                    description:
                        "Set output to 'x plus 10 is greater than 10'.",
                },
                {
                    line: 10,
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
                    line: 20,
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
                    line: 14,
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
                    line: 6,
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
                    line: 12,
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
                    line: 4,
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
                    line: 5,
                    operation: "endif",
                    timestamp: undefined,
                    description: "End of if statement.",
                },
                {
                    line: 6,
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
                    line: 6,
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
                    line: 10,
                    operation: "endif",
                    timestamp: undefined,
                    description: "End of if statement.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp; // Assigning timestamps from results to expected to match dynamically generated timestamps.
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
                    line: 8,
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
                        result: "H", // Assuming "H" is the result of myString[0]
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
        const pseudocode = `
            SET index TO 0
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
                        result: "H", // Assuming "H" is the result of myString[index]
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
        const pseudocode = `
            SET myString TO "Hello, World!"
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
                        result: "!", // Assuming "d" is the result of myString[length(myString) - 1]
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
        const pseudocode = `
            SET emptyString TO ""
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
                        result: "", // Assuming "" is the result of emptyString[0]
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
                        result: "H", // Assuming "H" is the result of myString[0]
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
        const pseudocode = `
            SET myString TO string "Test String"
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
                    line: 6,
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
        const pseudocode = `
            SET lengthOfUndefined TO LENGTH OF undefinedVariable
        `;

        expect(() => PseudocodeProcessor.process(pseudocode)).to.throw(
            "Variable 'undefinedVariable' is not declared. Ensure that 'undefinedVariable' is declared before it is used."
        );
    });
    it("should process a length operation on a variable within an expression correctly", () => {
        const pseudocode = `
            SET myString TO string "Hello, World!"
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
                    value: 6.5, // The expected half length of the string
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
        const pseudocode = `
            SET myString TO string "Hello, World!"
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
                    value: 13, // The length of "Hello, World!" is 13
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
        const pseudocode = `
            SET myString TO string "abc"
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
                    value: 3, // The length of "abc" is 3
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
        const pseudocode = `
            SET myString TO string "Hello, World!"
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
        const pseudocode = `
            SET myString TO string "Hello, World!"
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
        const pseudocode = `
            SET myString TO string "Hello, World!"
            SET subStr TO substring of myString FROM 5 TO "ten"
            PRINT subStr
        `;

        expect(() => PseudocodeProcessor.process(pseudocode)).to.throw(
            "Invalid substring operation: 'start' and 'end' indices must be numeric."
        );
    });

    it("should throw an error for a substring operation with a non-numeric start index", () => {
        const pseudocode = `
            SET myString TO string "Hello, World!"
            SET subStr TO substring of myString FROM "five" TO 10
            PRINT subStr
        `;

        expect(() => PseudocodeProcessor.process(pseudocode)).to.throw(
            "Invalid substring operation: 'start' and 'end' indices must be numeric."
        );
    });

    it("should throw an error for a substring operation where start index is greater than end index", () => {
        const pseudocode = `
            SET myString TO string "Hello, World!"
            SET subStr TO substring of myString FROM 5 TO 2
            PRINT subStr
        `;

        expect(() => PseudocodeProcessor.process(pseudocode)).to.throw(
            "Invalid substring operation: 'start' index (5) cannot be greater than 'end' index (2)."
        );
    });

    it("should throw an error for a substring operation with a negative start index", () => {
        const pseudocode = `
            SET myString TO string "Hello, World!"
            SET subStr TO substring of myString FROM -1 TO 5
            PRINT subStr
        `;

        expect(() => PseudocodeProcessor.process(pseudocode)).to.throw(
            "Invalid substring operation: 'start' index cannot be negative."
        );
    });

    it("should process a substring operation with end index beyond string length correctly", () => {
        const pseudocode = `
            SET myString TO string "Hello"
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
        const pseudocode = `
            SET myString TO string "Hello, World!"
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
        const pseudocode = `
            SET myString TO string "Hello, World!"
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
        const pseudocode = `
            SET x TO number 3
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
                    timestamp: "2024-08-29T14:24:04.138Z",
                    description: "Set variable x to 3.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "y",
                    type: "number",
                    value: 100,
                    timestamp: "2024-08-29T14:24:04.138Z",
                    description: "Set variable y to 100.",
                },
                {
                    line: 3,
                    operation: "set",
                    varName: "z",
                    type: "number",
                    value: 42,
                    timestamp: "2024-08-29T14:24:04.138Z",
                    description: "Set variable z to 42.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "max",
                    type: "number",
                    value: 0,
                    timestamp: "2024-08-29T14:24:04.138Z",
                    description: "Set variable max to 0.",
                },
                {
                    line: 5,
                    operation: "if",
                    condition: "x > y",
                    result: false,
                    timestamp: "2024-08-29T14:24:04.138Z",
                    description: "Checked if x > y.",
                },
                {
                    line: 8,
                    operation: "set",
                    varName: "max",
                    type: "number",
                    value: 100,
                    timestamp: "2024-08-29T14:24:04.138Z",
                    description: "Set variable max to 100.",
                },
                {
                    line: 9,
                    operation: "endif",
                    timestamp: "2024-08-29T14:24:04.138Z",
                    description: "End of if statement.",
                },
                {
                    line: 10,
                    operation: "if",
                    condition: "z > max",
                    result: false,
                    timestamp: "2024-08-29T14:24:04.138Z",
                    description: "Checked if z > max.",
                },
                {
                    line: 12,
                    operation: "endif",
                    timestamp: "2024-08-29T14:24:04.138Z",
                    description: "End of if statement.",
                },
                {
                    line: 13,
                    operation: "print",
                    isLiteral: false,
                    varName: "max",
                    literal: 100,
                    timestamp: "2024-08-29T14:24:04.138Z",
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
        const pseudocode = `
            SET myString TO string "Hello, World!"
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
        const pseudocode = `
            SET x to number 10
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

        // Setting timestamps in the expected output to match the result for a fair comparison
        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it.skip("should process complex boolean conditions with AND, OR, and NOT correctly", () => {
        const pseudocode = `
        SET a TO true
        SET b TO false
        SET c TO true
        IF a AND NOT b OR c THEN
            PRINT "Condition is true"
        OTHERWISE
            PRINT "Condition is false"
        END IF
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "a",
                    type: "boolean",
                    value: true,
                    timestamp: undefined,
                    description: "Set variable a to true.",
                },
                {
                    line: 2,
                    operation: "set",
                    varName: "b",
                    type: "boolean",
                    value: false,
                    timestamp: undefined,
                    description: "Set variable b to false.",
                },
                {
                    line: 3,
                    operation: "set",
                    varName: "c",
                    type: "boolean",
                    value: true,
                    timestamp: undefined,
                    description: "Set variable c to true.",
                },
                {
                    line: 4,
                    operation: "if",
                    condition: "a && !b || c",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if a and not b or c.",
                },
                {
                    line: 5,
                    operation: "print",
                    isLiteral: true,
                    varName: null,
                    literal: "Condition is true",
                    timestamp: undefined,
                    description: "Printed Condition is true.",
                },
                {
                    description: "End of if statement.",
                    line: 8,
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

    it.skip("should process nested boolean conditions with AND and OR correctly", () => {
        const pseudocode = `SET x TO number 10
        SET y TO number 5
        SET z TO number 3
        IF (x is greater than 5 AND y is less than 10) OR z is greater than 2 THEN
            PRINT "Complex condition is true"
        OTHERWISE
            PRINT "Complex condition is false"
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
                    operation: "set",
                    varName: "z",
                    type: "number",
                    value: 3,
                    timestamp: undefined,
                    description: "Set variable z to 3.",
                },
                {
                    line: 4,
                    operation: "if",
                    condition: "(x > 5 && y < 10) || z > 2",
                    result: true,
                    timestamp: undefined,
                    description: "Checked if (x > 5 and y < 10) or z > 2.",
                },
                {
                    line: 5,
                    operation: "print",
                    isLiteral: true,
                    varName: null,
                    literal: "Complex condition is true",
                    timestamp: undefined,
                    description: "Printed Complex condition is true.",
                },
                {
                    description: "End of if statement.",
                    line: 8,
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

    it("should process conditions with multiple NOT operators correctly", () => {
        const pseudocode = `
        SET p TO true
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
                    line: 7,
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
        const pseudocode = `
            SET x to number 15
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
                    line: 11,
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
        const pseudocode = `
            SET x to number 10
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
                    line: 11,
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
        const pseudocode = `
            SET x to number 20
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
                    line: 8,
                    operation: "endif",
                    timestamp: undefined,
                },
                {
                    description: "End of if statement.",
                    line: 11,
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
        const pseudocode = `
            SET x to number 5
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
                    line: 9,
                    operation: "endif",
                    timestamp: undefined,
                },
                {
                    description: "End of if statement.",
                    line: 10,
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
        const pseudocode = `
            SET a to number 5
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
                    line: 10,
                    operation: "endif",
                    timestamp: undefined,
                },
                {
                    description: "End of if statement.",
                    line: 13,
                    operation: "endif",
                    timestamp: undefined,
                },
                {
                    description: "End of if statement.",
                    line: 14,
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
        const pseudocode = `
            SET x to number 20
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
                    line: 7,
                    operation: "endif",
                    timestamp: undefined,
                },
                {
                    description: "End of if statement.",
                    line: 8,
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
        const pseudocode = `
            SET firstName TO "John"
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
                    line: 4,
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

        const pseudocode = `
        SET isTrue TO boolean true
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
                    line: 6,
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
        const pseudocode = `
            SET isTrue TO true
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
                    result: true, // Assuming the condition evaluates to true
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
                    line: 7,
                    operation: "endif",
                    timestamp: undefined,
                    description: "End of if statement.",
                },
            ],
        };

        const result = PseudocodeProcessor.process(pseudocode);

        // Update timestamps in expectedJson to match those in the result
        expectedJson.actionFrames.forEach((frame, index) => {
            frame.timestamp = result.actionFrames[index].timestamp;
        });

        expect(result).to.deep.equal(expectedJson);
    });

    it("should handle boolean expressions with mixed operators correctly", () => {
        const pseudocode = `
            SET isTrue TO true
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
                    line: 7,
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

    it.skip("should process boolean comparisons correctly", () => {
        const pseudocode = `
            SET isTrue TO true
            SET result TO isTrue === false
        `;

        const expectedJson = {
            actionFrames: [
                {
                    line: 2,
                    operation: "set",
                    varName: "isTrue",
                    type: "boolean",
                    value: true,
                    timestamp: undefined,
                    description: "Set variable isTrue to true.",
                },
                {
                    line: 3,
                    operation: "set",
                    varName: "result",
                    type: "boolean",
                    value: false,
                    timestamp: undefined,
                    description:
                        "Set variable result to the result of isTrue = false.",
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
        const pseudocode = `
            SET isTrue TO true
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
        const pseudocode = `
            SET isTrue TO true
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
                    line: 5,
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

        const pseudocode = `
        SET myVar TO "Hello, World!"
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
});
