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
                        value: {
                            type: "BooleanLiteral",
                            value: true,
                            line: 2,
                        },
                    },
                    {
                        type: "VariableDeclaration",
                        name: "isFalse",
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
                        value: {
                            type: "BooleanLiteral",
                            value: true,
                            line: 2,
                        },
                    },
                    {
                        type: "VariableDeclaration",
                        name: "isFalse",
                        value: {
                            type: "BooleanLiteral",
                            value: false,
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
                        value: {
                            type: "BooleanLiteral",
                            value: true,
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
            },
        },
        {
            description: "should process boolean comparisons correctly",
            pseudocode: `
                SET isTrue TO true
                SET result TO isTrue = false
            `,
            expectedIR: {
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
                        type: "VariableDeclaration",
                        name: "result",
                        value: {
                            type: "Expression",
                            left: "isTrue",
                            operator: "=",
                            right: {
                                type: "BooleanLiteral",
                                value: false,
                                line: 3,
                            },
                        },
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
                        value: {
                            type: "BooleanLiteral",
                            value: true,
                            line: 2,
                        },
                    },
                    {
                        type: "VariableDeclaration",
                        name: "isFalse",
                        value: {
                            type: "BooleanLiteral",
                            value: false,
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
            },
        },
        {
            description: "should handle complex boolean logic correctly",
            pseudocode: `
                SET isTrue TO true
                SET isFalse TO false
                IF isTrue OR (isFalse AND NOT isTrue) THEN 
                    PRINT "Complex Condition Met" 
                OTHERWISE 
                    PRINT "Complex Condition Not Met" 
                END IF
            `,
            expectedIR: {
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
                        type: "VariableDeclaration",
                        name: "isFalse",
                        value: {
                            type: "BooleanLiteral",
                            value: false,
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
                        name: "add_numbers",
                        params: ["a", "b"],
                        startLine: 1,
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
                        endLine: 2,
                        body: [
                            {
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
            },
        },
        {
            description: "should process complex pseudocode correctly",
            pseudocode: `SET x TO 10
DEFINE add_numbers WITH PARAMETERS (a, b)
    RETURN a + b
END FUNCTION
IF x IS greater THAN 5 THEN
    PRINT "x is greater than 5"
OTHERWISE
    PRINT "x is not greater than 5"
END IF
FOR EACH num IN nums
    PRINT num
END FOR
WHILE x > 0
    PRINT x
    SET x TO x - 1
END WHILE`,
            expectedIR: {
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
                        startLine: 2,
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
                        endLine: 11,
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
