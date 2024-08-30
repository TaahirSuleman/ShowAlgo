import { expect } from "chai";
import Transformer from "../src/helpers/transformer.js";
import Program from "../src/models/ast/Program.js";
import VariableDeclaration from "../src/models/ast/VariableDeclaration.js";
import PrintStatement from "../src/models/ast/PrintStatement.js";
import ArrayCreation from "../src/models/ast/ArrayCreation.js";
import IfStatement from "../src/models/ast/IfStatement.js";
import FunctionDeclaration from "../src/models/ast/FunctionDeclaration.js";
import ForLoop from "../src/models/ast/ForLoop.js";
import LoopUntil from "../src/models/ast/LoopUntil.js";
import LoopFromTo from "../src/models/ast/LoopFromTo.js";
import WhileLoop from "../src/models/ast/WhileLoop.js";
import ReturnStatement from "../src/models/ast/ReturnStatement.js";
import Expression from "../src/models/ast/Expression.js";

describe("Transformer", () => {
    let transformer;

    beforeEach(() => {
        transformer = new Transformer();
    });

    it("should correctly transform a simple length operation on a string", () => {
        const ast = {
            type: "Program",
            body: [
                {
                    type: "VariableDeclaration",
                    varName: "lengthOfString",
                    value: {
                        type: "LengthExpression",
                        source: {
                            type: "Identifier",
                            value: "myString",
                            line: 2,
                        },
                        line: 2,
                    },
                    line: 2,
                },
            ],
        };

        const expectedIR = {
            program: [
                {
                    type: "VariableDeclaration",
                    name: "lengthOfString",
                    value: {
                        type: "LengthExpression",
                        source: "myString",
                    },
                },
            ],
        };

        const result = transformer.transform(ast);
        expect(result).to.deep.equal(expectedIR);
    });

    it("should correctly transform a length operation on a variable within an expression", () => {
        const ast = {
            type: "Program",
            body: [
                {
                    type: "VariableDeclaration",
                    varName: "halfLength",
                    value: {
                        type: "Expression",
                        left: {
                            type: "LengthExpression",
                            source: {
                                type: "Identifier",
                                value: "myString",
                                line: 3,
                            },
                            line: 3,
                        },
                        operator: "/",
                        right: {
                            type: "NumberLiteral",
                            value: "2",
                            line: 3,
                        },
                        line: 3,
                    },
                    line: 3,
                },
            ],
        };

        const expectedIR = {
            program: [
                {
                    type: "VariableDeclaration",
                    name: "halfLength",
                    value: {
                        type: "Expression",
                        left: {
                            type: "LengthExpression",
                            source: "myString",
                        },
                        operator: "/",
                        right: "2",
                    },
                },
            ],
        };

        const result = transformer.transform(ast);
        expect(result).to.deep.equal(expectedIR);
    });

    it("should correctly transform a length operation in a conditional statement", () => {
        const ast = {
            type: "Program",
            body: [
                {
                    type: "IfStatement",
                    condition: {
                        type: "Expression",
                        left: {
                            type: "LengthExpression",
                            source: {
                                type: "Identifier",
                                value: "myString",
                                line: 4,
                            },
                            line: 4,
                        },
                        operator: ">",
                        right: {
                            type: "NumberLiteral",
                            value: "10",
                            line: 4,
                        },
                        line: 4,
                    },
                    consequent: [
                        {
                            type: "PrintStatement",
                            value: {
                                type: "StringLiteral",
                                value: "String is longer than 10 characters",
                                line: 5,
                            },
                            line: 5,
                        },
                    ],
                    alternate: null,
                    line: 4,
                },
            ],
        };

        const expectedIR = {
            program: [
                {
                    type: "IfStatement",
                    condition: {
                        left: {
                            type: "LengthExpression",
                            source: "myString",
                        },
                        operator: ">",
                        right: "10",
                    },
                    consequent: [
                        {
                            type: "PrintStatement",
                            value: "String is longer than 10 characters",
                        },
                    ],
                    alternate: null,
                },
            ],
        };

        const result = transformer.transform(ast);
        expect(result).to.deep.equal(expectedIR);
    });

    it("should correctly transform a length operation with undeclared variable", () => {
        const ast = {
            type: "Program",
            body: [
                {
                    type: "VariableDeclaration",
                    varName: "lengthOfSomething",
                    value: {
                        type: "LengthExpression",
                        source: {
                            type: "Identifier",
                            value: "undeclaredVar",
                            line: 2,
                        },
                        line: 2,
                    },
                    line: 2,
                },
            ],
        };

        const expectedIR = {
            program: [
                {
                    type: "VariableDeclaration",
                    name: "lengthOfSomething",
                    value: {
                        type: "LengthExpression",
                        source: "undeclaredVar",
                    },
                },
            ],
        };

        const result = transformer.transform(ast);
        expect(result).to.deep.equal(expectedIR);
    });

    it("should correctly transform nested length operations", () => {
        const ast = {
            type: "Program",
            body: [
                {
                    type: "VariableDeclaration",
                    varName: "lengthSum",
                    value: {
                        type: "Expression",
                        left: {
                            type: "LengthExpression",
                            source: {
                                type: "Identifier",
                                value: "stringOne",
                                line: 3,
                            },
                            line: 3,
                        },
                        operator: "+",
                        right: {
                            type: "LengthExpression",
                            source: {
                                type: "Identifier",
                                value: "stringTwo",
                                line: 3,
                            },
                            line: 3,
                        },
                        line: 3,
                    },
                    line: 3,
                },
            ],
        };

        const expectedIR = {
            program: [
                {
                    type: "VariableDeclaration",
                    name: "lengthSum",
                    value: {
                        type: "Expression",
                        left: {
                            type: "LengthExpression",
                            source: "stringOne",
                        },
                        operator: "+",
                        right: {
                            type: "LengthExpression",
                            source: "stringTwo",
                        },
                    },
                },
            ],
        };

        const result = transformer.transform(ast);
        expect(result).to.deep.equal(expectedIR);
    });

    it("should correctly transform a LENGTH OF operation with a string", () => {
        const ast = {
            type: "Program",
            body: [
                {
                    type: "VariableDeclaration",
                    varName: "myString",
                    varType: "string",
                    value: {
                        type: "StringLiteral",
                        value: "Hello, World!",
                        line: 2,
                    },
                    line: 2,
                },
                {
                    type: "VariableDeclaration",
                    varName: "lengthOfString",
                    varType: "number",
                    value: {
                        type: "LengthExpression",
                        source: {
                            type: "Identifier",
                            value: "myString",
                            line: 3,
                        },
                        line: 3,
                    },
                    line: 3,
                },
            ],
        };

        const expectedIR = {
            program: [
                {
                    type: "VariableDeclaration",
                    name: "myString",
                    value: {
                        line: 2,
                        type: "StringLiteral",
                        value: "Hello, World!",
                    },
                },
                {
                    type: "VariableDeclaration",
                    name: "lengthOfString",
                    value: {
                        type: "LengthExpression",
                        source: "myString",
                    }, // The length of "Hello, World!" is 13
                },
            ],
        };

        const transformer = new Transformer();
        const result = transformer.transform(ast);
        expect(result).to.deep.equal(expectedIR);
    });

    it("should correctly transform a substring operation that covers the entire string", () => {
        const ast = {
            type: "Program",
            body: [
                {
                    type: "VariableDeclaration",
                    varName: "subStr",
                    varType: null,
                    value: {
                        type: "SubstringExpression",
                        string: {
                            type: "Identifier",
                            value: "myString",
                            line: 3,
                        },
                        start: {
                            type: "NumberLiteral",
                            value: "0",
                            line: 3,
                        },
                        end: {
                            type: "NumberLiteral",
                            value: "12",
                            line: 3,
                        },
                        line: 3,
                    },
                    line: 3,
                },
            ],
        };

        const expectedIR = {
            program: [
                {
                    type: "VariableDeclaration",
                    name: "subStr",
                    value: {
                        type: "SubstringExpression",
                        string: "myString",
                        start: "0",
                        end: "12",
                    },
                },
            ],
        };

        const transformer = new Transformer();
        const result = transformer.transform(ast);

        expect(result).to.deep.equal(expectedIR);
    });

    it("should correctly transform a substring operation with hardcoded start and end indices", () => {
        const ast = {
            type: "Program",
            body: [
                {
                    type: "VariableDeclaration",
                    varName: "subStr",
                    varType: null,
                    value: {
                        type: "SubstringExpression",
                        string: {
                            type: "Identifier",
                            value: "myString",
                            line: 3,
                        },
                        start: {
                            type: "NumberLiteral",
                            value: "0",
                            line: 3,
                        },
                        end: {
                            type: "NumberLiteral",
                            value: "5",
                            line: 3,
                        },
                        line: 3,
                    },
                    line: 3,
                },
            ],
        };

        const expectedIR = {
            program: [
                {
                    type: "VariableDeclaration",
                    name: "subStr",
                    value: {
                        type: "SubstringExpression",
                        string: "myString",
                        start: "0",
                        end: "5",
                    },
                },
            ],
        };

        const transformer = new Transformer();
        const result = transformer.transform(ast);

        expect(result).to.deep.equal(expectedIR);
    });

    it("should correctly transform a substring operation with nested expressions", () => {
        const ast = {
            type: "Program",
            body: [
                {
                    type: "VariableDeclaration",
                    varName: "subStr",
                    varType: null,
                    value: {
                        type: "SubstringExpression",
                        string: {
                            type: "Identifier",
                            value: "myString",
                            line: 3,
                        },
                        start: {
                            type: "Expression",
                            left: {
                                type: "Identifier",
                                value: "startIndex",
                                line: 3,
                            },
                            operator: "+",
                            right: {
                                type: "NumberLiteral",
                                value: "2",
                                line: 3,
                            },
                            line: 3,
                        },
                        end: {
                            type: "Identifier",
                            value: "endIndex",
                            line: 3,
                        },
                        line: 3,
                    },
                    line: 3,
                },
            ],
        };

        const expectedIR = {
            program: [
                {
                    type: "VariableDeclaration",
                    name: "subStr",
                    value: {
                        type: "SubstringExpression",
                        string: "myString",
                        start: {
                            type: "Expression",
                            left: "startIndex",
                            operator: "+",
                            right: "2",
                        },
                        end: "endIndex",
                    },
                },
            ],
        };

        const transformer = new Transformer();
        const result = transformer.transform(ast);

        expect(result).to.deep.equal(expectedIR);
    });

    it("should correctly transform a substring operation with variable start and end", () => {
        const ast = {
            type: "Program",
            body: [
                {
                    type: "VariableDeclaration",
                    varName: "myString",
                    varType: null,
                    value: {
                        type: "StringLiteral",
                        value: "Hello, World!",
                        line: 1,
                    },
                    line: 1,
                },
                {
                    type: "VariableDeclaration",
                    varName: "startIndex",
                    varType: null,
                    value: {
                        type: "NumberLiteral",
                        value: "7",
                        line: 2,
                    },
                    line: 2,
                },
                {
                    type: "VariableDeclaration",
                    varName: "endIndex",
                    varType: null,
                    value: {
                        type: "NumberLiteral",
                        value: "12",
                        line: 3,
                    },
                    line: 3,
                },
                {
                    type: "VariableDeclaration",
                    varName: "subStr",
                    varType: null,
                    value: {
                        type: "SubstringExpression",
                        string: {
                            type: "Identifier",
                            value: "myString",
                            line: 4,
                        },
                        start: {
                            type: "Identifier",
                            value: "startIndex",
                            line: 4,
                        },
                        end: {
                            type: "Identifier",
                            value: "endIndex",
                            line: 4,
                        },
                        line: 4,
                    },
                    line: 4,
                },
                {
                    type: "PrintStatement",
                    value: {
                        type: "Identifier",
                        value: "subStr",
                        line: 5,
                    },
                    line: 5,
                },
            ],
        };

        const expectedIR = {
            program: [
                {
                    type: "VariableDeclaration",
                    name: "myString",
                    value: {
                        type: "StringLiteral",
                        value: "Hello, World!",
                        line: 1,
                    },
                },
                {
                    type: "VariableDeclaration",
                    name: "startIndex",
                    value: {
                        type: "NumberLiteral",
                        value: "7",
                        line: 2,
                    },
                },
                {
                    type: "VariableDeclaration",
                    name: "endIndex",
                    value: {
                        type: "NumberLiteral",
                        value: "12",
                        line: 3,
                    },
                },
                {
                    type: "VariableDeclaration",
                    name: "subStr",
                    value: {
                        type: "SubstringExpression",
                        string: "myString",
                        start: "startIndex",
                        end: "endIndex",
                    },
                },
                {
                    type: "PrintStatement",
                    value: "subStr",
                },
            ],
        };

        const transformer = new Transformer();
        const result = transformer.transform(ast);

        expect(result).to.deep.equal(expectedIR);
    });

    it("should correctly transform a simple substring operation", () => {
        const ast = {
            type: "Program",
            body: [
                {
                    type: "VariableDeclaration",
                    varName: "subStr",
                    varType: null,
                    value: {
                        type: "SubstringExpression",
                        string: {
                            type: "Identifier",
                            value: "myString",
                            line: 3,
                        },
                        start: {
                            type: "NumberLiteral",
                            value: "7",
                            line: 3,
                        },
                        end: {
                            type: "NumberLiteral",
                            value: "12",
                            line: 3,
                        },
                        line: 3,
                    },
                    line: 3,
                },
            ],
        };

        const expectedIR = {
            program: [
                {
                    type: "VariableDeclaration",
                    name: "subStr",
                    value: {
                        type: "SubstringExpression",
                        string: "myString",
                        start: "7",
                        end: "12",
                    },
                },
            ],
        };

        const transformer = new Transformer();
        const result = transformer.transform(ast);

        expect(result).to.deep.equal(expectedIR);
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
                                left: "a",
                                operator: "+",
                                right: "b",
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
                                left: "a",
                                operator: "+",
                                right: "b",
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
    it("should transform 'LOOP until' with high-level syntax", () => {
        const ast = new Program([
            new LoopUntil(
                new Expression("x", "greater", {
                    type: "NumberLiteral",
                    value: "5",
                }),
                [
                    new PrintStatement({
                        type: "Identifier",
                        value: "x",
                    }),
                    new VariableDeclaration(
                        "x",
                        null,
                        new Expression(
                            { type: "Identifier", value: "x" },
                            "+",
                            { type: "NumberLiteral", value: "1" }
                        )
                    ),
                ]
            ),
        ]);

        const expectedIR = {
            program: [
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

        const result = transformer.transform(ast);
        expect(result).to.deep.equal(expectedIR);
    });

    // Similar test case for 'FOR LOOP UNTIL'...

    it("should transform 'LOOP from to' with traditional syntax", () => {
        const ast = {
            type: "Program",
            body: [
                {
                    type: "LoopFromTo",
                    loopVariable: "i",
                    range: {
                        start: {
                            type: "NumberLiteral",
                            value: "0",
                            line: 2,
                        },
                        end: {
                            type: "NumberLiteral",
                            value: "10",
                            line: 2,
                        },
                    },
                    body: [
                        {
                            type: "PrintStatement",
                            value: {
                                type: "Identifier",
                                value: "i",
                                line: 3,
                            },
                            line: 3,
                        },
                    ],
                    line: 2,
                },
            ],
        };

        const expectedIR = {
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

        const result = transformer.transform(ast);
        expect(result).to.deep.equal(expectedIR);
    });

    it("should transform boolean literals correctly", () => {
        const ast = new Program([
            new VariableDeclaration("isTrue", null, {
                type: "BooleanLiteral",
                value: "true",
                line: 2,
            }),
            new VariableDeclaration("isFalse", null, {
                type: "BooleanLiteral",
                value: "false",
                line: 3,
            }),
        ]);

        const expectedIR = {
            program: [
                {
                    type: "VariableDeclaration",
                    name: "isTrue",
                    value: {
                        type: "BooleanLiteral",
                        value: "true",
                        line: 2,
                    },
                },
                {
                    type: "VariableDeclaration",
                    name: "isFalse",
                    value: {
                        type: "BooleanLiteral",
                        value: "false",
                        line: 3,
                    },
                },
            ],
        };

        const result = transformer.transform(ast);
        expect(result).to.deep.equal(expectedIR);
    });

    it("should transform boolean expressions correctly", () => {
        const ast = new Program([
            new VariableDeclaration("isTrue", null, {
                type: "BooleanLiteral",
                value: "true",
                line: 2,
            }),
            new VariableDeclaration("isFalse", null, {
                type: "BooleanLiteral",
                value: "false",
                line: 3,
            }),
            new IfStatement(
                new Expression("isTrue", "and", {
                    type: "Identifier",
                    value: "isFalse",
                    line: 4,
                }),
                [
                    new PrintStatement({
                        type: "StringLiteral",
                        value: "Both are booleans",
                        line: 4,
                    }),
                ],
                null
            ),
        ]);

        const expectedIR = {
            program: [
                {
                    type: "VariableDeclaration",
                    name: "isTrue",
                    value: {
                        type: "BooleanLiteral",
                        value: "true",
                        line: 2,
                    },
                },
                {
                    type: "VariableDeclaration",
                    name: "isFalse",
                    value: {
                        type: "BooleanLiteral",
                        value: "false",
                        line: 3,
                    },
                },
                {
                    type: "IfStatement",
                    condition: {
                        left: "isTrue",
                        operator: "and",
                        right: "isFalse",
                    },
                    consequent: [
                        {
                            type: "PrintStatement",
                            value: "Both are booleans",
                        },
                    ],
                    alternate: null,
                },
            ],
        };

        const result = transformer.transform(ast);
        expect(result).to.deep.equal(expectedIR);
    });

    it("should transform NOT operator correctly", () => {
        const ast = new Program([
            new VariableDeclaration("isTrue", null, {
                type: "BooleanLiteral",
                value: "true",
                line: 2,
            }),
            new IfStatement(
                new Expression(null, "not", {
                    type: "Identifier",
                    value: "isTrue",
                    line: 3,
                }),
                [
                    new PrintStatement({
                        type: "StringLiteral",
                        value: "isTrue is false",
                        line: 3,
                    }),
                ],
                null
            ),
        ]);

        const expectedIR = {
            program: [
                {
                    type: "VariableDeclaration",
                    name: "isTrue",
                    value: {
                        type: "BooleanLiteral",
                        value: "true",
                        line: 2,
                    },
                },
                {
                    type: "IfStatement",
                    condition: {
                        left: null,
                        operator: "not",
                        right: "isTrue",
                    },
                    consequent: [
                        {
                            type: "PrintStatement",
                            value: "isTrue is false",
                        },
                    ],
                    alternate: null,
                },
            ],
        };

        const result = transformer.transform(ast);
        expect(result).to.deep.equal(expectedIR);
    });

    it("should transform boolean comparisons correctly", () => {
        const ast = new Program([
            new VariableDeclaration("isTrue", null, {
                type: "BooleanLiteral",
                value: "true",
                line: 2,
            }),
            new VariableDeclaration(
                "result",
                null,
                new Expression("isTrue", "=", {
                    type: "BooleanLiteral",
                    value: "false",
                    line: 3,
                })
            ),
        ]);

        const expectedIR = {
            program: [
                {
                    type: "VariableDeclaration",
                    name: "isTrue",
                    value: {
                        type: "BooleanLiteral",
                        value: "true",
                        line: 2,
                    },
                },
                {
                    type: "VariableDeclaration",
                    name: "result",
                    value: {
                        type: "Expression",
                        left: "isTrue",
                        operator: "=",
                        right: "false",
                    },
                },
            ],
        };

        const result = transformer.transform(ast);
        expect(result).to.deep.equal(expectedIR);
    });

    it("should handle boolean expressions with mixed operators correctly", () => {
        const ast = new Program([
            new VariableDeclaration("isTrue", null, {
                type: "BooleanLiteral",
                value: "true",
                line: 2,
            }),
            new VariableDeclaration("isFalse", null, {
                type: "BooleanLiteral",
                value: "false",
                line: 3,
            }),
            new IfStatement(
                new Expression(
                    "isTrue",
                    "and",
                    new Expression(null, "not", {
                        type: "Identifier",
                        value: "isFalse",
                        line: 4,
                    })
                ),
                [
                    new PrintStatement({
                        type: "StringLiteral",
                        value: "Correct",
                        line: 5,
                    }),
                ],
                [
                    new PrintStatement({
                        type: "StringLiteral",
                        value: "Incorrect",
                        line: 7,
                    }),
                ]
            ),
        ]);

        const expectedIR = {
            program: [
                {
                    type: "VariableDeclaration",
                    name: "isTrue",
                    value: {
                        type: "BooleanLiteral",
                        value: "true",
                        line: 2,
                    },
                },
                {
                    type: "VariableDeclaration",
                    name: "isFalse",
                    value: {
                        type: "BooleanLiteral",
                        value: "false",
                        line: 3,
                    },
                },
                {
                    type: "IfStatement",
                    condition: {
                        left: "isTrue",
                        operator: "and",
                        right: {
                            type: "UnaryExpression",
                            operator: "not",
                            argument: "isFalse",
                        },
                    },
                    consequent: [
                        {
                            type: "PrintStatement",
                            value: "Correct",
                        },
                    ],
                    alternate: [
                        {
                            type: "PrintStatement",
                            value: "Incorrect",
                        },
                    ],
                },
            ],
        };

        const result = transformer.transform(ast);
        expect(result).to.deep.equal(expectedIR);
    });
    it("should handle complex boolean logic correctly", () => {
        const ast = new Program([
            new VariableDeclaration("isTrue", null, {
                type: "BooleanLiteral",
                value: "true",
                line: 2,
            }),
            new VariableDeclaration("isFalse", null, {
                type: "BooleanLiteral",
                value: "false",
                line: 3,
            }),
            new IfStatement(
                new Expression(
                    "isTrue",
                    "or",
                    new Expression(
                        "isFalse",
                        "and",
                        new Expression(
                            null,
                            "not",
                            {
                                type: "Identifier",
                                value: "isTrue",
                                line: 4,
                            },
                            4
                        )
                    )
                ),
                [
                    new PrintStatement({
                        type: "StringLiteral",
                        value: "Complex Condition Met",
                        line: 5,
                    }),
                ],
                [
                    new PrintStatement({
                        type: "StringLiteral",
                        value: "Complex Condition Not Met",
                        line: 7,
                    }),
                ]
            ),
        ]);

        const expectedIR = {
            program: [
                {
                    type: "VariableDeclaration",
                    name: "isTrue",
                    value: {
                        type: "BooleanLiteral",
                        value: "true",
                        line: 2,
                    },
                },
                {
                    type: "VariableDeclaration",
                    name: "isFalse",
                    value: {
                        type: "BooleanLiteral",
                        value: "false",
                        line: 3,
                    },
                },
                {
                    type: "IfStatement",
                    condition: {
                        left: "isTrue",
                        operator: "or",
                        right: {
                            type: "Expression",
                            left: "isFalse",
                            operator: "and",
                            right: {
                                type: "UnaryExpression",
                                operator: "not",
                                argument: "isTrue",
                            },
                        },
                    },
                    consequent: [
                        {
                            type: "PrintStatement",
                            value: "Complex Condition Met",
                        },
                    ],
                    alternate: [
                        {
                            type: "PrintStatement",
                            value: "Complex Condition Not Met",
                        },
                    ],
                },
            ],
        };

        const result = transformer.transform(ast);
        expect(result).to.deep.equal(expectedIR);
    });
    it("should transform a variable set to a boolean and use it in a conditional", () => {
        const ast = new Program([
            new VariableDeclaration("isTrue", null, {
                type: "BooleanLiteral",
                value: true,
                line: 2,
            }),
            new IfStatement(
                { type: "Identifier", value: "isTrue", line: 3 },
                [
                    new PrintStatement({
                        type: "StringLiteral",
                        value: "Boolean is true",
                        line: 4,
                    }),
                ],
                [
                    new PrintStatement({
                        type: "StringLiteral",
                        value: "Boolean is false",
                        line: 6,
                    }),
                ],
                3
            ),
        ]);

        const expectedIR = {
            program: [
                {
                    type: "VariableDeclaration",
                    name: "isTrue",
                    value: {
                        type: "BooleanLiteral",
                        value: true,
                        line: 2,
                    },
                },
                {
                    type: "IfStatement",
                    condition: {
                        type: "Identifier",
                        value: "isTrue",
                    },
                    consequent: [
                        {
                            type: "PrintStatement",
                            value: "Boolean is true",
                        },
                    ],
                    alternate: [
                        {
                            type: "PrintStatement",
                            value: "Boolean is false",
                        },
                    ],
                },
            ],
        };

        const result = transformer.transform(ast);
        expect(result).to.deep.equal(expectedIR);
    });
});
