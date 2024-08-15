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
                        operator: "greater",
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
                        operator: "greater",
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
                    operation: "loop_until",
                    condition: "x > 5",
                    body: [
                        {
                            line: 3,
                            operation: "print",
                            isLiteral: false,
                            varName: "x",
                            literal: 0, // Reflecting the value of x at this point
                            timestamp: result.actionFrames[1].body[0].timestamp,
                            description: "Printed x.",
                        },
                        {
                            line: 4,
                            operation: "set",
                            varName: "x",
                            type: "number",
                            value: 1,
                            timestamp: result.actionFrames[1].body[1].timestamp,
                            description: "Set variable x to x + 1.",
                        },
                    ],
                    timestamp: result.actionFrames[1].timestamp,
                    description: "Loop until x > 5.",
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
                    operation: "loop_until",
                    condition: "x > 5",
                    body: [
                        {
                            line: 3,
                            operation: "print",
                            isLiteral: false,
                            varName: "x",
                            literal: 0, // Reflecting the value of x at this point
                            timestamp: result.actionFrames[1].body[0].timestamp,
                            description: "Printed x.",
                        },
                        {
                            line: 4,
                            operation: "set",
                            varName: "x",
                            type: "number",
                            value: 1,
                            timestamp: result.actionFrames[1].body[1].timestamp,
                            description: "Set variable x to x + 1.",
                        },
                    ],
                    timestamp: result.actionFrames[1].timestamp,
                    description: "Loop until x > 5.",
                },
            ],
        });
    });

    it("should convert 'FOR LOOP until' with high-level syntax", () => {
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
                        operator: "greater",
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
                    operation: "loop_until",
                    condition: "x > 5",
                    body: [
                        {
                            line: 3,
                            operation: "print",
                            isLiteral: false,
                            varName: "x",
                            literal: 0, // Reflecting the value of x at this point
                            timestamp: result.actionFrames[1].body[0].timestamp,
                            description: "Printed x.",
                        },
                        {
                            line: 4,
                            operation: "set",
                            varName: "x",
                            type: "number",
                            value: 1,
                            timestamp: result.actionFrames[1].body[1].timestamp,
                            description: "Set variable x to x + 1.",
                        },
                    ],
                    timestamp: result.actionFrames[1].timestamp,
                    description: "Loop until x > 5.",
                },
            ],
        });
    });

    it("should convert 'FOR LOOP UNTIL' with traditional syntax", () => {
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
                    operation: "loop_until",
                    condition: "x > 5",
                    body: [
                        {
                            line: 3,
                            operation: "print",
                            isLiteral: false,
                            varName: "x",
                            literal: 0, // Reflecting the value of x at this point
                            timestamp: result.actionFrames[1].body[0].timestamp,
                            description: "Printed x.",
                        },
                        {
                            line: 4,
                            operation: "set",
                            varName: "x",
                            type: "number",
                            value: 1,
                            timestamp: result.actionFrames[1].body[1].timestamp,
                            description: "Set variable x to x + 1.",
                        },
                    ],
                    timestamp: result.actionFrames[1].timestamp,
                    description: "Loop until x > 5.",
                },
            ],
        });
    });

    it("should convert 'LOOP from up to' with high-level syntax", () => {
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
                    line: 2, // Check the line number based on JSON
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 0,
                    timestamp: result.actionFrames[0].timestamp,
                    description: "Set variable i to number 0.",
                },
                {
                    line: 4,
                    operation: "loop_from_to",
                    range: "0 to 10",
                    body: [
                        {
                            line: 3,
                            operation: "print",
                            isLiteral: false,
                            varName: "i",
                            literal: 0, // Reflecting the value of i at this point
                            timestamp:
                                result.actionFrames[1]?.body[0]?.timestamp ||
                                new Date().toISOString(),
                            description: "Printed i.",
                        },
                    ],
                    timestamp:
                        result.actionFrames[1]?.timestamp ||
                        new Date().toISOString(),
                    description: "Loop from 0 to 10.",
                },
            ],
        });
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
                    line: 2, // Check the line number based on JSON
                    operation: "set",
                    varName: "i",
                    type: "number",
                    value: 0,
                    timestamp: result.actionFrames[0].timestamp,
                    description: "Set variable i to number 0.",
                },
                {
                    line: 4,
                    operation: "loop_from_to",
                    range: "0 to 10",
                    body: [
                        {
                            line: 3,
                            operation: "print",
                            isLiteral: false,
                            varName: "i",
                            literal: 0, // Reflecting the value of i at this point
                            timestamp:
                                result.actionFrames[1]?.body[0]?.timestamp ||
                                new Date().toISOString(),
                            description: "Printed i.",
                        },
                    ],
                    timestamp:
                        result.actionFrames[1]?.timestamp ||
                        new Date().toISOString(),
                    description: "Loop from 0 to 10.",
                },
            ],
        });
    });
});

export default JsonConverter;
