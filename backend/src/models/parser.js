import ASTNodeFactory from "./ASTNodeFactory.js";

/**
 * @class Parser
 * @description Parses tokens into an Abstract Syntax Tree (AST) for further processing.
 */
class Parser {
    /**
     * @constructor
     * @param {Array} tokens - Array of tokens to be parsed.
     */
    constructor(tokens) {
        this.tokens = tokens;
        this.currentIndex = 0;
        this.factory = new ASTNodeFactory();
        this.bools = new Set();
    }

    /**
     * @method parse
     * @description Parses the entire token array into an AST.
     * @returns {Program} The root node of the AST.
     */
    parse() {
        const body = [];
        while (this.currentIndex < this.tokens.length) {
            body.push(this.parseStatement());
        }
        return this.factory.createNode("Program", body);
    }

    /**
     * @method parseStatement
     * @description Parses a single statement based on the current token.
     * @returns {ASTNode} The parsed AST node.
     * @throws {Error} Throws an error if an unexpected token is encountered.
     */
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

    /**
     * @method parseVariableDeclaration
     * @description Parses a variable declaration statement.
     * @returns {VariableDeclaration} The AST node representing the variable declaration.
     */
    parseVariableDeclaration() {
        const line = this.currentToken().line;
        this.expect("Keyword", "set");
        if (this.currentToken().type === "Keyword") {
            throw new Error(
                `Reserved keywords such as ${
                    this.currentToken().value
                } cannot be used as a variable name.`
            );
        }
        const varName = this.consume("Identifier").value;
        let varType = null;
        if (
            this.currentToken().value.toLowerCase() === "number" ||
            this.currentToken().value.toLowerCase() === "string"
        ) {
            varType = this.consume("Keyword").value;
        }

        this.expect("Keyword", "to");
        let value;
        //console.log("before");
        if (
            this.currentToken().type === "Identifier" &&
            this.peekNextToken().value === "["
        ) {
            console.log("in");
            value = this.parseIndexExpression();
        } else value = this.parseExpression();
        if (value.type === "BooleanLiteral") this.bools.add(varName);
        console.log(this.bools);
        return this.factory.createNode(
            "VariableDeclaration",
            varName,
            varType,
            value,
            line
        );
    }

    /**
     * @method parsePrintStatement
     * @description Parses a print statement.
     * @returns {PrintStatement} The AST node representing the print statement.
     */
    parsePrintStatement() {
        const line = this.currentToken().line;
        this.expect("Keyword", "print");
        const value = this.parseExpression();
        return this.factory.createNode("PrintStatement", value, line);
    }

    /**
     * @method parseArrayCreation
     * @description Parses an array creation statement.
     * @returns {ArrayCreation} The AST node representing the array creation.
     */
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
        return this.factory.createNode("ArrayCreation", varName, values, line);
    }

    /**
     * @method parseArrayInsertion
     * @description Parses an array insertion statement.
     * @returns {ArrayInsertion} The AST node representing the array insertion.
     */
    parseArrayInsertion() {
        const line = this.currentToken().line;
        this.expect("Keyword", "insert");
        const value = this.parseExpression();
        this.expect("Keyword", "to");
        const varName = this.consume("Identifier").value;
        this.expect("Keyword", "at");
        this.expect("Keyword", "position");
        const position = this.parseExpression();
        return this.factory.createNode(
            "ArrayInsertion",
            varName,
            value,
            position,
            line
        );
    }

    /**
     * @method parseIfStatement
     * @description Parses an if statement with optional else clause.
     * @returns {IfStatement} The AST node representing the if statement.
     */
    parseIfStatement() {
        const line = this.currentToken().line;
        this.expect("Keyword", "if");
        const condition =
            this.peekNextToken().value === "then"
                ? this.parseBool(line)
                : this.parseCondition();
        console.log(this.currentToken().value);
        while (this.currentToken().value != "then") this.parseCondition();
        this.expect("Keyword", "then");
        const consequent = [];
        while (
            this.currentToken().value.toLowerCase() !== "otherwise" &&
            this.currentToken().value.toLowerCase() !== "otherwiseif" &&
            !(
                this.currentToken().value.toLowerCase() === "end" &&
                this.peekNextToken().value.toLowerCase() === "if"
            )
        ) {
            consequent.push(this.parseStatement());
        }
        let alternate = null;
        if (this.currentToken().value.toLowerCase() === "otherwiseif") {
            this.expect("Keyword", "otherwiseif");
            alternate = [];
            alternate.push(this.parseOtherwiseIfChain());
        }
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
        return this.factory.createNode(
            "IfStatement",
            condition,
            consequent,
            alternate,
            line
        );
    }

    parseOtherwiseIfChain() {
        const condition = this.parseCondition();
        this.expect("Keyword", "then");

        const consequent = [];
        while (
            this.currentToken().value.toLowerCase() !== "otherwise" &&
            this.currentToken().value.toLowerCase() !== "otherwiseif" &&
            !(
                this.currentToken().value.toLowerCase() === "end" &&
                this.peekNextToken().value.toLowerCase() === "if"
            )
        ) {
            consequent.push(this.parseStatement());
        }

        let alternate = null;

        if (this.currentToken().value.toLowerCase() === "otherwiseif") {
            this.expect("Keyword", "otherwiseif");
            alternate = [];
            alternate.push(this.parseOtherwiseIfChain());
        } else if (this.currentToken().value.toLowerCase() === "otherwise") {
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

        return this.factory.createNode(
            "OtherwiseIfStatement",
            condition,
            consequent,
            alternate,
            this.currentToken().line
        );
    }

    parseBool(line) {
        return this.factory.createNode(
            "Identifier",
            this.consume("Identifier").value,
            line
        );
    }

    /**
     * @method parseFunctionDeclaration
     * @description Parses a function declaration statement.
     * @returns {FunctionDeclaration} The AST node representing the function declaration.
     */
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
        return this.factory.createNode(
            "FunctionDeclaration",
            name,
            params,
            body,
            line
        );
    }

    /**
     * @method parseFunctionCall
     * @description Parses a function call statement.
     * @returns {FunctionCall} The AST node representing the function call.
     */
    parseFunctionCall() {
        const line = this.currentToken().line;
        this.expect("Keyword", "call");
        const name = this.consume("Identifier").value;
        this.expect("Keyword", "with");
        this.expect("Delimiter", "(");
        const args = this.parseArgumentList();
        this.expect("Delimiter", ")");
        return this.factory.createNode("FunctionCall", name, args, line);
    }

    /**
     * @method parseForOrLoop
     * @description Parses a for loop or a generic loop.
     * @returns {ForLoop|LoopFromTo} The AST node representing the loop.
     */
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

    /**
     * @method parseForEachLoop
     * @description Parses a for-each loop.
     * @param {number} line - The line number of the loop.
     * @returns {ForLoop} The AST node representing the for-each loop.
     */
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
        return this.factory.createNode(
            "ForLoop",
            iterator,
            collection,
            body,
            line
        );
    }

    /**
     * @method parseGenericLoop
     * @description Parses a generic loop, which could be a loop until or a loop from-to.
     * @param {number} line - The line number of the loop.
     * @returns {LoopUntil|LoopFromTo} The AST node representing the loop.
     */
    parseGenericLoop(line = this.currentToken().line) {
        this.expect("Keyword", "loop");

        if (this.currentToken().type === "Identifier") {
            return this.parseLoopFromTo(line);
        }

        if (this.currentToken().value.toLowerCase() === "until") {
            return this.parseLoopUntil(line);
        }

        throw new Error(
            `Unexpected token after 'loop': ${
                this.currentToken().value
            } at line ${this.currentToken().line}`
        );
    }

    /**
     * @method parseLoopUntil
     * @description Parses a loop-until statement.
     * @param {number} line - The line number of the loop.
     * @returns {LoopUntil} The AST node representing the loop.
     */
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
        return this.factory.createNode("LoopUntil", condition, body, line);
    }

    /**
     * @method parseLoopFromTo
     * @description Parses a loop-from-to statement.
     * @param {number} line - The line number of the loop.
     * @returns {VariableDeclaration|LoopFromTo} The AST node representing the loop.
     */
    parseLoopFromTo(line) {
        const loopVariable = this.consume("Identifier").value;
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

        const variableDeclarationNode = this.factory.createNode(
            "VariableDeclaration",
            loopVariable,
            "number",
            start,
            line
        );

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

        const loopNode = this.factory.createNode(
            "LoopFromTo",
            loopVariable,
            start,
            end,
            body,
            line
        );

        return variableDeclarationNode, loopNode;
    }

    /**
     * @method parseWhileLoop
     * @description Parses a while loop statement.
     * @returns {WhileLoop} The AST node representing the while loop.
     */
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
        return this.factory.createNode("WhileLoop", condition, body, line);
    }

    /**
     * @method parseReturnStatement
     * @description Parses a return statement.
     * @returns {ReturnStatement} The AST node representing the return statement.
     */
    parseReturnStatement() {
        const line = this.currentToken().line;
        this.expect("Keyword", "return");
        const value = this.parseExpression();
        return this.factory.createNode("ReturnStatement", value, line);
    }

    /**
     * @method parseCondition
     * @description Parses a condition for control structures.
     * @returns {Expression} The AST node representing the condition.
     */
    parseCondition() {
        const line = this.currentToken().line;
        let left;

        // Handle NOT operator at the start of the condition
        if (
            this.currentToken().type === "LogicalOperator" &&
            this.currentToken().value.toLowerCase() === "not"
        ) {
            const operator = this.consume("LogicalOperator").value;
            console.log(`next token is ${this.peekNextToken().value}`);
            const right =
                this.peekNextToken().value.toLowerCase() === "then"
                    ? this.parseValue()
                    : this.parseCondition();
            return this.factory.createNode(
                "Expression",
                null,
                operator,
                right,
                line
            );
        }
        if (
            this.currentToken().type === "Keyword" &&
            this.currentToken().value.toLowerCase() === "length"
        ) {
            left = this.parseLengthExpression();
        } else if (
            this.currentToken().type === "Delimiter" &&
            this.currentToken().value === "("
        ) {
            // Parse the left side of the condition
            this.consume("Delimiter");
            left = this.parseCondition(); // Recursively parse the inner condition
            this.expect("Delimiter", ")");
        } else {
            left = this.consume("Identifier").value;
        }

        if (this.currentToken().type === "ComparisonOperator") {
            const operator = this.consume("ComparisonOperator").value;
            const right = this.parseExpression();
            return this.factory.createNode(
                "Expression",
                left,
                operator,
                right,
                line
            );
        } else if (this.currentToken().type === "LogicalOperator") {
            const operator = this.consume("LogicalOperator").value;

            // Specific case: handle "NOT" after a logical operator
            if (
                operator.toLowerCase() !== "not" &&
                this.currentToken().type === "LogicalOperator" &&
                this.currentToken().value.toLowerCase() === "not"
            ) {
                const notOperator = this.consume("LogicalOperator").value;
                const right = this.parseValue();
                const notExpression = this.factory.createNode(
                    "Expression",
                    null,
                    notOperator,
                    right,
                    line
                );
                return this.factory.createNode(
                    "Expression",
                    left,
                    operator,
                    notExpression,
                    line
                );
            }

            let right;
            if (
                this.currentToken().type === "Delimiter" &&
                this.currentToken().value === "("
            ) {
                this.consume("Delimiter");
                right = this.parseCondition(); // Recursively parse the inner condition
                this.expect("Delimiter", ")");
            } else {
                right = this.parseExpression();
            }

            return this.factory.createNode(
                "Expression",
                left,
                operator,
                right,
                line
            );
        } else if (
            this.currentToken.type === "Identifier" &&
            this.peekNextToken().value.toLowerCase() === "then"
        ) {
            left = this.consume(this.currentToken()).value;
            return this.factory.createNode("Identifier", left, line);
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
            operator.toLowerCase() == "equal"
                ? this.expect("Keyword", "to")
                : this.expect("Keyword", "than");
            const right = this.parseExpression();
            return this.factory.createNode(
                "Expression",
                left,
                operator,
                right,
                line
            );
        }
    }

    /**
     * @method parseExpression
     * @description Parses an expression, potentially with operators.
     * @returns {Expression|ASTNode} The AST node representing the expression.
     */
    parseExpression() {
        let left;

        if (
            this.currentToken().type === "Delimiter" &&
            this.currentToken().value === "("
        ) {
            this.consume("Delimiter");
            left = this.parseExpression();
            this.expect("Delimiter", ")");
        } else if (
            this.currentToken().type === "Keyword" &&
            this.currentToken().value.toLowerCase() === "substring"
        ) {
            // Handle substring operation
            left = this.parseSubstringExpression();
        } else if (
            this.currentToken().type === "Keyword" &&
            this.currentToken().value.toLowerCase() === "length"
        ) {
            // Handle LENGTH OF operation
            left = this.parseLengthExpression();
        } else if (
            this.currentToken().type === "Keyword" &&
            this.currentToken().value.toLowerCase() === "character"
        ) {
            left = this.parseIndexExpression(); // Handle high-level syntax
        } else {
            left = this.parseValue();
        }

        while (
            this.currentToken().type === "Operator" ||
            this.currentToken().type === "ComparisonOperator" ||
            this.currentToken().type === "LogicalOperator" // Handle logical operators
        ) {
            const operator = this.consume(this.currentToken().type).value;
            let right;

            if (
                this.currentToken().type === "Delimiter" &&
                this.currentToken().value === "("
            ) {
                right = this.parseExpression();
            } else {
                right = this.parseValue();
            }

            left = this.factory.createNode(
                "Expression",
                left,
                operator,
                right,
                this.currentToken().line
            );
        }

        return left;
    }

    /**
     * @method parseSubstringExpression
     * @description Parses a substring operation.
     * @returns {SubstringExpression} The AST node representing the substring operation.
     */
    parseSubstringExpression() {
        const line = this.currentToken().line;

        this.expect("Keyword", "substring");
        this.expect("Keyword", "of");

        const stringIdentifier = this.factory.createNode(
            "Identifier",
            this.consume("Identifier").value,
            line
        );
        console.log(stringIdentifier);
        this.expect("Keyword", "from");
        const startIndex = this.parseExpression();
        console.log(startIndex);
        this.expect("Keyword", "to");
        const endIndex = this.parseExpression();
        console.log(endIndex);

        // Create the SubstringExpression node with correct structure
        return this.factory.createNode(
            "SubstringExpression",
            stringIdentifier,
            startIndex,
            endIndex,
            line
        );
    }

    parseLengthExpression() {
        const line = this.currentToken().line;
        this.expect("Keyword", "length");
        this.expect("Keyword", "of");
        const source = this.consume("Identifier");

        return this.factory.createNode(
            "LengthExpression",
            this.factory.createNode("Identifier", source.value, line),
            line
        );
    }

    parseIndexExpression() {
        const line = this.currentToken().line;

        let source;
        let index;

        // Determine if it's traditional or high-level syntax
        if (
            this.currentToken().type === "Keyword" &&
            this.currentToken().value.toLowerCase() === "character"
        ) {
            // High-level syntax: CHARACTER AT index OF stringVariable
            this.expect("Keyword", "character");
            this.expect("Keyword", "at");
            index = this.parseExpression(); // Parse the index expression
            this.expect("Keyword", "of");
            source = this.consume("Identifier").value;
        } else {
            // Traditional syntax: stringVariable[index]
            source = this.consume("Identifier").value;
            this.expect("Delimiter", "[");
            index = this.parseExpression(); // Parse the index expression
            this.expect("Delimiter", "]");
        }

        return this.factory.createNode(
            "IndexExpression",
            this.factory.createNode("Identifier", source, line),
            index,
            line
        );
    }

    /**
     * @method parseValueList
     * @description Parses a list of values, typically for array initialization.
     * @returns {Array<ASTNode>} An array of AST nodes representing the values.
     */
    parseValueList() {
        const values = [];
        values.push(this.parseValue());
        while (this.currentToken().value === ",") {
            this.consume("Delimiter", ",");
            values.push(this.parseValue());
        }
        return values;
    }

    /**
     * @method parseValue
     * @description Parses a single value (number, identifier, string).
     * @returns {ASTNode} The AST node representing the value.
     * @throws {Error} Throws an error if an unexpected value type is encountered.
     */
    parseValue() {
        const token = this.currentToken();

        if (token.type === "Operator" && token.value === "-") {
            this.consume("Operator");
            const right = this.parseValue();
            return this.factory.createNode(
                "Expression",
                this.factory.createNode("NumberLiteral", 0, token.line),
                "-",
                right,
                token.line
            );
        }

        if (token.type === "Number") {
            return this.factory.createNode(
                "NumberLiteral",
                this.consume("Number").value,
                token.line
            );
        } else if (token.type === "Identifier") {
            return this.factory.createNode(
                "Identifier",
                this.consume("Identifier").value,
                token.line
            );
        } else if (token.type === "String") {
            return this.factory.createNode(
                "StringLiteral",
                this.consume("String").value,
                token.line
            );
        } else if (token.type === "Boolean") {
            return this.factory.createNode(
                "BooleanLiteral",
                this.consume("Boolean").value,
                token.line
            );
        } else if (
            token.type === "Keyword" &&
            (token.value.toLowerCase() === "number" ||
                token.value.toLowerCase() === "string" ||
                token.value.toLowerCase() === "boolean")
        ) {
            this.consume("Keyword");
            return this.parseValue();
        } else {
            throw new Error(
                `Unexpected value type: ${token.type} at line ${token.line}`
            );
        }
    }

    /**
     * @method parseParameterList
     * @description Parses a list of parameters for function declarations.
     * @returns {Array<string>} An array of parameter names.
     */
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

    /**
     * @method parseArgumentList
     * @description Parses a list of arguments for function calls.
     * @returns {Array<ASTNode>} An array of AST nodes representing the arguments.
     */
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

    /**
     * @method expect
     * @description Ensures the current token matches the expected type and value, then consumes it.
     * @param {string} type - The expected token type.
     * @param {string} value - The expected token value.
     * @throws {Error} Throws an error if the expected token is not found.
     */
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

    /**
     * @method consume
     * @description Consumes the current token if it matches the expected type.
     * @param {string} type - The expected token type.
     * @returns {Object} The consumed token.
     * @throws {Error} Throws an error if the token type does not match.
     */
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

    /**
     * @method currentToken
     * @description Returns the current token.
     * @returns {Object} The current token.
     */
    currentToken() {
        if (this.currentIndex < this.tokens.length) {
            return this.tokens[this.currentIndex];
        } else {
            return {
                type: "EOF",
                value: "EOF",
                line: this.tokens[this.tokens.length - 1]?.line || 0,
            };
        }
    }

    /**
     * @method peekNextToken
     * @description Returns the next token without consuming it.
     * @returns {Object|null} The next token or null if there are no more tokens.
     */
    peekNextToken() {
        if (this.currentIndex + 1 < this.tokens.length) {
            return this.tokens[this.currentIndex + 1];
        } else {
            return null;
        }
    }
}

export default Parser;
