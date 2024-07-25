// models/parser.js

import Program from "./ast/Program.js";
import VariableDeclaration from "./ast/VariableDeclaration.js";
import PrintStatement from "./ast/PrintStatement.js";
import ArrayCreation from "./ast/ArrayCreation.js";
import ArrayInsertion from "./ast/ArrayInsertion.js";
import IfStatement from "./ast/IfStatement.js";
import FunctionDeclaration from "./ast/FunctionDeclaration.js";
import FunctionCall from "./ast/FunctionCall.js";
import ForLoop from "./ast/ForLoop.js";
import WhileLoop from "./ast/WhileLoop.js";
import ReturnStatement from "./ast/ReturnStatement.js";
import Expression from "./ast/Expression.js";
import NumberLiteral from "./ast/NumberLiteral.js";
import StringLiteral from "./ast/StringLiteral.js";
import Identifier from "./ast/Identifier.js";
class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.currentIndex = 0;
    }

    parse() {
        const body = [];
        while (this.currentIndex < this.tokens.length) {
            body.push(this.parseStatement());
        }
        return new Program(body);
    }

    parseStatement() {
        const token = this.currentToken();
        console.log(`parseStatement: ${token.value} at line ${token.line}`);
        switch (token.value.toLowerCase()) {
            case "set":
                return this.parseVariableDeclaration();
            case "print":
                return this.parsePrintStatement();
            case "create":
                return this.parseArrayCreation();
            case "insert":
                return this.parseArrayInsertion();
            case "if":
                return this.parseIfStatement();
            case "define":
                return this.parseFunctionDeclaration();
            case "call":
                return this.parseFunctionCall();
            case "for":
                return this.parseForLoop();
            case "while":
                return this.parseWhileLoop();
            case "return":
                return this.parseReturnStatement();
            case "end":
                throw new Error(
                    `Unexpected token: ${token.value} at line ${token.line}`
                );
            default:
                throw new Error(
                    `Unexpected token: ${token.value} at line ${token.line}`
                );
        }
    }

    parseVariableDeclaration() {
        console.log(
            `parseVariableDeclaration at line ${this.currentToken().line}`
        );
        this.expect("Keyword", "set");
        const varName = this.consume("Identifier").value;
        let varType = null;
        if (
            this.currentToken().value.toLowerCase() === "number" ||
            this.currentToken().value.toLowerCase() === "string"
        ) {
            varType = this.consume("Keyword").value;
        }
        this.expect("Keyword", "to");
        const value = this.parseExpression();
        return new VariableDeclaration(varName, varType, value);
    }

    parsePrintStatement() {
        console.log(`parsePrintStatement at line ${this.currentToken().line}`);
        this.expect("Keyword", "print");
        const value = this.parseExpression();
        return new PrintStatement(value);
    }

    parseArrayCreation() {
        console.log(`parseArrayCreation at line ${this.currentToken().line}`);
        this.expect("Keyword", "create");
        this.expect("Keyword", "array");
        this.expect("Keyword", "as");
        const varName = this.consume("Identifier").value;
        this.expect("Keyword", "with");
        this.expect("Delimiter", "[");
        const values = this.parseValueList();
        this.expect("Delimiter", "]");
        return new ArrayCreation(varName, values);
    }

    parseArrayInsertion() {
        console.log(`parseArrayInsertion at line ${this.currentToken().line}`);
        this.expect("Keyword", "insert");
        const value = this.parseExpression();
        this.expect("Keyword", "to");
        const varName = this.consume("Identifier").value;
        this.expect("Keyword", "at");
        this.expect("Keyword", "position");
        const position = this.parseExpression();
        return new ArrayInsertion(varName, value, position);
    }

    parseIfStatement() {
        console.log(`parseIfStatement at line ${this.currentToken().line}`);
        this.expect("Keyword", "if");
        const condition = this.parseCondition();
        this.expect("Keyword", "then");
        const consequent = [];
        while (
            this.currentToken().value.toLowerCase() !== "otherwise" &&
            !(
                this.currentToken().value.toLowerCase() === "end" &&
                this.peekNextToken().value.toLowerCase() === "if"
            )
        ) {
            consequent.push(this.parseStatement());
        }
        let alternate = null;
        if (this.currentToken().value.toLowerCase() === "otherwise") {
            this.expect("Keyword", "otherwise");
            alternate = [];
            while (
                !(
                    this.currentToken().value.toLowerCase() === "end" &&
                    this.peekNextToken().value.toLowerCase() === "if"
                )
            ) {
                alternate.push(this.parseStatement());
            }
        }
        this.expect("Keyword", "end");
        this.expect("Keyword", "if");
        return new IfStatement(condition, consequent, alternate);
    }

    peekNextToken() {
        if (this.currentIndex + 1 < this.tokens.length) {
            return this.tokens[this.currentIndex + 1];
        } else {
            return null; // Return null if there is no next token
        }
    }

    parseFunctionDeclaration() {
        console.log(
            `parseFunctionDeclaration at line ${this.currentToken().line}`
        );
        this.expect("Keyword", "define");
        const name = this.consume("Identifier").value;
        this.expect("Keyword", "with");
        this.expect("Keyword", "parameters");
        this.expect("Delimiter", "(");
        const params = this.parseParameterList();
        this.expect("Delimiter", ")");
        const body = [];

        // Parse function body until 'end function' is encountered
        while (
            !(
                this.currentToken().value.toLowerCase() === "end" &&
                this.peekNextToken().value.toLowerCase() === "function"
            )
        ) {
            body.push(this.parseStatement());
        }

        // Consume 'end function'
        this.expect("Keyword", "end");
        this.expect("Keyword", "function");

        return new FunctionDeclaration(name, params, body);
    }

    parseFunctionCall() {
        console.log(`parseFunctionCall at line ${this.currentToken().line}`);
        this.expect("Keyword", "call");
        const name = this.consume("Identifier").value;
        this.expect("Keyword", "with");
        this.expect("Delimiter", "(");
        const args = this.parseArgumentList();
        this.expect("Delimiter", ")");
        return new FunctionCall(name, args);
    }

    parseForLoop() {
        console.log(`parseForLoop at line ${this.currentToken().line}`);
        this.expect("Keyword", "for");
        this.expect("Keyword", "each");
        const iterator = this.consume("Identifier").value;
        this.expect("Keyword", "in");
        const collection = this.consume("Identifier").value;
        const body = [];
        while (
            !(
                this.currentToken().value.toLowerCase() === "end" &&
                this.peekNextToken().value.toLowerCase() === "for"
            )
        ) {
            body.push(this.parseStatement());
        }
        this.expect("Keyword", "end");
        this.expect("Keyword", "for");
        return new ForLoop(iterator, collection, body);
    }

    parseWhileLoop() {
        console.log(`parseWhileLoop at line ${this.currentToken().line}`);
        this.expect("Keyword", "while");
        const condition = this.parseCondition();
        const body = [];
        while (
            !(
                this.currentToken().value.toLowerCase() === "end" &&
                this.peekNextToken().value.toLowerCase() === "while"
            )
        ) {
            body.push(this.parseStatement());
        }
        this.expect("Keyword", "end");
        this.expect("Keyword", "while");
        return new WhileLoop(condition, body);
    }

    parseReturnStatement() {
        console.log(`parseReturnStatement at line ${this.currentToken().line}`);
        this.expect("Keyword", "return");
        const value = this.parseExpression();
        return new ReturnStatement(value);
    }

    parseCondition() {
        console.log(`parseCondition at line ${this.currentToken().line}`);
        const left = this.consume("Identifier").value;
        if (this.currentToken().type === "ComparisonOperator") {
            const operator = this.consume("ComparisonOperator").value;
            const right = this.parseExpression();
            return new Expression(left, operator, right);
        } else {
            this.expect("Keyword", "is");
            const operator = this.consume("Keyword").value;
            if (
                operator.toLowerCase() !== "greater" &&
                operator.toLowerCase() !== "less" &&
                operator.toLowerCase() !== "equal"
            ) {
                throw new Error(
                    `Expected 'greater', 'less' or 'equal', but found '${operator}' at line ${
                        this.currentToken().line
                    }`
                );
            }
            this.expect("Keyword", "than");
            const right = this.parseExpression();
            return new Expression(left, operator, right);
        }
    }

    parseExpression() {
        let left = this.parseValue();
        console.log("parseExpression: left value:", left);
        while (
            this.currentToken().type === "Operator" ||
            this.currentToken().type === "ComparisonOperator"
        ) {
            const operator = this.consume(this.currentToken().type).value;
            const right = this.parseValue();
            left = new Expression(left, operator, right);
            console.log("parseExpression: combined expression:", left);
        }
        return left;
    }

    parseValueList() {
        console.log(`parseValueList at line ${this.currentToken().line}`);
        const values = [];
        values.push(this.parseValue());
        while (this.currentToken().value === ",") {
            this.consume("Delimiter", ",");
            values.push(this.parseValue());
        }
        return values;
    }

    parseValue() {
        const token = this.currentToken();
        console.log(
            `parseValue: ${token.value} (${token.type}) at line ${token.line}`
        );
        if (token.type === "Number") {
            return new NumberLiteral(this.consume("Number").value);
        } else if (token.type === "String") {
            return new StringLiteral(this.consume("String").value);
        } else if (token.type === "Identifier") {
            return new Identifier(this.consume("Identifier").value);
        } else if (
            token.type === "Keyword" &&
            (token.value.toLowerCase() === "number" ||
                token.value.toLowerCase() === "string")
        ) {
            // Consume and skip the type keyword
            this.consume("Keyword");
            return this.parseValue();
        } else {
            throw new Error(
                `Unexpected value type: ${token.type} at line ${token.line}`
            );
        }
    }

    parseParameterList() {
        console.log(`parseParameterList at line ${this.currentToken().line}`);
        const params = [];
        while (this.currentToken().type === "Identifier") {
            params.push(this.consume("Identifier").value);
            if (this.currentToken().value === ",") {
                this.consume("Delimiter", ",");
            }
        }
        return params;
    }

    parseArgumentList() {
        console.log(`parseArgumentList at line ${this.currentToken().line}`);
        const args = [];
        while (
            this.currentToken().type === "Number" ||
            this.currentToken().type === "Identifier"
        ) {
            args.push(this.parseValue());
            if (this.currentToken().value === ",") {
                this.consume("Delimiter", ",");
            }
        }
        return args;
    }

    expect(type, value) {
        const token = this.currentToken();
        if (
            token.type !== type ||
            token.value.toLowerCase() !== value.toLowerCase()
        ) {
            throw new Error(
                `Expected ${type} '${value}', but found ${token.type} '${token.value}' at line ${token.line}`
            );
        }
        this.currentIndex++;
    }

    consume(type) {
        const token = this.currentToken();
        if (token.type !== type) {
            throw new Error(
                `Expected ${type}, but found ${token.type} (${token.value}) at line ${token.line}`
            );
        }
        this.currentIndex++;
        return token;
    }

    currentToken() {
        if (this.currentIndex < this.tokens.length) {
            return this.tokens[this.currentIndex];
        } else {
            return {
                type: "EOF",
                value: "EOF",
                line: this.tokens[this.tokens.length - 1]?.line || 0,
            }; // End of file token
        }
    }
}

export default Parser;
