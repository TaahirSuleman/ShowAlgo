import { expect } from "chai";
import JsonConverter from "../src/models/JsonConverter.js";

describe("JsonConverter", () => {
    let converter;

    beforeEach(() => {
        converter = new JsonConverter();
    });

    it("should convert a variable declaration", () => {
        const ir = {
            program: [
                {
                    type: "VariableDeclaration",
                    name: "x",
                    value: {
                        type: "NumberLiteral",
                        value: 10,
                        line: 1,
                    },
                },
            ],
        };
        const result = converter.transformToFinalJSON(ir);
        expect(result).to.deep.equal({
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 10,
                    timestamp: result.actionFrames[0].timestamp,
                    description: "Set variable x to 10.",
                },
            ],
        });
    });

    it("should convert a function declaration", () => {
        const ir = {
            program: [
                {
                    type: "FunctionDeclaration",
                    name: "add_numbers",
                    params: ["a", "b"],
                    body: [
                        {
                            type: "ReturnStatement",
                            value: {
                                type: "Expression",
                                left: { value: "a" },
                                operator: "+",
                                right: { value: "b" },
                            },
                        },
                    ],
                },
            ],
        };
        const result = converter.transformToFinalJSON(ir);
        expect(result).to.deep.equal({
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
                            timestamp: result.actionFrames[0].body[0].timestamp,
                            description: `Returned {"left":"a","operator":"+","right":"b"}.`,
                        },
                    ],
                    timestamp: result.actionFrames[0].timestamp,
                    description:
                        "Defined function add_numbers with parameters a, b.",
                },
            ],
        });
    });

    it("should convert an if statement", () => {
        const ir = {
            program: [
                {
                    type: "VariableDeclaration", // Ensure variable x is declared
                    name: "x",
                    value: {
                        type: "NumberLiteral",
                        value: 10,
                        line: 1,
                    },
                },
                {
                    type: "IfStatement",
                    condition: {
                        left: "10",
                        operator: ">",
                        right: "5",
                    },
                    consequent: [
                        {
                            type: "PrintStatement",
                            value: "x is greater than 5",
                        },
                    ],
                    alternate: [
                        {
                            type: "PrintStatement",
                            value: "x is not greater than 5",
                        },
                    ],
                },
            ],
        };
        const result = converter.transformToFinalJSON(ir);
        expect(result).to.deep.equal({
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 10,
                    timestamp: result.actionFrames[0].timestamp,
                    description: "Set variable x to 10.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "10 > 5",
                    result: true,
                    timestamp: result.actionFrames[1].timestamp,
                    description: "Checked if 10 > 5.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: true,
                    varName: null,
                    literal: "x is greater than 5",
                    timestamp: result.actionFrames[2].timestamp,
                    description: "Printed x is greater than 5.",
                },
                {
                    description: "End of if statement.",
                    line: 6,
                    operation: "endif",
                    timestamp: result.actionFrames[3].timestamp,
                },
            ],
        });
    });

    it("should convert 'LOOP until' with high-level syntax", () => {
        const ir = {
            program: [
                {
                    type: "VariableDeclaration", // Ensure variable x is declared
                    name: "x",
                    value: {
                        type: "NumberLiteral",
                        value: "0",
                        line: 1,
                    },
                },
                {
                    type: "LoopUntil",
                    condition: {
                        left: "x",
                        operator: ">",
                        right: "5",
                    },
                    body: [
                        {
                            type: "PrintStatement",
                            value: "x",
                        },
                        {
                            type: "VariableDeclaration",
                            name: "x",
                            value: {
                                type: "Expression",
                                left: "x",
                                operator: "+",
                                right: "1",
                            },
                        },
                    ],
                },
            ],
        };
        const result = converter.transformToFinalJSON(ir);
        expect(result).to.deep.equal({
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 0,
                    timestamp: result.actionFrames[0].timestamp,
                    description: "Set variable x to 0.",
                },
                {
                    line: 2,
                    operation: "while",
                    condition: "x <= 5", // Condition flipped for loop_until
                    timestamp: result.actionFrames[1].timestamp,
                    description: "while loop with condition x <= 5.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x <= 5", // Condition flipped
                    result: true,
                    timestamp: result.actionFrames[2].timestamp,
                    description: "Checked if x <= 5.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 0, // Reflecting the value of x at this point
                    timestamp: result.actionFrames[3].timestamp,
                    description: "Printed x.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 1,
                    timestamp: result.actionFrames[4].timestamp,
                    description: "Set variable x to x + 1.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x <= 5", // Condition flipped
                    result: true,
                    timestamp: result.actionFrames[5].timestamp,
                    description: "Checked if x <= 5.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 1, // Reflecting the value of x at this point
                    timestamp: result.actionFrames[6].timestamp,
                    description: "Printed x.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 2,
                    timestamp: result.actionFrames[7].timestamp,
                    description: "Set variable x to x + 1.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x <= 5", // Condition flipped
                    result: true,
                    timestamp: result.actionFrames[8].timestamp,
                    description: "Checked if x <= 5.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 2, // Reflecting the value of x at this point
                    timestamp: result.actionFrames[9].timestamp,
                    description: "Printed x.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 3,
                    timestamp: result.actionFrames[10].timestamp,
                    description: "Set variable x to x + 1.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x <= 5", // Condition flipped
                    result: true,
                    timestamp: result.actionFrames[11].timestamp,
                    description: "Checked if x <= 5.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 3, // Reflecting the value of x at this point
                    timestamp: result.actionFrames[12].timestamp,
                    description: "Printed x.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 4,
                    timestamp: result.actionFrames[13].timestamp,
                    description: "Set variable x to x + 1.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x <= 5", // Condition flipped
                    result: true,
                    timestamp: result.actionFrames[14].timestamp,
                    description: "Checked if x <= 5.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 4, // Reflecting the value of x at this point
                    timestamp: result.actionFrames[15].timestamp,
                    description: "Printed x.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 5,
                    timestamp: result.actionFrames[16].timestamp,
                    description: "Set variable x to x + 1.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x <= 5", // Condition flipped
                    result: true,
                    timestamp: result.actionFrames[17].timestamp,
                    description: "Checked if x <= 5.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 5, // Reflecting the value of x at this point
                    timestamp: result.actionFrames[18].timestamp,
                    description: "Printed x.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 6,
                    timestamp: result.actionFrames[19].timestamp,
                    description: "Set variable x to x + 1.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x <= 5", // Condition flipped
                    result: false,
                    timestamp: result.actionFrames[20].timestamp,
                    description: "Checked if x <= 5.",
                },
                {
                    line: 5,
                    operation: "loop_end",
                    timestamp: result.actionFrames[21].timestamp,
                    description: "End of while loop",
                },
            ],
        });
    });

    it("should convert 'LOOP UNTIL' with traditional syntax", () => {
        const ir = {
            program: [
                {
                    type: "VariableDeclaration", // Ensure variable x is declared
                    name: "x",
                    value: {
                        type: "NumberLiteral",
                        value: "0",
                        line: 1,
                    },
                },
                {
                    type: "LoopUntil",
                    condition: {
                        left: "x",
                        operator: ">",
                        right: "5",
                    },
                    body: [
                        {
                            type: "PrintStatement",
                            value: "x",
                        },
                        {
                            type: "VariableDeclaration",
                            name: "x",
                            value: {
                                type: "Expression",
                                left: "x",
                                operator: "+",
                                right: "1",
                            },
                        },
                    ],
                },
            ],
        };
        const result = converter.transformToFinalJSON(ir);
        expect(result).to.deep.equal({
            actionFrames: [
                {
                    line: 1,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 0,
                    timestamp: result.actionFrames[0].timestamp,
                    description: "Set variable x to 0.",
                },
                {
                    line: 2,
                    operation: "while",
                    condition: "x <= 5", // Condition flipped for loop_until
                    timestamp: result.actionFrames[1].timestamp,
                    description: "while loop with condition x <= 5.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x <= 5", // Condition flipped
                    result: true,
                    timestamp: result.actionFrames[2].timestamp,
                    description: "Checked if x <= 5.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 0, // Reflecting the value of x at this point
                    timestamp: result.actionFrames[3].timestamp,
                    description: "Printed x.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 1,
                    timestamp: result.actionFrames[4].timestamp,
                    description: "Set variable x to x + 1.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x <= 5", // Condition flipped
                    result: true,
                    timestamp: result.actionFrames[5].timestamp,
                    description: "Checked if x <= 5.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 1, // Reflecting the value of x at this point
                    timestamp: result.actionFrames[6].timestamp,
                    description: "Printed x.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 2,
                    timestamp: result.actionFrames[7].timestamp,
                    description: "Set variable x to x + 1.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x <= 5", // Condition flipped
                    result: true,
                    timestamp: result.actionFrames[8].timestamp,
                    description: "Checked if x <= 5.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 2, // Reflecting the value of x at this point
                    timestamp: result.actionFrames[9].timestamp,
                    description: "Printed x.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 3,
                    timestamp: result.actionFrames[10].timestamp,
                    description: "Set variable x to x + 1.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x <= 5", // Condition flipped
                    result: true,
                    timestamp: result.actionFrames[11].timestamp,
                    description: "Checked if x <= 5.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 3, // Reflecting the value of x at this point
                    timestamp: result.actionFrames[12].timestamp,
                    description: "Printed x.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 4,
                    timestamp: result.actionFrames[13].timestamp,
                    description: "Set variable x to x + 1.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x <= 5", // Condition flipped
                    result: true,
                    timestamp: result.actionFrames[14].timestamp,
                    description: "Checked if x <= 5.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 4, // Reflecting the value of x at this point
                    timestamp: result.actionFrames[15].timestamp,
                    description: "Printed x.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 5,
                    timestamp: result.actionFrames[16].timestamp,
                    description: "Set variable x to x + 1.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x <= 5", // Condition flipped
                    result: true,
                    timestamp: result.actionFrames[17].timestamp,
                    description: "Checked if x <= 5.",
                },
                {
                    line: 3,
                    operation: "print",
                    isLiteral: false,
                    varName: "x",
                    literal: 5, // Reflecting the value of x at this point
                    timestamp: result.actionFrames[18].timestamp,
                    description: "Printed x.",
                },
                {
                    line: 4,
                    operation: "set",
                    varName: "x",
                    type: "number",
                    value: 6,
                    timestamp: result.actionFrames[19].timestamp,
                    description: "Set variable x to x + 1.",
                },
                {
                    line: 2,
                    operation: "if",
                    condition: "x <= 5", // Condition flipped
                    result: false,
                    timestamp: result.actionFrames[20].timestamp,
                    description: "Checked if x <= 5.",
                },
                {
                    line: 5,
                    operation: "loop_end",
                    timestamp: result.actionFrames[21].timestamp,
                    description: "End of while loop",
                },
            ],
        });
    });
    it("should convert 'LOOP from up to' with high-level syntax", () => {
        const ir = {
            program: [
                {
                    type: "LoopFromTo",
                    loopVariable: "i",
                    range: {
                        start: "0",
                        end: "10",
                    },
                    body: [
                        {
                            type: "PrintStatement",
                            value: "i",
                        },
                    ],
                },
            ],
        };
        const result = converter.transformToFinalJSON(ir);
        expect(result).to.deep.equal({
            actionFrames: [
                {
                    line: 1, // Assuming the loop starts on line 1 in this test case
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 0,
                    timestamp: result.actionFrames[0].timestamp,
                    description: "Set variable i to 0.",
                },
                {
                    line: 1,
                    operation: "loop_from_to",
                    condition: "i <= 10",
                    timestamp: result.actionFrames[1].timestamp,
                    description: "loop from_to loop with condition i <= 10.",
                },
                {
                    line: 1,
                    operation: "if",
                    condition: "i <= 10",
                    result: true,
                    timestamp: result.actionFrames[2].timestamp,
                    description: "Checked if i <= 10.",
                },
                {
                    line: 2, // Assuming the print statement is on line 2
                    operation: "print",
                    isLiteral: false,
                    varName: "i",
                    literal: 0, // Reflecting the value of i at this point
                    timestamp: result.actionFrames[3].timestamp,
                    description: "Printed i.",
                },
                {
                    line: 1,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 1,
                    timestamp: result.actionFrames[4].timestamp,
                    description: "Set variable i to 1.",
                },
                {
                    line: 1,
                    operation: "if",
                    condition: "i <= 10",
                    result: true,
                    timestamp: result.actionFrames[5].timestamp,
                    description: "Checked if i <= 10.",
                },
                {
                    line: 2,
                    operation: "print",
                    isLiteral: false,
                    varName: "i",
                    literal: 1, // Reflecting the value of i at this point
                    timestamp: result.actionFrames[6].timestamp,
                    description: "Printed i.",
                },
                {
                    line: 1,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 2,
                    timestamp: result.actionFrames[7].timestamp,
                    description: "Set variable i to 2.",
                },
                {
                    line: 1,
                    operation: "if",
                    condition: "i <= 10",
                    result: true,
                    timestamp: result.actionFrames[8].timestamp,
                    description: "Checked if i <= 10.",
                },
                {
                    line: 2,
                    operation: "print",
                    isLiteral: false,
                    varName: "i",
                    literal: 2, // Reflecting the value of i at this point
                    timestamp: result.actionFrames[9].timestamp,
                    description: "Printed i.",
                },
                {
                    line: 1,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 3,
                    timestamp: result.actionFrames[10].timestamp,
                    description: "Set variable i to 3.",
                },
                {
                    line: 1,
                    operation: "if",
                    condition: "i <= 10",
                    result: true,
                    timestamp: result.actionFrames[11].timestamp,
                    description: "Checked if i <= 10.",
                },
                {
                    line: 2,
                    operation: "print",
                    isLiteral: false,
                    varName: "i",
                    literal: 3, // Reflecting the value of i at this point
                    timestamp: result.actionFrames[12].timestamp,
                    description: "Printed i.",
                },
                {
                    line: 1,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 4,
                    timestamp: result.actionFrames[13].timestamp,
                    description: "Set variable i to 4.",
                },
                {
                    line: 1,
                    operation: "if",
                    condition: "i <= 10",
                    result: true,
                    timestamp: result.actionFrames[14].timestamp,
                    description: "Checked if i <= 10.",
                },
                {
                    line: 2,
                    operation: "print",
                    isLiteral: false,
                    varName: "i",
                    literal: 4, // Reflecting the value of i at this point
                    timestamp: result.actionFrames[15].timestamp,
                    description: "Printed i.",
                },
                {
                    line: 1,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 5,
                    timestamp: result.actionFrames[16].timestamp,
                    description: "Set variable i to 5.",
                },
                {
                    line: 1,
                    operation: "if",
                    condition: "i <= 10",
                    result: true,
                    timestamp: result.actionFrames[17].timestamp,
                    description: "Checked if i <= 10.",
                },
                {
                    line: 2,
                    operation: "print",
                    isLiteral: false,
                    varName: "i",
                    literal: 5, // Reflecting the value of i at this point
                    timestamp: result.actionFrames[18].timestamp,
                    description: "Printed i.",
                },
                {
                    line: 1,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 6,
                    timestamp: result.actionFrames[19].timestamp,
                    description: "Set variable i to 6.",
                },
                {
                    line: 1,
                    operation: "if",
                    condition: "i <= 10",
                    result: true,
                    timestamp: result.actionFrames[20].timestamp,
                    description: "Checked if i <= 10.",
                },
                {
                    line: 2,
                    operation: "print",
                    isLiteral: false,
                    varName: "i",
                    literal: 6, // Reflecting the value of i at this point
                    timestamp: result.actionFrames[21].timestamp,
                    description: "Printed i.",
                },
                {
                    line: 1,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 7,
                    timestamp: result.actionFrames[22].timestamp,
                    description: "Set variable i to 7.",
                },
                {
                    line: 1,
                    operation: "if",
                    condition: "i <= 10",
                    result: true,
                    timestamp: result.actionFrames[23].timestamp,
                    description: "Checked if i <= 10.",
                },
                {
                    line: 2,
                    operation: "print",
                    isLiteral: false,
                    varName: "i",
                    literal: 7, // Reflecting the value of i at this point
                    timestamp: result.actionFrames[24].timestamp,
                    description: "Printed i.",
                },
                {
                    line: 1,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 8,
                    timestamp: result.actionFrames[25].timestamp,
                    description: "Set variable i to 8.",
                },
                {
                    line: 1,
                    operation: "if",
                    condition: "i <= 10",
                    result: true,
                    timestamp: result.actionFrames[26].timestamp,
                    description: "Checked if i <= 10.",
                },
                {
                    line: 2,
                    operation: "print",
                    isLiteral: false,
                    varName: "i",
                    literal: 8, // Reflecting the value of i at this point
                    timestamp: result.actionFrames[27].timestamp,
                    description: "Printed i.",
                },
                {
                    line: 1,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 9,
                    timestamp: result.actionFrames[28].timestamp,
                    description: "Set variable i to 9.",
                },
                {
                    line: 1,
                    operation: "if",
                    condition: "i <= 10",
                    result: true,
                    timestamp: result.actionFrames[29].timestamp,
                    description: "Checked if i <= 10.",
                },
                {
                    line: 2,
                    operation: "print",
                    isLiteral: false,
                    varName: "i",
                    literal: 9, // Reflecting the value of i at this point
                    timestamp: result.actionFrames[30].timestamp,
                    description: "Printed i.",
                },
                {
                    line: 1,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 10,
                    timestamp: result.actionFrames[31].timestamp,
                    description: "Set variable i to 10.",
                },
                {
                    line: 1,
                    operation: "if",
                    condition: "i <= 10",
                    result: true,
                    timestamp: result.actionFrames[32].timestamp,
                    description: "Checked if i <= 10.",
                },
                {
                    line: 2,
                    operation: "print",
                    isLiteral: false,
                    varName: "i",
                    literal: 10, // Reflecting the value of i at this point
                    timestamp: result.actionFrames[33].timestamp,
                    description: "Printed i.",
                },
                {
                    line: 1,
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 11,
                    timestamp: result.actionFrames[34].timestamp,
                    description: "Set variable i to 11.",
                },
                {
                    line: 1,
                    operation: "if",
                    condition: "i <= 10",
                    result: false,
                    timestamp: result.actionFrames[35].timestamp,
                    description: "Checked if i <= 10.",
                },
                {
                    line: 3,
                    operation: "loop_end",
                    timestamp: result.actionFrames[36].timestamp,
                    description: "End of loop from_to loop",
                },
            ],
        });

        it("should convert 'LOOP FROM TO' with traditional syntax", () => {
            const ir = {
                program: [
                    {
                        type: "LoopFromTo",
                        range: {
                            start: "0",
                            end: "10",
                        },
                        body: [
                            {
                                type: "PrintStatement",
                                value: "i",
                            },
                        ],
                    },
                ],
            };
            const result = converter.transformToFinalJSON(ir);
            expect(result).to.deep.equal({
                actionFrames: [
                    {
                        line: 1, // Assuming the loop starts on line 1 in this test case
                        operation: "set",
                        varName: "i",
                        type: "number",
                        value: 0,
                        timestamp: result.actionFrames[0].timestamp,
                        description: "Set variable i to 0.",
                    },
                    {
                        line: 1,
                        operation: "loop_from_to",
                        condition: "i <= 10",
                        timestamp: result.actionFrames[1].timestamp,
                        description: "Loop from 0 to 10.",
                    },
                    {
                        line: 1,
                        operation: "if",
                        condition: "i <= 10",
                        result: true,
                        timestamp: result.actionFrames[2].timestamp,
                        description: "Checked if i <= 10.",
                    },
                    {
                        line: 2, // Assuming the print statement is on line 2
                        operation: "print",
                        isLiteral: false,
                        varName: "i",
                        literal: 0, // Reflecting the value of i at this point
                        timestamp: result.actionFrames[3].timestamp,
                        description: "Printed i.",
                    },
                    {
                        line: 1,
                        operation: "set",
                        varName: "i",
                        type: "number",
                        value: 1,
                        timestamp: result.actionFrames[4].timestamp,
                        description: "Set variable i to 1.",
                    },
                    {
                        line: 1,
                        operation: "if",
                        condition: "i <= 10",
                        result: true,
                        timestamp: result.actionFrames[5].timestamp,
                        description: "Checked if i <= 10.",
                    },
                    {
                        line: 2,
                        operation: "print",
                        isLiteral: false,
                        varName: "i",
                        literal: 1, // Reflecting the value of i at this point
                        timestamp: result.actionFrames[6].timestamp,
                        description: "Printed i.",
                    },
                    {
                        line: 1,
                        operation: "set",
                        varName: "i",
                        type: "number",
                        value: 2,
                        timestamp: result.actionFrames[7].timestamp,
                        description: "Set variable i to 2.",
                    },
                    {
                        line: 1,
                        operation: "if",
                        condition: "i <= 10",
                        result: true,
                        timestamp: result.actionFrames[8].timestamp,
                        description: "Checked if i <= 10.",
                    },
                    {
                        line: 2,
                        operation: "print",
                        isLiteral: false,
                        varName: "i",
                        literal: 2, // Reflecting the value of i at this point
                        timestamp: result.actionFrames[9].timestamp,
                        description: "Printed i.",
                    },
                    {
                        line: 1,
                        operation: "set",
                        varName: "i",
                        type: "number",
                        value: 3,
                        timestamp: result.actionFrames[10].timestamp,
                        description: "Set variable i to 3.",
                    },
                    {
                        line: 1,
                        operation: "if",
                        condition: "i <= 10",
                        result: true,
                        timestamp: result.actionFrames[11].timestamp,
                        description: "Checked if i <= 10.",
                    },
                    {
                        line: 2,
                        operation: "print",
                        isLiteral: false,
                        varName: "i",
                        literal: 3, // Reflecting the value of i at this point
                        timestamp: result.actionFrames[12].timestamp,
                        description: "Printed i.",
                    },
                    {
                        line: 1,
                        operation: "set",
                        varName: "i",
                        type: "number",
                        value: 4,
                        timestamp: result.actionFrames[13].timestamp,
                        description: "Set variable i to 4.",
                    },
                    {
                        line: 1,
                        operation: "if",
                        condition: "i <= 10",
                        result: true,
                        timestamp: result.actionFrames[14].timestamp,
                        description: "Checked if i <= 10.",
                    },
                    {
                        line: 2,
                        operation: "print",
                        isLiteral: false,
                        varName: "i",
                        literal: 4, // Reflecting the value of i at this point
                        timestamp: result.actionFrames[15].timestamp,
                        description: "Printed i.",
                    },
                    {
                        line: 1,
                        operation: "set",
                        varName: "i",
                        type: "number",
                        value: 5,
                        timestamp: result.actionFrames[16].timestamp,
                        description: "Set variable i to 5.",
                    },
                    {
                        line: 1,
                        operation: "if",
                        condition: "i <= 10",
                        result: true,
                        timestamp: result.actionFrames[17].timestamp,
                        description: "Checked if i <= 10.",
                    },
                    {
                        line: 2,
                        operation: "print",
                        isLiteral: false,
                        varName: "i",
                        literal: 5, // Reflecting the value of i at this point
                        timestamp: result.actionFrames[18].timestamp,
                        description: "Printed i.",
                    },
                    {
                        line: 1,
                        operation: "set",
                        varName: "i",
                        type: "number",
                        value: 6,
                        timestamp: result.actionFrames[19].timestamp,
                        description: "Set variable i to 6.",
                    },
                    {
                        line: 1,
                        operation: "if",
                        condition: "i <= 10",
                        result: true,
                        timestamp: result.actionFrames[20].timestamp,
                        description: "Checked if i <= 10.",
                    },
                    {
                        line: 2,
                        operation: "print",
                        isLiteral: false,
                        varName: "i",
                        literal: 6, // Reflecting the value of i at this point
                        timestamp: result.actionFrames[21].timestamp,
                        description: "Printed i.",
                    },
                    {
                        line: 1,
                        operation: "set",
                        varName: "i",
                        type: "number",
                        value: 7,
                        timestamp: result.actionFrames[22].timestamp,
                        description: "Set variable i to 7.",
                    },
                    {
                        line: 1,
                        operation: "if",
                        condition: "i <= 10",
                        result: true,
                        timestamp: result.actionFrames[23].timestamp,
                        description: "Checked if i <= 10.",
                    },
                    {
                        line: 2,
                        operation: "print",
                        isLiteral: false,
                        varName: "i",
                        literal: 7, // Reflecting the value of i at this point
                        timestamp: result.actionFrames[24].timestamp,
                        description: "Printed i.",
                    },
                    {
                        line: 1,
                        operation: "set",
                        varName: "i",
                        type: "number",
                        value: 8,
                        timestamp: result.actionFrames[25].timestamp,
                        description: "Set variable i to 8.",
                    },
                    {
                        line: 1,
                        operation: "if",
                        condition: "i <= 10",
                        result: true,
                        timestamp: result.actionFrames[26].timestamp,
                        description: "Checked if i <= 10.",
                    },
                    {
                        line: 2,
                        operation: "print",
                        isLiteral: false,
                        varName: "i",
                        literal: 8, // Reflecting the value of i at this point
                        timestamp: result.actionFrames[27].timestamp,
                        description: "Printed i.",
                    },
                    {
                        line: 1,
                        operation: "set",
                        varName: "i",
                        type: "number",
                        value: 9,
                        timestamp: result.actionFrames[28].timestamp,
                        description: "Set variable i to 9.",
                    },
                    {
                        line: 1,
                        operation: "if",
                        condition: "i <= 10",
                        result: true,
                        timestamp: result.actionFrames[29].timestamp,
                        description: "Checked if i <= 10.",
                    },
                    {
                        line: 2,
                        operation: "print",
                        isLiteral: false,
                        varName: "i",
                        literal: 9, // Reflecting the value of i at this point
                        timestamp: result.actionFrames[30].timestamp,
                        description: "Printed i.",
                    },
                    {
                        line: 1,
                        operation: "set",
                        varName: "i",
                        type: "number",
                        value: 10,
                        timestamp: result.actionFrames[31].timestamp,
                        description: "Set variable i to 10.",
                    },
                    {
                        line: 1,
                        operation: "if",
                        condition: "i <= 10",
                        result: true,
                        timestamp: result.actionFrames[32].timestamp,
                        description: "Checked if i <= 10.",
                    },
                    {
                        line: 2,
                        operation: "print",
                        isLiteral: false,
                        varName: "i",
                        literal: 10, // Reflecting the value of i at this point
                        timestamp: result.actionFrames[33].timestamp,
                        description: "Printed i.",
                    },
                    {
                        line: 1,
                        operation: "set",
                        varName: "i",
                        type: "number",
                        value: 11,
                        timestamp: result.actionFrames[34].timestamp,
                        description: "Set variable i to 11.",
                    },
                    {
                        line: 1,
                        operation: "if",
                        condition: "i <= 10",
                        result: false,
                        timestamp: result.actionFrames[35].timestamp,
                        description: "Checked if i <= 10.",
                    },
                    {
                        line: 3,
                        operation: "loop_end",
                        timestamp: result.actionFrames[36].timestamp,
                        description: "End of loop from_to loop",
                    },
                ],
            });
        });
    });
});

export default JsonConverter;
