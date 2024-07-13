import { expect } from "chai";
import Tokenizer from "../src/helpers/tokenizer.js";
import Parser from "../src/models/parser.js";

describe("Tokenizer and Parser Integration", () => {
    function tokenizeAndParse(pseudocode) {
        const tokenizer = new Tokenizer(pseudocode);
        const tokens = tokenizer.tokenize();
        const parser = new Parser(tokens);
        return parser.parse();
    }

    it("should correctly tokenize and parse variable declarations", () => {
        const pseudocode = `SET x TO 10`;
        const ast = tokenizeAndParse(pseudocode);
        expect(ast.body).to.have.lengthOf(1);
        const declaration = ast.body[0];
        expect(declaration.type).to.equal("VariableDeclaration");
        expect(declaration.varName).to.equal("x");
        expect(declaration.value.value).to.equal("10");
    });

    it("should correctly tokenize and parse print statements", () => {
        const pseudocode = `PRINT "Hello, World!"`;
        const ast = tokenizeAndParse(pseudocode);
        expect(ast.body).to.have.lengthOf(1);
        const printStatement = ast.body[0];
        expect(printStatement.type).to.equal("PrintStatement");
        expect(printStatement.value.value).to.equal("Hello, World!");
    });

    it("should correctly tokenize and parse function definitions", () => {
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
    });

    it("should correctly tokenize and parse if statements", () => {
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
        const consequentPrint = ifStatement.consequent[0];
        expect(consequentPrint.type).to.equal("PrintStatement");
        expect(consequentPrint.value.value).to.equal("x is greater than 5");
        expect(ifStatement.alternate).to.have.lengthOf(1);
        const alternatePrint = ifStatement.alternate[0];
        expect(alternatePrint.type).to.equal("PrintStatement");
        expect(alternatePrint.value.value).to.equal("x is not greater than 5");
    });

    it("should correctly tokenize and parse for loops", () => {
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
    });

    it("should correctly tokenize and parse while loops", () => {
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
        const printStatement = whileLoop.body[0];
        expect(printStatement.type).to.equal("PrintStatement");
        expect(printStatement.value.value).to.equal("x");
        const variableDeclaration = whileLoop.body[1];
        expect(variableDeclaration.type).to.equal("VariableDeclaration");
        expect(variableDeclaration.varName).to.equal("x");
        expect(variableDeclaration.value.left.value).to.equal("x");
        expect(variableDeclaration.value.operator).to.equal("-");
        expect(variableDeclaration.value.right.value).to.equal("1");
    });

    it("should handle unexpected characters correctly", () => {
        const invalidPseudocode = `SET x TO 10
            SET y TO "string`;
        try {
            tokenizeAndParse(invalidPseudocode);
            throw new Error("Expected error for invalid pseudocode");
        } catch (error) {
            expect(error.message).to.include("Unexpected end of string");
        }
    });

    it("should handle unexpected end of string correctly", () => {
        const invalidPseudocode = "SET x TO 10 #";
        try {
            tokenizeAndParse(invalidPseudocode);
            throw new Error("Expected error for invalid pseudocode");
        } catch (error) {
            expect(error.message).to.include("Unexpected character");
        }
    });
});
