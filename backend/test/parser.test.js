import { expect } from "chai";
import Tokenizer from "../src/helpers/tokenizer.js";
import Parser from "../src/models/parser.js";

describe("Tokenizer and Parser", () => {
    function tokenizeAndParse(pseudocode) {
        const tokenizer = new Tokenizer(pseudocode);
        const tokens = tokenizer.tokenize();
        const parser = new Parser(tokens);
        return parser.parse();
    }

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
