import { expect } from "chai";
import Tokenizer from "../src/helpers/tokenizer.js";
import Parser from "../src/models/parser.js";
import Transformer from "../src/helpers/transformer.js";

describe("Tokenizer, Parser, and Transformer Integration", () => {
    let tokenizer, parser, transformer;

    beforeEach(() => {
        transformer = new Transformer();
    });

    const testCases = [
        {
            description: "should process boolean literals correctly",
            pseudocode: `
                SET isTrue TO true
                SET isFalse TO false
            `,
            expectedIR: {
                program: [
                    {
                        type: "VariableDeclaration",
                        name: "isTrue",
                        line: 2,
                        value: {
                            type: "BooleanLiteral",
                            value: true,
                            line: 2,
                        },
                    },
                    {
                        type: "VariableDeclaration",
                        name: "isFalse",
                        line: 3,
                        value: {
                            type: "BooleanLiteral",
                            value: false,
                            line: 3,
                        },
                    },
                ],
            },
        },
        {
            description: "should process boolean expressions correctly",
            pseudocode: `
                SET isTrue TO true
                SET isFalse TO false
                IF isTrue AND isFalse THEN PRINT "Both are booleans" END IF
            `,
            expectedIR: {
                program: [
                    {
                        type: "VariableDeclaration",
                        name: "isTrue",
                        line: 2,
                        value: {
                            type: "BooleanLiteral",
                            value: true,
                            line: 2,
                        },
                    },
                    {
                        type: "VariableDeclaration",
                        name: "isFalse",
                        line: 3,
                        value: {
                            type: "BooleanLiteral",
                            value: false,
                            line: 3,
                        },
                    },
                    {
                        type: "IfStatement",
                        condition: {
                            line: 4,
                            left: "isTrue",
                            operator: "and",
                            right: "isFalse",
                        },
                        consequent: [
                            {
                                line: 4,
                                type: "PrintStatement",
                                value: "Both are booleans",
                            },
                        ],
                        line: 4,
                        endLine: 4,
                        alternate: null,
                    },
                ],
            },
        },
        {
            description: "should process NOT operator correctly",
            pseudocode: `
                SET isTrue TO true
                IF NOT isTrue THEN PRINT "isTrue is false" END IF
            `,
            expectedIR: {
                program: [
                    {
                        type: "VariableDeclaration",
                        name: "isTrue",
                        line: 2,
                        value: {
                            type: "BooleanLiteral",
                            value: true,
                            line: 2,
                        },
                    },
                    {
                        type: "IfStatement",
                        condition: {
                            line: 3,
                            left: null,
                            operator: "not",
                            right: "isTrue",
                        },
                        consequent: [
                            {
                                line: 3,
                                type: "PrintStatement",
                                value: "isTrue is false",
                            },
                        ],
                        line: 3,
                        endLine: 3,
                        alternate: null,
                    },
                ],
            },
        },

        {
            description:
                "should handle boolean expressions with mixed operators correctly",
            pseudocode: `
                SET isTrue TO true
                SET isFalse TO false
                IF isTrue AND NOT isFalse THEN 
                    PRINT "Correct" 
                OTHERWISE 
                    PRINT "Incorrect" 
                END IF
            `,
            expectedIR: {
                program: [
                    {
                        type: "VariableDeclaration",
                        name: "isTrue",
                        line: 2,
                        value: {
                            type: "BooleanLiteral",
                            value: true,
                            line: 2,
                        },
                    },
                    {
                        type: "VariableDeclaration",
                        name: "isFalse",
                        line: 3,
                        value: {
                            type: "BooleanLiteral",
                            value: false,
                            line: 3,
                        },
                    },
                    {
                        type: "IfStatement",
                        condition: {
                            line: 4,
                            left: "isTrue",
                            operator: "and",
                            right: {
                                line: 4,
                                type: "UnaryExpression",
                                operator: "not",
                                argument: "isFalse",
                            },
                        },
                        consequent: [
                            {
                                line: 5,
                                type: "PrintStatement",
                                value: "Correct",
                            },
                        ],
                        alternate: [
                            {
                                line: 7,
                                type: "PrintStatement",
                                value: "Incorrect",
                            },
                        ],
                        line: 4,
                        endLine: 4,
                    },
                ],
            },
        },

        {
            description: "should process variable declarations correctly",
            pseudocode: `SET x TO 10`,
            expectedIR: {
                program: [
                    {
                        type: "VariableDeclaration",
                        name: "x",
                        line: 1,
                        value: {
                            line: 1,
                            type: "NumberLiteral",
                            value: "10",
                        },
                    },
                ],
            },
        },
        {
            description: "should process function declarations correctly",
            pseudocode: `DEFINE add_numbers WITH PARAMETERS (a, b)
    RETURN a + b
END FUNCTION`,
            expectedIR: {
                program: [
                    {
                        type: "FunctionDeclaration",
                        line: 1,
                        name: "add_numbers",
                        params: ["a", "b"],
                        body: [
                            {
                                line: 2,
                                type: "ReturnStatement",
                                value: {
                                    line: 3,
                                    type: "Expression",
                                    left: "a",
                                    operator: "+",
                                    right: "b",
                                },
                            },
                        ],
                    },
                ],
            },
        },
        {
            description: "should process if statements correctly",
            pseudocode: `IF x IS greater THAN 5 THEN
    PRINT "x is greater than 5"
OTHERWISE
    PRINT "x is not greater than 5"
END IF`,
            expectedIR: {
                program: [
                    {
                        type: "IfStatement",
                        condition: {
                            line: 1,
                            left: "x",
                            operator: ">",
                            right: "5",
                        },
                        consequent: [
                            {
                                line: 2,
                                type: "PrintStatement",
                                value: "x is greater than 5",
                            },
                        ],
                        alternate: [
                            {
                                line: 4,
                                type: "PrintStatement",
                                value: "x is not greater than 5",
                            },
                        ],
                        line: 1,
                        endLine: 1,
                    },
                ],
            },
        },
        {
            description: "should process for loops correctly",
            pseudocode: `FOR EACH num IN nums
    PRINT num
END FOR`,
            expectedIR: {
                program: [
                    {
                        type: "ForLoop",
                        iterator: "num",
                        collection: "nums",
                        line: 1,
                        endLine: 2,
                        body: [
                            {
                                line: 2,
                                type: "PrintStatement",
                                value: "num",
                            },
                        ],
                    },
                ],
            },
        },
        {
            description: "should process while loops correctly",
            pseudocode: `WHILE x > 0
    PRINT x
    SET x TO x - 1
END WHILE`,
            expectedIR: {
                program: [
                    {
                        type: "WhileLoop",
                        line: 1,
                        condition: {
                            line: 1,
                            left: "x",
                            operator: ">",
                            right: "0",
                        },
                        body: [
                            {
                                line: 2,
                                type: "PrintStatement",
                                value: "x",
                            },
                            {
                                type: "VariableDeclaration",
                                name: "x",
                                line: 3,
                                value: {
                                    type: "Expression",
                                    line: 4,
                                    left: "x",
                                    operator: "-",
                                    right: "1",
                                },
                            },
                        ],
                    },
                ],
            },
        },
    ];

    testCases.forEach(({ description, pseudocode, expectedIR }) => {
        it(description, () => {
            tokenizer = new Tokenizer(pseudocode);
            const tokens = tokenizer.tokenize();

            parser = new Parser(tokens);
            const ast = parser.parse();

            const result = transformer.transform(ast);
            expect(result).to.deep.equal(expectedIR);
        });
    });
});
