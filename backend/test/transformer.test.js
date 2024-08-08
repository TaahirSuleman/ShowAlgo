import { expect } from "chai";
import Transformer from "../src/helpers/transformer.js";
import Program from "../src/models/ast/Program.js";
import VariableDeclaration from "../src/models/ast/VariableDeclaration.js";
import PrintStatement from "../src/models/ast/PrintStatement.js";
import ArrayCreation from "../src/models/ast/ArrayCreation.js";
import IfStatement from "../src/models/ast/IfStatement.js";
import FunctionDeclaration from "../src/models/ast/FunctionDeclaration.js";
import ForLoop from "../src/models/ast/ForLoop.js";
import WhileLoop from "../src/models/ast/WhileLoop.js";
import ReturnStatement from "../src/models/ast/ReturnStatement.js";
import Expression from "../src/models/ast/Expression.js";

describe("Transformer", () => {
    let transformer;

    beforeEach(() => {
        transformer = new Transformer();
    });

    it("should transform a VariableDeclaration node", () => {
        const ast = new Program([
            new VariableDeclaration("x", null, {
                type: "NumberLiteral",
                value: "10",
                line: 1,
            }),
        ]);

        const expectedIR = {
            program: [
                {
                    type: "VariableDeclaration",
                    name: "x",
                    value: {
                        line: 1,
                        type: "NumberLiteral",
                        value: "10",
                    },
                },
            ],
        };

        const result = transformer.transform(ast);
        expect(result).to.deep.equal(expectedIR);
    });

    it("should transform a FunctionDeclaration node", () => {
        const ast = new Program([
            new FunctionDeclaration(
                "add_numbers",
                ["a", "b"],
                [
                    new ReturnStatement(
                        new Expression(
                            { type: "Identifier", value: "a", line: 2 },
                            "+",
                            { type: "Identifier", value: "b", line: 2 }
                        )
                    ),
                ]
            ),
        ]);

        const expectedIR = {
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

        const result = transformer.transform(ast);
        expect(result).to.deep.equal(expectedIR);
    });

    it("should transform an IfStatement node", () => {
        const ast = new Program([
            new IfStatement(
                new Expression("x", "greater", {
                    type: "NumberLiteral",
                    value: "5",
                    line: 3,
                }),
                [
                    new PrintStatement({
                        type: "StringLiteral",
                        value: "x is greater than 5",
                        line: 4,
                    }),
                ],
                [
                    new PrintStatement({
                        type: "StringLiteral",
                        value: "x is not greater than 5",
                        line: 6,
                    }),
                ]
            ),
        ]);

        const expectedIR = {
            program: [
                {
                    type: "IfStatement",
                    condition: {
                        left: "x",
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

        const result = transformer.transform(ast);
        expect(result).to.deep.equal(expectedIR);
    });

    it("should transform a ForLoop node", () => {
        const ast = new Program([
            new ForLoop("num", "nums", [
                new PrintStatement({
                    type: "Identifier",
                    value: "num",
                    line: 8,
                }),
            ]),
        ]);

        const expectedIR = {
            program: [
                {
                    type: "ForLoop",
                    iterator: "num",
                    collection: "nums",
                    body: [
                        {
                            type: "PrintStatement",
                            value: "num",
                        },
                    ],
                },
            ],
        };

        const result = transformer.transform(ast);
        expect(result).to.deep.equal(expectedIR);
    });

    it("should transform a WhileLoop node", () => {
        const ast = new Program([
            new WhileLoop(
                new Expression("x", ">", {
                    type: "NumberLiteral",
                    value: "0",
                    line: 10,
                }),
                [
                    new PrintStatement({
                        type: "Identifier",
                        value: "x",
                        line: 11,
                    }),
                    new VariableDeclaration(
                        "x",
                        null,
                        new Expression(
                            { type: "Identifier", value: "x", line: 12 },
                            "-",
                            { type: "NumberLiteral", value: "1", line: 12 }
                        )
                    ),
                ]
            ),
        ]);

        const expectedIR = {
            program: [
                {
                    type: "WhileLoop",
                    condition: {
                        left: "x",
                        operator: ">",
                        right: "0",
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
                                operator: "-",
                                right: "1",
                            },
                        },
                    ],
                },
            ],
        };

        const result = transformer.transform(ast);
        expect(result).to.deep.equal(expectedIR);
    });

    it("should transform a complex AST", () => {
        const ast = new Program([
            new VariableDeclaration("x", null, {
                type: "NumberLiteral",
                value: "10",
                line: 1,
            }),
            new FunctionDeclaration(
                "add_numbers",
                ["a", "b"],
                [
                    new ReturnStatement(
                        new Expression(
                            { type: "Identifier", value: "a", line: 2 },
                            "+",
                            { type: "Identifier", value: "b", line: 2 }
                        )
                    ),
                ]
            ),
            new IfStatement(
                new Expression("x", "greater", {
                    type: "NumberLiteral",
                    value: "5",
                    line: 3,
                }),
                [
                    new PrintStatement({
                        type: "StringLiteral",
                        value: "x is greater than 5",
                        line: 4,
                    }),
                ],
                [
                    new PrintStatement({
                        type: "StringLiteral",
                        value: "x is not greater than 5",
                        line: 6,
                    }),
                ]
            ),
            new ForLoop("num", "nums", [
                new PrintStatement({
                    type: "Identifier",
                    value: "num",
                    line: 8,
                }),
            ]),
            new WhileLoop(
                new Expression("x", ">", {
                    type: "NumberLiteral",
                    value: "0",
                    line: 10,
                }),
                [
                    new PrintStatement({
                        type: "Identifier",
                        value: "x",
                        line: 11,
                    }),
                    new VariableDeclaration(
                        "x",
                        null,
                        new Expression(
                            { type: "Identifier", value: "x", line: 12 },
                            "-",
                            { type: "NumberLiteral", value: "1", line: 12 }
                        )
                    ),
                ]
            ),
        ]);

        const expectedIR = {
            program: [
                {
                    type: "VariableDeclaration",
                    name: "x",
                    value: {
                        line: 1,
                        type: "NumberLiteral",
                        value: "10",
                    },
                },
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
                {
                    type: "IfStatement",
                    condition: {
                        left: "x",
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
                {
                    type: "ForLoop",
                    iterator: "num",
                    collection: "nums",
                    body: [
                        {
                            type: "PrintStatement",
                            value: "num",
                        },
                    ],
                },
                {
                    type: "WhileLoop",
                    condition: {
                        left: "x",
                        operator: ">",
                        right: "0",
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
                                operator: "-",
                                right: "1",
                            },
                        },
                    ],
                },
            ],
        };

        const result = transformer.transform(ast);
        expect(result).to.deep.equal(expectedIR);
    });
});
