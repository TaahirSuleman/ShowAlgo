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
                    value: "10",
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
                    value: "10",
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
                    operation: "if",
                    condition: "10 greater 5",
                    result: true,
                    timestamp: result.actionFrames[0].timestamp,
                    description: "Checked if 10 greater 5.",
                },
                {
                    line: 2,
                    operation: "print",
                    isLiteral: true,
                    varName: null,
                    literal: "x is greater than 5",
                    timestamp: result.actionFrames[1].timestamp,
                    description: "Printed x is greater than 5.",
                },
            ],
        });
    });

    // Add more tests for ForLoop, WhileLoop, and other scenarios as needed
});

export default JsonConverter;
