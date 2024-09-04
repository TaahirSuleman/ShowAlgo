import { expect } from "chai";
import Tokenizer from "../src/helpers/tokenizer.js";
import Parser from "../src/models/parser.js";

describe("Parser", () => {
    function tokenizeAndParse(pseudocode) {
        const tokenizer = new Tokenizer(pseudocode);
        const tokens = tokenizer.tokenize();
        const parser = new Parser(tokens);
        return parser.parse();
    }

    it("should correctly parse a basic indexing operation", () => {
        const pseudocode = `
            SET firstCharacter TO CHARACTER AT 0 OF myString
        `;

        const expectedAST = {
            type: "Program",
            body: [
                {
                    type: "VariableDeclaration",
                    varName: "firstCharacter",
                    varType: null,
                    value: {
                        type: "IndexExpression",
                        source: {
                            type: "Identifier",
                            value: "myString",
                            line: 2,
                        },
                        index: {
                            type: "NumberLiteral",
                            value: "0",
                            line: 2,
                        },
                        line: 2,
                    },
                    line: 2,
                },
            ],
        };

        const result = tokenizeAndParse(pseudocode);
        expect(result).to.deep.equal(expectedAST);
    });

    it("should correctly parse indexing with a variable index", () => {
        const pseudocode = `
            SET characterAtIndex TO CHARACTER AT index OF myString
        `;

        const expectedAST = {
            type: "Program",
            body: [
                {
                    type: "VariableDeclaration",
                    varName: "characterAtIndex",
                    varType: null,
                    value: {
                        type: "IndexExpression",
                        source: {
                            type: "Identifier",
                            value: "myString",
                            line: 2,
                        },
                        index: {
                            type: "Identifier",
                            value: "index",
                            line: 2,
                        },
                        line: 2,
                    },
                    line: 2,
                },
            ],
        };

        const result = tokenizeAndParse(pseudocode);
        expect(result).to.deep.equal(expectedAST);
    });

    it("should correctly parse indexing at the end of the string", () => {
        const pseudocode = `
            SET lastCharacter TO CHARACTER AT LENGTH OF myString - 1 OF myString
        `;

        const expectedAST = {
            type: "Program",
            body: [
                {
                    type: "VariableDeclaration",
                    varName: "lastCharacter",
                    varType: null,
                    value: {
                        type: "IndexExpression",
                        source: {
                            type: "Identifier",
                            value: "myString",
                            line: 2,
                        },
                        index: {
                            type: "Expression",
                            left: {
                                type: "LengthExpression",
                                source: {
                                    type: "Identifier",
                                    value: "myString",
                                    line: 2,
                                },
                                line: 2,
                            },
                            operator: "-",
                            right: {
                                type: "NumberLiteral",
                                value: "1",
                                line: 2,
                            },
                            line: 2,
                        },
                        line: 2,
                    },
                    line: 2,
                },
            ],
        };

        const result = tokenizeAndParse(pseudocode);
        expect(result).to.deep.equal(expectedAST);
    });

    it("should correctly parse indexing with a negative index", () => {
        const pseudocode = `
            SET invalidCharacter TO CHARACTER AT -1 OF myString
        `;

        const expectedAST = {
            type: "Program",
            body: [
                {
                    type: "VariableDeclaration",
                    varName: "invalidCharacter",
                    varType: null,
                    value: {
                        type: "IndexExpression",
                        source: {
                            type: "Identifier",
                            value: "myString",
                            line: 2,
                        },
                        index: {
                            type: "Expression",
                            left: {
                                type: "NumberLiteral",
                                value: 0,
                                line: 2,
                            },
                            operator: "-",
                            right: {
                                type: "NumberLiteral",
                                value: "1",
                                line: 2,
                            },
                            line: 2,
                        },
                        line: 2,
                    },
                    line: 2,
                },
            ],
        };

        const result = tokenizeAndParse(pseudocode);
        expect(result).to.deep.equal(expectedAST);
    });

    it("should correctly parse indexing an empty string", () => {
        const pseudocode = `
            SET emptyIndex TO CHARACTER AT 0 OF emptyString
        `;

        const expectedAST = {
            type: "Program",
            body: [
                {
                    type: "VariableDeclaration",
                    varName: "emptyIndex",
                    varType: null,
                    value: {
                        type: "IndexExpression",
                        source: {
                            type: "Identifier",
                            value: "emptyString",
                            line: 2,
                        },
                        index: {
                            type: "NumberLiteral",
                            value: "0",
                            line: 2,
                        },
                        line: 2,
                    },
                    line: 2,
                },
            ],
        };

        const result = tokenizeAndParse(pseudocode);
        expect(result).to.deep.equal(expectedAST);
    });

    it("should correctly parse traditional syntax for a basic indexing operation", () => {
        const pseudocode = `
            SET firstCharacter TO myString[0]
        `;

        const expectedAST = {
            type: "Program",
            body: [
                {
                    type: "VariableDeclaration",
                    varName: "firstCharacter",
                    varType: null,
                    value: {
                        type: "IndexExpression",
                        source: {
                            type: "Identifier",
                            value: "myString",
                            line: 2,
                        },
                        index: {
                            type: "NumberLiteral",
                            value: "0",
                            line: 2,
                        },
                        line: 2,
                    },
                    line: 2,
                },
            ],
        };

        const result = tokenizeAndParse(pseudocode);
        expect(result).to.deep.equal(expectedAST);
    });

    it("should correctly parse a LENGTH OF operation with a string containing special characters", () => {
        const pseudocode = `
            SET specialString TO string "@#$%^&*()"
            SET lengthOfSpecialString TO LENGTH OF specialString
        `;

        const expectedAST = {
            type: "Program",
            body: [
                {
                    type: "VariableDeclaration",
                    varName: "specialString",
                    varType: null,
                    value: {
                        type: "StringLiteral",
                        value: "@#$%^&*()",
                        line: 2,
                    },
                    line: 2,
                },
                {
                    type: "VariableDeclaration",
                    varName: "lengthOfSpecialString",
                    varType: null,
                    value: {
                        type: "LengthExpression",
                        source: {
                            type: "Identifier",
                            value: "specialString",
                            line: 3,
                        },
                        line: 3,
                    },
                    line: 3,
                },
            ],
        };

        const result = tokenizeAndParse(pseudocode);
        expect(result).to.deep.equal(expectedAST);
    });

    it("should correctly parse a LENGTH OF operation with an empty string", () => {
        const pseudocode = `
            SET myString TO string ""
            SET lengthOfString TO LENGTH OF myString
        `;

        const expectedAST = {
            type: "Program",
            body: [
                {
                    type: "VariableDeclaration",
                    varName: "myString",
                    varType: null,
                    value: {
                        type: "StringLiteral",
                        value: "",
                        line: 2,
                    },
                    line: 2,
                },
                {
                    type: "VariableDeclaration",
                    varName: "lengthOfString",
                    varType: null,
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

        const result = tokenizeAndParse(pseudocode);
        expect(result).to.deep.equal(expectedAST);
    });

    // Test case 1: Basic LENGTH OF operation with a string
    it("should correctly parse a LENGTH OF operation with a string", () => {
        const pseudocode = `
            SET myString TO string "Hello, World!"
            SET len TO LENGTH OF myString
        `;
        const ast = tokenizeAndParse(pseudocode);

        const expectedAST = {
            type: "Program",
            body: [
                {
                    type: "VariableDeclaration",
                    varName: "myString",
                    varType: null,
                    value: {
                        type: "StringLiteral",
                        value: "Hello, World!",
                        line: 2,
                    },
                    line: 2,
                },
                {
                    type: "VariableDeclaration",
                    varName: "len",
                    varType: null,
                    value: {
                        line: 3,
                        type: "LengthExpression",
                        source: {
                            type: "Identifier",
                            value: "myString",
                            line: 3,
                        },
                    },
                    line: 3,
                },
            ],
        };

        expect(ast).to.deep.equal(expectedAST);
    });

    // Test case 2: LENGTH OF operation with a string and additional operations
    it("should correctly parse a LENGTH OF operation followed by a print statement", () => {
        const pseudocode = `
            SET greeting TO string "Good Morning"
            SET greetingLength TO LENGTH OF greeting
            PRINT greetingLength
        `;
        const ast = tokenizeAndParse(pseudocode);

        const expectedAST = {
            type: "Program",
            body: [
                {
                    type: "VariableDeclaration",
                    varName: "greeting",
                    varType: null,
                    value: {
                        type: "StringLiteral",
                        value: "Good Morning",
                        line: 2,
                    },
                    line: 2,
                },
                {
                    type: "VariableDeclaration",
                    varName: "greetingLength",
                    varType: null,
                    value: {
                        line: 3,
                        type: "LengthExpression",
                        source: {
                            type: "Identifier",
                            value: "greeting",
                            line: 3,
                        },
                    },
                    line: 3,
                },
                {
                    type: "PrintStatement",
                    value: {
                        type: "Identifier",
                        value: "greetingLength",
                        line: 4,
                    },
                    line: 4,
                },
            ],
        };

        expect(ast).to.deep.equal(expectedAST);
    });

    // Test case 3: LENGTH OF operation with an undeclared variable
    it("should correctly parse a LENGTH OF operation with an undeclared variable", () => {
        const pseudocode = `
            SET nameLength TO LENGTH OF unknownVariable
        `;
        const ast = tokenizeAndParse(pseudocode);

        const expectedAST = {
            type: "Program",
            body: [
                {
                    type: "VariableDeclaration",
                    varName: "nameLength",
                    varType: null,
                    value: {
                        line: 2,
                        type: "LengthExpression",
                        source: {
                            type: "Identifier",
                            value: "unknownVariable",
                            line: 2,
                        },
                    },
                    line: 2,
                },
            ],
        };

        expect(ast).to.deep.equal(expectedAST);
    });

    it("should parse a valid substring operation correctly", () => {
        const pseudocode = `
            SET myString TO string "Hello, World!"
            SET subStr TO substring of myString from 7 to 12
            PRINT subStr
        `;
        const ast = tokenizeAndParse(pseudocode);
        expect(ast.body).to.have.lengthOf(3);

        const varDecl = ast.body[1];
        expect(varDecl.type).to.equal("VariableDeclaration");
        expect(varDecl.varName).to.equal("subStr");
        expect(varDecl.value.type).to.equal("SubstringExpression");
        expect(varDecl.value.string.value).to.equal("myString");
        expect(varDecl.value.start.value).to.equal("7");
        expect(varDecl.value.end.value).to.equal("12");

        const printStatement = ast.body[2];
        expect(printStatement.type).to.equal("PrintStatement");
        expect(printStatement.value.value).to.equal("subStr");
    });

    it("should throw an error if 'of' keyword is missing in substring operation", () => {
        const pseudocode = `
            SET subStr TO substring myString from 7 to 12
        `;
        expect(() => tokenizeAndParse(pseudocode)).to.throw(
            "Expected Keyword 'of', but found Identifier 'myString' at line 2"
        );
    });

    it("should throw an error if 'from' keyword is missing in substring operation", () => {
        const pseudocode = `
            SET subStr TO substring of myString 7 to 12
        `;
        expect(() => tokenizeAndParse(pseudocode)).to.throw(
            "Expected Keyword 'from', but found Number '7' at line 2"
        );
    });

    it("should throw an error if 'to' keyword is missing in substring operation", () => {
        const pseudocode = `
            SET subStr TO substring of myString from 7 12
        `;
        expect(() => tokenizeAndParse(pseudocode)).to.throw(
            "Expected Keyword 'to', but found Number '12' at line 2"
        );
    });

    it("should throw an error for an invalid nested substring operation", () => {
        const pseudocode = `
            SET myString TO string "Hello, World!"
            SET subStr TO substring of (substring of myString 1 to 5) from 2 to 4
            PRINT subStr
        `;
        expect(() => tokenizeAndParse(pseudocode)).to.throw(
            "Expected Identifier, but found Delimiter (() at line 3"
        );
    });

    it("should handle substring operations with variables as indices correctly", () => {
        const pseudocode = `
            SET myString TO string "Hello, World!"
            SET startIndex TO 7
            SET endIndex TO 12
            SET subStr TO substring of myString from startIndex to endIndex
            PRINT subStr
        `;
        const ast = tokenizeAndParse(pseudocode);
        expect(ast.body).to.have.lengthOf(5);

        const varDecl = ast.body[3];
        expect(varDecl.type).to.equal("VariableDeclaration");
        expect(varDecl.varName).to.equal("subStr");
        expect(varDecl.value.type).to.equal("SubstringExpression");
        expect(varDecl.value.string.value).to.equal("myString");
        expect(varDecl.value.start.value).to.equal("startIndex");
        expect(varDecl.value.end.value).to.equal("endIndex");
    });

    it("should throw an error if 'from' or 'to' are missing in a substring operation", () => {
        const pseudocode = `
            SET subStr TO substring of myString from to 12
        `;
        expect(() => tokenizeAndParse(pseudocode)).to.throw(
            "Unexpected value type: Keyword at line 2"
        );
    });

    it("should parse multiple substring operations in sequence", () => {
        const pseudocode = `
            SET myString TO string "Hello, World!"
            SET subStr1 TO substring of myString from 1 to 5
            SET subStr2 TO substring of myString from 7 to 12
            PRINT subStr1
            PRINT subStr2
        `;
        const ast = tokenizeAndParse(pseudocode);
        expect(ast.body).to.have.lengthOf(5);

        const varDecl1 = ast.body[1];
        const varDecl2 = ast.body[2];
        expect(varDecl1.varName).to.equal("subStr1");
        expect(varDecl2.varName).to.equal("subStr2");
        expect(varDecl1.value.type).to.equal("SubstringExpression");
        expect(varDecl2.value.type).to.equal("SubstringExpression");
    });

    it("should handle errors correctly", () => {
        const invalidPseudocode = `SET subStr TO substring of myString from 7 to`;
        expect(() => tokenizeAndParse(invalidPseudocode)).to.throw(
            "Unexpected value type: EOF at line 1"
        );
    });

    it("should parse substring operation correctly", () => {
        const pseudocode = `
            SET myString TO string "Hello, World!"
            SET subStr TO substring of myString FROM 7 TO 12
        `;
        const ast = tokenizeAndParse(pseudocode);

        const expectedAST = {
            type: "Program",
            body: [
                {
                    type: "VariableDeclaration",
                    varName: "myString",
                    varType: null,
                    value: {
                        type: "StringLiteral",
                        value: "Hello, World!",
                        line: 2,
                    },
                    line: 2,
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

        expect(ast).to.deep.equal(expectedAST);
    });

    it("should correctly parse a variable set to a boolean and use it in a conditional", () => {
        const pseudocode = `SET isTrue TO true
        IF isTrue THEN
            PRINT "Boolean is true"
        OTHERWISE
            PRINT "Boolean is false"
        END IF`;

        const expectedAST = {
            type: "Program",
            body: [
                {
                    type: "VariableDeclaration",
                    varName: "isTrue",
                    varType: null,
                    value: {
                        type: "BooleanLiteral",
                        value: true,
                        line: 1,
                    },
                    line: 1,
                },
                {
                    type: "IfStatement",
                    condition: {
                        type: "Identifier",
                        value: "isTrue",
                        line: 2,
                    },
                    consequent: [
                        {
                            type: "PrintStatement",
                            value: {
                                type: "StringLiteral",
                                value: "Boolean is true",
                                line: 3,
                            },
                            line: 3,
                        },
                    ],
                    alternate: [
                        {
                            type: "PrintStatement",
                            value: {
                                type: "StringLiteral",
                                value: "Boolean is false",
                                line: 5,
                            },
                            line: 5,
                        },
                    ],
                    line: 2,
                },
            ],
        };

        const result = tokenizeAndParse(pseudocode);

        expect(result).to.deep.equal(expectedAST);
    });
    it("should handle complex boolean logic correctly", () => {
        const pseudocode = `
            SET isTrue TO true
            SET isFalse TO false
            IF isTrue OR (isFalse AND NOT isTrue) THEN 
                PRINT "Complex Condition Met" 
            OTHERWISE 
                PRINT "Complex Condition Not Met" 
            END IF
        `;
        const ast = tokenizeAndParse(pseudocode);
        expect(ast.body).to.have.lengthOf(3);

        const ifStatement = ast.body[2];
        expect(ifStatement.type).to.equal("IfStatement");
        expect(ifStatement.condition.left).to.equal("isTrue");
        expect(ifStatement.condition.operator).to.equal("or");

        const innerCondition = ifStatement.condition.right;
        expect(innerCondition.left).to.equal("isFalse");
        expect(innerCondition.operator).to.equal("and");
        expect(innerCondition.right.operator).to.equal("not");
        expect(innerCondition.right.right.value).to.equal("isTrue");

        expect(ifStatement.consequent).to.have.lengthOf(1);
        const consequentPrint = ifStatement.consequent[0];
        expect(consequentPrint.type).to.equal("PrintStatement");
        expect(consequentPrint.value.value).to.equal("Complex Condition Met");

        expect(ifStatement.alternate).to.have.lengthOf(1);
        const alternatePrint = ifStatement.alternate[0];
        expect(alternatePrint.type).to.equal("PrintStatement");
        expect(alternatePrint.value.value).to.equal(
            "Complex Condition Not Met"
        );
        expect(ifStatement.line).to.equal(4);
    });

    it("should tokenize and parse function definitions correctly", () => {
        const pseudocode = `DEFINE add_numbers WITH PARAMETERS (a, b)
RETURN a + b
END FUNCTION`;
        const ast = tokenizeAndParse(pseudocode);
        expect(ast.body).to.have.lengthOf(1);
        const func = ast.body[0];
        expect(func.type).to.equal("FunctionDeclaration");
        expect(func.name).to.equal("add_numbers");
        expect(func.params).to.deep.equal(["a", "b"]);
        expect(func.body).to.have.lengthOf(1);
        const returnStatement = func.body[0];
        expect(returnStatement.type).to.equal("ReturnStatement");
        expect(returnStatement.value.left.value).to.equal("a");
        expect(returnStatement.value.operator).to.equal("+");
        expect(returnStatement.value.right.value).to.equal("b");
        expect(func.line).to.equal(1);
        expect(returnStatement.line).to.equal(2);
    });

    it("should tokenize and parse variable declarations correctly", () => {
        const pseudocode = `SET x TO 10`;
        const ast = tokenizeAndParse(pseudocode);
        expect(ast.body).to.have.lengthOf(1);
        const variable = ast.body[0];
        expect(variable.type).to.equal("VariableDeclaration");
        expect(variable.varName).to.equal("x");
        expect(variable.value.value).to.equal("10");
        expect(variable.line).to.equal(1);
        expect(variable.value.line).to.equal(1);
    });

    it("should tokenize and parse print statements correctly", () => {
        const pseudocode = `PRINT "Hello, World!"`;
        const ast = tokenizeAndParse(pseudocode);
        expect(ast.body).to.have.lengthOf(1);
        const printStatement = ast.body[0];
        expect(printStatement.type).to.equal("PrintStatement");
        expect(printStatement.value.value).to.equal("Hello, World!");
        expect(printStatement.line).to.equal(1);
        expect(printStatement.value.line).to.equal(1);
    });

    it("should tokenize and parse if statements correctly", () => {
        const pseudocode = `IF x IS greater THAN 5 THEN
PRINT "x is greater than 5"
OTHERWISE
PRINT "x is not greater than 5"
END IF`;
        const ast = tokenizeAndParse(pseudocode);
        expect(ast.body).to.have.lengthOf(1);
        const ifStatement = ast.body[0];
        expect(ifStatement.type).to.equal("IfStatement");
        expect(ifStatement.condition.left).to.equal("x");
        expect(ifStatement.condition.operator).to.equal("greater");
        expect(ifStatement.condition.right.value).to.equal("5");
        expect(ifStatement.consequent).to.have.lengthOf(1);
        expect(ifStatement.alternate).to.have.lengthOf(1);
        expect(ifStatement.line).to.equal(1);
        expect(ifStatement.condition.line).to.equal(1);
        //expect(ifStatement.condition.left.line).to.equal(1);
        //expect(ifStatement.condition.right.line).to.equal(1);
        expect(ifStatement.consequent[0].line).to.equal(2);
        expect(ifStatement.alternate[0].line).to.equal(4);
    });

    it("should tokenize and parse for loops correctly", () => {
        const pseudocode = `FOR EACH num IN nums
PRINT num
END FOR`;
        const ast = tokenizeAndParse(pseudocode);
        expect(ast.body).to.have.lengthOf(1);
        const forLoop = ast.body[0];
        expect(forLoop.type).to.equal("ForLoop");
        expect(forLoop.iterator).to.equal("num");
        expect(forLoop.collection).to.equal("nums");
        expect(forLoop.body).to.have.lengthOf(1);
        const printStatement = forLoop.body[0];
        expect(printStatement.type).to.equal("PrintStatement");
        expect(printStatement.value.value).to.equal("num");
        expect(forLoop.line).to.equal(1);
        expect(printStatement.line).to.equal(2);
        expect(printStatement.value.line).to.equal(2);
    });

    it("should tokenize and parse while loops correctly", () => {
        const pseudocode = `WHILE x > 0
PRINT x
SET x TO x - 1
END WHILE`;
        const ast = tokenizeAndParse(pseudocode);
        expect(ast.body).to.have.lengthOf(1);
        const whileLoop = ast.body[0];
        expect(whileLoop.type).to.equal("WhileLoop");
        expect(whileLoop.condition.left).to.equal("x");
        expect(whileLoop.condition.operator).to.equal(">");
        expect(whileLoop.condition.right.value).to.equal("0");
        expect(whileLoop.body).to.have.lengthOf(2);
        expect(whileLoop.line).to.equal(1);
        expect(whileLoop.condition.line).to.equal(1);
        //expect(whileLoop.condition.left.line).to.equal(1);
        //expect(whileLoop.condition.right.line).to.equal(1);
        expect(whileLoop.body[0].line).to.equal(2);
        expect(whileLoop.body[1].line).to.equal(3);
    });

    it("should handle errors correctly", () => {
        const invalidPseudocode = `SET x TO 10
 SET y TO "string`;
        try {
            tokenizeAndParse(invalidPseudocode);
            throw new Error("Expected error for invalid pseudocode");
        } catch (error) {
            expect(error.message).to.include("Unexpected end of string");
        }
    });
    it("should parse 'LOOP until' with high-level syntax correctly", () => {
        const pseudocode = `LOOP until x is greater than 5
                PRINT x
                SET x to x + 1
            END LOOP`;
        const ast = tokenizeAndParse(pseudocode);
        expect(ast.body).to.have.lengthOf(1);
        const loop = ast.body[0];
        expect(loop.type).to.equal("LoopUntil");
        expect(loop.condition.left).to.equal("x");
        expect(loop.condition.operator).to.equal("greater");
        expect(loop.condition.right.value).to.equal("5");
        expect(loop.body).to.have.lengthOf(2);
        expect(loop.body[0].type).to.equal("PrintStatement");
        expect(loop.body[0].value.value).to.equal("x");

        // Updated assertion for the VariableDeclaration
        expect(loop.body[1].type).to.equal("VariableDeclaration");
        expect(loop.body[1].varName).to.equal("x");
        expect(loop.body[1].value).to.deep.equal({
            type: "Expression",
            left: {
                type: "Identifier",
                value: "x",
                line: 3,
            },
            operator: "+",
            right: {
                type: "NumberLiteral",
                value: "1",
                line: 3,
            },
            line: 4,
        });

        expect(loop.line).to.equal(1);
        expect(loop.body[0].line).to.equal(2);
        expect(loop.body[1].line).to.equal(3);
    });

    it("should parse 'LOOP UNTIL' with traditional syntax correctly", () => {
        const pseudocode = `LOOP UNTIL x > 5
                PRINT x
                SET x TO x + 1
            END LOOP`;
        const ast = tokenizeAndParse(pseudocode);
        expect(ast.body).to.have.lengthOf(1);
        const loop = ast.body[0];
        expect(loop.type).to.equal("LoopUntil");
        expect(loop.condition.left).to.equal("x");
        expect(loop.condition.operator).to.equal(">");
        expect(loop.condition.right.value).to.equal("5");
        expect(loop.body).to.have.lengthOf(2);
        expect(loop.body[0].type).to.equal("PrintStatement");
        expect(loop.body[0].value.value).to.equal("x");

        // Updated assertion for the VariableDeclaration
        expect(loop.body[1].type).to.equal("VariableDeclaration");
        expect(loop.body[1].varName).to.equal("x");
        expect(loop.body[1].value).to.deep.equal({
            type: "Expression",
            left: {
                type: "Identifier",
                value: "x",
                line: 3,
            },
            operator: "+",
            right: {
                type: "NumberLiteral",
                value: "1",
                line: 3,
            },
            line: 4,
        });

        expect(loop.line).to.equal(1);
        expect(loop.body[0].line).to.equal(2);
        expect(loop.body[1].line).to.equal(3);
    });

    it("should parse 'LOOP from up to' with high-level syntax correctly", () => {
        const pseudocode = `
            LOOP i from 0 up to 10
                PRINT i
            END LOOP
        `;
        const ast = tokenizeAndParse(pseudocode);
        expect(ast.body).to.have.lengthOf(1);
        const loop = ast.body[0];
        expect(loop.type).to.equal("LoopFromTo");
        expect(loop.range.start.value).to.equal("0");
        expect(loop.range.end.value).to.equal("10");
        expect(loop.body).to.have.lengthOf(1);
        expect(loop.body[0].type).to.equal("PrintStatement");
        expect(loop.body[0].value.value).to.equal("i");
        expect(loop.line).to.equal(2);
        expect(loop.body[0].line).to.equal(3);
    });

    it("should parse 'LOOP FROM TO' with traditional syntax correctly", () => {
        const pseudocode = `
            LOOP i FROM 0 TO 10
                PRINT i
            END LOOP
        `;
        const ast = tokenizeAndParse(pseudocode);
        expect(ast.body).to.have.lengthOf(1);
        const loop = ast.body[0];
        expect(loop.type).to.equal("LoopFromTo");
        expect(loop.range.start.value).to.equal("0");
        expect(loop.range.end.value).to.equal("10");
        expect(loop.body).to.have.lengthOf(1);
        expect(loop.body[0].type).to.equal("PrintStatement");
        expect(loop.body[0].value.value).to.equal("i");
        expect(loop.line).to.equal(2);
        expect(loop.body[0].line).to.equal(3);
    });

    it("should parse 'FOR LOOP until' with high-level syntax correctly", () => {
        const pseudocode = `
            FOR LOOP until x is greater than 5
                PRINT x
                SET x to x + 1
            END LOOP
        `;
        const ast = tokenizeAndParse(pseudocode);
        expect(ast.body).to.have.lengthOf(1);
        const loop = ast.body[0];
        expect(loop.type).to.equal("LoopUntil");
        expect(loop.condition.left).to.equal("x");
        expect(loop.condition.operator).to.equal("greater");
        expect(loop.condition.right.value).to.equal("5");
        expect(loop.body).to.have.lengthOf(2);
        expect(loop.body[0].type).to.equal("PrintStatement");
        expect(loop.body[0].value.value).to.equal("x");
        expect(loop.body[1].type).to.equal("VariableDeclaration");
        expect(loop.body[1].varName).to.equal("x");
        expect(loop.body[1].value.operator).to.equal("+");
        expect(loop.body[1].value.right.value).to.equal("1");
        expect(loop.line).to.equal(2);
        expect(loop.body[0].line).to.equal(3);
        expect(loop.body[1].line).to.equal(4);
    });

    it("should parse 'FOR LOOP UNTIL' with traditional syntax correctly", () => {
        const pseudocode = `
            FOR LOOP UNTIL x > 5
                PRINT x
                SET x TO x + 1
            END LOOP
        `;
        const ast = tokenizeAndParse(pseudocode);
        expect(ast.body).to.have.lengthOf(1);
        const loop = ast.body[0];
        expect(loop.type).to.equal("LoopUntil");
        expect(loop.condition.left).to.equal("x");
        expect(loop.condition.operator).to.equal(">");
        expect(loop.condition.right.value).to.equal("5");
        expect(loop.body).to.have.lengthOf(2);
        expect(loop.body[0].type).to.equal("PrintStatement");
        expect(loop.body[0].value.value).to.equal("x");
        expect(loop.body[1].type).to.equal("VariableDeclaration");
        expect(loop.body[1].varName).to.equal("x");
        expect(loop.body[1].varName).to.equal("x");
        expect(loop.body[1].value.operator).to.equal("+");
        expect(loop.body[1].value.right.value).to.equal("1");
        expect(loop.line).to.equal(2);
        expect(loop.body[0].line).to.equal(3);
        expect(loop.body[1].line).to.equal(4);
    });

    it("should parse 'FOR LOOP from up to' with high-level syntax correctly", () => {
        const pseudocode = `
            FOR LOOP i from 0 up to 10
                PRINT i
            END LOOP
        `;
        const ast = tokenizeAndParse(pseudocode);
        expect(ast.body).to.have.lengthOf(1);
        const loop = ast.body[0];
        expect(loop.type).to.equal("LoopFromTo");
        expect(loop.range.start.value).to.equal("0");
        expect(loop.range.end.value).to.equal("10");
        expect(loop.body).to.have.lengthOf(1);
        expect(loop.body[0].type).to.equal("PrintStatement");
        expect(loop.body[0].value.value).to.equal("i");
        expect(loop.line).to.equal(2);
        expect(loop.body[0].line).to.equal(3);
    });

    it("should parse 'FOR LOOP FROM TO' with traditional syntax correctly", () => {
        const pseudocode = `
            FOR LOOP i FROM 0 TO 10
                PRINT i
            END LOOP
        `;
        const ast = tokenizeAndParse(pseudocode);
        expect(ast.body).to.have.lengthOf(1);
        const loop = ast.body[0];
        expect(loop.type).to.equal("LoopFromTo");
        expect(loop.range.start.value).to.equal("0");
        expect(loop.range.end.value).to.equal("10");
        expect(loop.body).to.have.lengthOf(1);
        expect(loop.body[0].type).to.equal("PrintStatement");
        expect(loop.body[0].value.value).to.equal("i");
        expect(loop.line).to.equal(2);
        expect(loop.body[0].line).to.equal(3);
    });
});
