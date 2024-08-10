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
import LoopUntil from "./ast/LoopUntil.js";
import LoopFromTo from "./ast/LoopFromTo.js";

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
                return this.parseForOrLoop();
            case "while":
                return this.parseWhileLoop();
            case "loop":
                return this.parseGenericLoop();
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
        const line = this.currentToken().line;
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
        return new VariableDeclaration(varName, varType, value, line);
    }

    parsePrintStatement() {
        const line = this.currentToken().line;
        this.expect("Keyword", "print");
        const value = this.parseExpression();
        return new PrintStatement(value, line);
    }

    parseArrayCreation() {
        const line = this.currentToken().line;
        this.expect("Keyword", "create");
        this.expect("Keyword", "array");
        this.expect("Keyword", "as");
        const varName = this.consume("Identifier").value;
        this.expect("Keyword", "with");
        this.expect("Delimiter", "[");
        const values = this.parseValueList();
        this.expect("Delimiter", "]");
        return new ArrayCreation(varName, values, line);
    }

    parseArrayInsertion() {
        const line = this.currentToken().line;
        this.expect("Keyword", "insert");
        const value = this.parseExpression();
        this.expect("Keyword", "to");
        const varName = this.consume("Identifier").value;
        this.expect("Keyword", "at");
        this.expect("Keyword", "position");
        const position = this.parseExpression();
        return new ArrayInsertion(varName, value, position, line);
    }

    parseIfStatement() {
        const line = this.currentToken().line;
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
        return new IfStatement(condition, consequent, alternate, line);
    }

    parseFunctionDeclaration() {
        const line = this.currentToken().line;
        this.expect("Keyword", "define");
        const name = this.consume("Identifier").value;
        this.expect("Keyword", "with");
        this.expect("Keyword", "parameters");
        this.expect("Delimiter", "(");
        const params = this.parseParameterList();
        this.expect("Delimiter", ")");
        const body = [];
        while (
            !(
                this.currentToken().value.toLowerCase() === "end" &&
                this.peekNextToken().value.toLowerCase() === "function"
            )
        ) {
            body.push(this.parseStatement());
        }
        this.expect("Keyword", "end");
        this.expect("Keyword", "function");
        return new FunctionDeclaration(name, params, body, line);
    }

    parseFunctionCall() {
        const line = this.currentToken().line;
        this.expect("Keyword", "call");
        const name = this.consume("Identifier").value;
        this.expect("Keyword", "with");
        this.expect("Delimiter", "(");
        const args = this.parseArgumentList();
        this.expect("Delimiter", ")");
        return new FunctionCall(name, args, line);
    }

    parseForOrLoop() {
        const line = this.currentToken().line;
        this.expect("Keyword", "for");
        if (this.currentToken().value.toLowerCase() === "each") {
            return this.parseForEachLoop(line);
        } else if (this.currentToken().value.toLowerCase() === "loop") {
            return this.parseGenericLoop(line);
        }
        throw new Error(
            `Unexpected token after 'for': ${
                this.currentToken().value
            } at line ${this.currentToken().line}`
        );
    }

    parseForEachLoop(line) {
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
        return new ForLoop(iterator, collection, body, line);
    }

    parseGenericLoop(line = this.currentToken().line) {
        this.expect("Keyword", "loop");
        if (this.currentToken().value.toLowerCase() === "until") {
            return this.parseLoopUntil(line);
        } else if (this.currentToken().value.toLowerCase() === "from") {
            return this.parseLoopFromTo(line);
        }
        throw new Error(
            `Unexpected token after 'loop': ${
                this.currentToken().value
            } at line ${this.currentToken().line}`
        );
    }

    parseLoopUntil(line) {
        this.expect("Keyword", "until");
        const condition = this.parseCondition();
        const body = [];
        while (
            !(
                this.currentToken().value.toLowerCase() === "end" &&
                this.peekNextToken().value.toLowerCase() === "loop"
            )
        ) {
            body.push(this.parseStatement());
        }
        this.expect("Keyword", "end");
        this.expect("Keyword", "loop");
        return new LoopUntil(condition, body, line);
    }

    parseLoopFromTo(line) {
        this.expect("Keyword", "from");
        const start = this.parseExpression();
        if (this.currentToken().value.toLowerCase() === "up") {
            this.expect("Identifier", "up");
            this.expect("Keyword", "to");
        } else {
            this.expect("Keyword", "to");
        }
        const end = this.parseExpression();
        const body = [];
        while (
            !(
                this.currentToken().value.toLowerCase() === "end" &&
                this.peekNextToken().value.toLowerCase() === "loop"
            )
        ) {
            body.push(this.parseStatement());
        }
        this.expect("Keyword", "end");
        this.expect("Keyword", "loop");
        return new LoopFromTo(start, end, body, line);
    }

    parseWhileLoop() {
        const line = this.currentToken().line;
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
        return new WhileLoop(condition, body, line);
    }

    parseReturnStatement() {
        const line = this.currentToken().line;
        this.expect("Keyword", "return");
        const value = this.parseExpression();
        return new ReturnStatement(value, line);
    }

    parseCondition() {
        const line = this.currentToken().line;
        const left = this.consume("Identifier").value;
        if (this.currentToken().type === "ComparisonOperator") {
            const operator = this.consume("ComparisonOperator").value;
            const right = this.parseExpression();
            return new Expression(left, operator, right, line);
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
            return new Expression(left, operator, right, line);
        }
    }

    parseExpression() {
        let left = this.parseValue();
        while (
            this.currentToken().type === "Operator" ||
            this.currentToken().type === "ComparisonOperator"
        ) {
            const operator = this.consume(this.currentToken().type).value;
            const right = this.parseValue();
            left = new Expression(
                left,
                operator,
                right,
                this.currentToken().line
            );
        }
        return left;
    }

    parseValueList() {
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
        if (token.type === "Number") {
            return new NumberLiteral(this.consume("Number").value, token.line);
        } else if (token.type === "String") {
            return new StringLiteral(this.consume("String").value, token.line);
        } else if (token.type === "Identifier") {
            return new Identifier(this.consume("Identifier").value, token.line);
        } else if (
            token.type === "Keyword" &&
            (token.value.toLowerCase() === "number" ||
                token.value.toLowerCase() === "string")
        ) {
            this.consume("Keyword");
            return this.parseValue();
        } else {
            throw new Error(
                `Unexpected value type: ${token.type} at line ${token.line}`
            );
        }
    }

    parseParameterList() {
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

    peekNextToken() {
        if (this.currentIndex + 1 < this.tokens.length) {
            return this.tokens[this.currentIndex + 1];
        } else {
            return null;
        }
    }
}

export default Parser;
