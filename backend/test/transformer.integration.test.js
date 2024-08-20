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
