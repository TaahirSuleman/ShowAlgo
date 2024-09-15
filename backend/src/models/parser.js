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
            case "set_array":
                return this.parseArraySetValue();
            case "set":
                return this.parseVariableDeclaration();
            case "print":
                return this.parsePrintStatement();
            case "create":
                return this.parseArrayCreation();
            case "insert":
                return this.parseArrayInsertion();
            case "remove":
                return this.parseRemoveOperation();
            case "swap":
                return this.parseSwapOperation();
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
                    `Unexpected token: ${token.value} at line ${token.line}. Hint: If you are performing multiple operations within a single operation, such as printing the result of a boolean expression, break this up into separate operations and try again`
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

        let varName;

        // Check if it's an array element assignment (e.g., SET myArray[0])
        if (
            this.currentToken().type === "Identifier" &&
            this.peekNextToken().value === "["
        ) {
            varName = this.parseIndexExpression(); // Parse array indexing (myArray[0])
        } else {
            // Handle normal variable assignment (e.g., SET myVar)
            if (this.currentToken().type === "Keyword") {
                throw new Error(
                    `Reserved keywords such as ${
                        this.currentToken().value
                    } cannot be used as a variable name.`
                );
            }
            varName = this.consume("Identifier").value;
        }

        let varType = null;

        this.expect("Keyword", "to");
        if (
            this.currentToken().value.toLowerCase() === "number" ||
            this.currentToken().value.toLowerCase() === "string" ||
            this.currentToken().value.toLowerCase() === "boolean"
        ) {
            varType = this.consume("Keyword").value;
        }
        let value;
        // Check if the next token indicates a function call
        if (
            this.currentToken().type === "Keyword" &&
            this.currentToken().value.toLowerCase() === "call"
        ) {
            // Parse the function call
            value = this.parseFunctionCall();
        } else if (
            this.currentToken().type === "Identifier" &&
            this.peekNextToken().value === "["
        ) {
            value = this.parseIndexExpression();
        } else {
            value = this.parseExpression();
        }

        if (value.type === "BooleanLiteral") this.bools.add(varName);

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
        const arrayType = this.consume("Keyword").value; // Capture the array type (number, string, etc.)
        this.expect("Keyword", "array");
        this.expect("Keyword", "as");
        const varName = this.consume("Identifier").value;
        this.expect("Keyword", "with");

        let values = [];
        let unInitialised = false;
        if (this.currentToken().value.toLowerCase() === "values") {
            this.consume("Keyword", "values");
            this.expect("Delimiter", "[");
            values = this.parseValueList(arrayType);
            this.expect("Delimiter", "]");
        } else if (this.currentToken().value.toLowerCase() === "size") {
            this.consume("Keyword", "size");
            const size = parseInt(this.consume("Number").value);
            values = this.initializeArrayWithDefaultValues(arrayType, size);
            unInitialised = true;
        } else {
            throw new Error(
                `Expected 'values' or 'size', but found ${
                    this.currentToken().value
                } at line ${line}`
            );
        }

        return this.factory.createNode(
            "ArrayCreation",
            varName,
            arrayType,
            values,
            unInitialised,
            line
        );
    }

    /**
     * @method initializeArrayWithDefaultValues
     * @description Initializes an array with default values based on the specified type.
     * @param {string} arrayType - The type of the array (number, string, boolean).
     * @param {number} size - The size of the array.
     * @returns {Array} An array of the specified size with default values.
     */
    initializeArrayWithDefaultValues(arrayType, size) {
        let defaultValue;
        switch (arrayType.toLowerCase()) {
            case "number":
                defaultValue = 0;
                break;
            case "string":
                defaultValue = "";
                break;
            case "boolean":
                defaultValue = false;
                break;
            default:
                throw new Error(`Unknown array type: ${arrayType}`);
        }
        return Array(size).fill(defaultValue);
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
     * @method parseArraySetValue
     * @description Parses a statement that sets a specific value in an array.
     * @returns {ArraySetValue} The AST node representing the array set value operation.
     */
    parseArraySetValue() {
        const line = this.currentToken().line;
        this.expect("Identifier", "set_array"); // Expect the 'set_array' identifier
        this.expect("Keyword", "element");
        const position = this.parseExpression(); // Parse the index
        this.expect("Keyword", "of");
        const varName = this.consume("Identifier").value; // The array variable name
        this.expect("Keyword", "to");
        const newValue = this.parseExpression(); // The new value to set
        return this.factory.createNode(
            "ArraySetValue",
            varName,
            position,
            newValue,
            line
        );
    }

    parseSwapOperation() {
        const line = this.currentToken().line;

        this.expect("Keyword", "swap");
        this.expect("Keyword", "position");

        const firstPosition = this.parseExpression(); // Parse the first position expression
        this.expect("Keyword", "with");
        this.expect("Keyword", "position");

        const secondPosition = this.parseExpression(); // Parse the second position expression
        this.expect("Keyword", "in");

        const varName = this.consume("Identifier").value; // Get the array name

        return this.factory.createNode(
            "SwapOperation",
            varName,
            firstPosition,
            secondPosition,
            line
        );
    }

    /**
     * @method parseRemoveOperation
     * @description Parses a remove operation for arrays or collections.
     * @returns {RemoveOperation} The AST node representing the remove operation.
     */
    parseRemoveOperation() {
        const line = this.currentToken().line;
        this.expect("Keyword", "remove");
        this.expect("Keyword", "element");
        const positionToRemove = this.parseExpression(); // Parse the index or position to remove
        this.expect("Keyword", "from");
        const varName = this.consume("Identifier").value; // The array or collection variable name

        return this.factory.createNode(
            "RemoveOperation",
            varName,
            positionToRemove,
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

        const condition = this.parseCondition(true);
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
        const condition = this.parseCondition(true);
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
    parseCondition(isLoopUntil = false) {
        const line = this.currentToken().line;
        let left;

        // Handle NOT operator at the start of the condition
        if (
            this.currentToken().type === "LogicalOperator" &&
            this.currentToken().value.toLowerCase() === "not"
        ) {
            const operator = this.consume("LogicalOperator").value;
            const right =
                this.peekNextToken().value.toLowerCase() === "then" &&
                !isLoopUntil
                    ? this.parseValue()
                    : this.parseCondition();
            return this.factory.createNode(
                "Expression",
                null,
                operator,
                right,
                line
            );
        } else if (this.currentToken().type === "LogicalOperator") {
            const operator = this.consume("LogicalOperator").value;
            const right = this.parseExpression();
            let expressionNode = this.factory.createNode(
                "Expression",
                left,
                operator,
                right,
                line
            );

            // Now check if the next token is a LogicalOperator like 'and' or 'or'
            while (this.currentToken().type === "LogicalOperator") {
                const logicalOperator = this.consume("LogicalOperator").value;
                const nextCondition = this.parseCondition(); // Parse the next condition (right-hand side)
                expressionNode = this.factory.createNode(
                    "Expression",
                    expressionNode, // Left becomes the previously parsed expression
                    logicalOperator,
                    nextCondition, // Right is the new condition
                    line
                );
            }

            return expressionNode; // Return the combined expression node
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
            // Consume the opening parenthesis
            this.consume("Delimiter");
            // Recursively parse the expression inside the parentheses
            left = this.parseCondition(isLoopUntil);
            // Ensure the closing parenthesis is found
            this.expect("Delimiter", ")");
        } else if (
            this.currentToken().type === "Keyword" &&
            this.currentToken().value.toLowerCase() === "is"
        ) {
            // This is the point where we expect "is" keyword
            // Add the logic explained above here to handle 'is' and comparison keywords
            this.consume("Keyword"); // Consume 'is'

            // Handle comparison keywords after 'is' (greater, less, equal)
            const operator = this.consume("Keyword").value;

            operator.toLowerCase() === "equal"
                ? this.expect("Keyword", "to")
                : this.expect("Keyword", "than");

            const right = this.parseExpression();
            return this.factory.createNode(
                "Expression",
                left, // e.g., x
                operator, // e.g., greater
                right, // e.g., 5
                line
            );
        } else {
            left = this.consume("Identifier").value;
        }

        if (this.currentToken().type === "ComparisonOperator") {
            // Initially create an expression node with the parsed comparison
            const operator = this.consume("ComparisonOperator").value;
            const right = this.parseExpression();
            let expressionNode = this.factory.createNode(
                "Expression",
                left,
                operator,
                right,
                line
            );

            // Now check if the next token is a LogicalOperator (e.g., 'and', 'or')
            while (this.currentToken().type === "LogicalOperator") {
                const logicalOperator = this.consume("LogicalOperator").value;
                const nextCondition = this.parseCondition(); // Parse the next condition recursively
                expressionNode = this.factory.createNode(
                    "Expression",
                    expressionNode, // The previously parsed expression becomes the left side
                    logicalOperator, // The logical operator (and/or)
                    nextCondition, // The right side (next condition)
                    line
                );
            }

            // Finally, return the full combined expression node
            return expressionNode;
        } else if (this.currentToken().type === "LogicalOperator") {
            const operator = this.consume("LogicalOperator").value;
            console.log("in first logic");
            console.log(this.currentToken().value);
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
                right = this.parseCondition(isLoopUntil); // Recursively parse the inner condition
                this.expect("Delimiter", ")");
            } else if (this.currentToken().type === "LogicalOperator") {
                console.log("in logic");
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
            this.peekNextToken().value.toLowerCase() === "then" &&
            !isLoopUntil
        ) {
            left = this.consume(this.currentToken()).value;
            return this.factory.createNode("Identifier", left, line);
        } else if (this.peekNextToken().value.toLowerCase() === "then") return;
        else {
            // Skip "then" if it's a LoopUntil condition
            if (!isLoopUntil) {
                this.expect("Keyword", "is");
            } else if (this.currentToken().value !== "is") {
                return this.factory.createNode(
                    "Expression",
                    this.factory.createNode("Identifier", left, line),
                    "and",
                    this.factory.createNode("Identifier", left, line),
                    line
                );
            } else this.expect("Keyword", "is");

            // Consume and process the comparison keyword (greater, less, equal)
            let operator = this.consume("Keyword").value.toLowerCase();

            // Handle "equal to" or "greater than" and "less than"
            if (operator === "equal") {
                this.expect("Keyword", "to");
                operator = "=="; // Translate to actual comparison operator
            } else if (operator === "greater") {
                this.expect("Keyword", "than");
                operator = ">"; // Translate to actual comparison operator
            } else if (operator === "less") {
                this.expect("Keyword", "than");
                operator = "<"; // Translate to actual comparison operator
            } else {
                throw new Error(
                    `Expected 'greater', 'less', or 'equal', but found '${operator}' at line ${
                        this.currentToken().line
                    }`
                );
            }

            // Parse the right-hand side of the comparison
            const right = this.parseExpression();

            // Create the initial comparison expression
            let expressionNode = this.factory.createNode(
                "Expression",
                left,
                operator,
                right,
                line
            );

            // Now handle logical operators ('and', 'or') after comparison
            while (this.currentToken().type === "LogicalOperator") {
                const logicalOperator = this.consume("LogicalOperator").value;
                const nextCondition = this.parseCondition(); // Recursively parse the next condition

                // Combine the current expression with the next condition using the logical operator
                expressionNode = this.factory.createNode(
                    "Expression",
                    expressionNode, // Previous comparison becomes the left side
                    logicalOperator, // Logical operator (e.g., 'and', 'or')
                    nextCondition, // Next condition becomes the right side
                    line
                );
            }

            // Return the full combined expression
            return expressionNode;
        }
    }

    /**
     * @method parseExpression
     * @description Parses an expression, potentially with operators.
     * @returns {Expression|ASTNode} The AST node representing the expression.
     */
    parseExpression(precedence = 0) {
        let left;
        // Handle expressions that start with a parenthesis
        if (
            this.currentToken().type === "Delimiter" &&
            this.currentToken().value === "("
        ) {
            this.consume("Delimiter"); // Consume the opening parenthesis
            left = this.parseExpression(); // Parse the expression inside the parentheses
            this.expect("Delimiter", ")"); // Ensure closing parenthesis
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
            (this.currentToken().value.toLowerCase() === "character" ||
                this.currentToken().value.toLowerCase() === "element")
        ) {
            left = this.parseIndexExpression(); // Handle high-level syntax
        } else {
            left = this.parseValue(); // Parse basic values like numbers, strings, booleans
        }

        // Operator precedence table
        const operatorPrecedence = {
            "*": 2,
            "/": 2,
            "%": 2,
            "+": 1,
            "-": 1,
        };

        // Handle operators and enforce precedence
        while (
            this.currentToken().type === "Operator" ||
            this.currentToken().type === "ComparisonOperator" ||
            this.currentToken().type === "LogicalOperator"
        ) {
            const currentOperator = this.currentToken().value;
            const currentPrecedence = operatorPrecedence[currentOperator] || 0;

            // If the current precedence is less than or equal to the parent, stop parsing to handle nesting correctly
            if (currentPrecedence <= precedence) {
                break;
            }

            // Consume the operator
            const operator = this.consume(this.currentToken().type).value;

            // Parse the right-hand side with appropriate precedence
            let right;
            if (
                this.currentToken().type === "Delimiter" &&
                this.currentToken().value === "("
            ) {
                // If parentheses are encountered, handle the expression inside them with the lowest precedence
                this.consume("Delimiter"); // Consume the opening parenthesis
                right = this.parseExpression(0); // Reset precedence inside parentheses
                this.expect("Delimiter", ")"); // Ensure balanced parentheses
            } else {
                // Recursively parse right-hand side with the correct precedence
                right = this.parseExpression(currentPrecedence);
            }

            // Wrap the left and right expressions if necessary to enforce precedence
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
        this.expect("Keyword", "from");
        const startIndex = this.parseExpression();
        this.expect("Keyword", "to");
        const endIndex = this.parseExpression();

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
        } else if (
            this.currentToken().type === "Keyword" &&
            this.currentToken().value.toLowerCase() === "element"
        ) {
            // High-level syntax: CHARACTER AT index OF stringVariable
            this.expect("Keyword", "element");
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
     *              Checks each value to ensure it matches the expected type.
     * @param {string} expectedType - The expected type of the array elements (e.g., "number", "string", "boolean").
     * @returns {Array<ASTNode>} An array of AST nodes representing the values.
     * @throws {Error} If a value does not match the expected type.
     */
    parseValueList(expectedType) {
        const values = [];
        values.push(this.parseAndValidateValue(expectedType));

        while (this.currentToken().value === ",") {
            this.consume("Delimiter", ",");
            values.push(this.parseAndValidateValue(expectedType));
        }

        return values;
    }

    /**
     * @method parseAndValidateValue
     * @description Parses a single value and validates that it matches the expected type.
     * @param {string} expectedType - The expected type of the value (e.g., "number", "string", "boolean").
     * @returns {ASTNode} The AST node representing the value.
     * @throws {Error} If the value does not match the expected type.
     */
    parseAndValidateValue(expectedType) {
        const valueNode = this.parseValue();
        const valueType = this.determineValueType(valueNode);

        if (valueType !== expectedType) {
            throw new Error(
                `Array type mismatch: Expected ${expectedType} but found ${valueType} at line ${valueNode.line}`
            );
        }

        return valueNode;
    }

    /**
     * @method determineValueType
     * @description Determines the type of a value based on the AST node.
     * @param {ASTNode} valueNode - The AST node representing the value.
     * @returns {string} The type of the value (e.g., "number", "string", "boolean").
     */
    determineValueType(valueNode) {
        switch (valueNode.type) {
            case "NumberLiteral":
                return "number";
            case "StringLiteral":
                return "string";
            case "BooleanLiteral":
                return "boolean";
            default:
                throw new Error(`Unknown value type: ${valueNode.type}`);
        }
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
        // Add support for 'String', 'Boolean', and other literal types
        while (
            this.currentToken().type === "Number" ||
            this.currentToken().type === "Identifier" ||
            this.currentToken().type === "String" || // Now supports string literals
            this.currentToken().type === "Boolean"
        ) {
            args.push(this.parseValue()); // Use parseValue() to handle different types of values
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
                `Expected ${type} '${value}', but found ${token.type} '${token.value}' at line ${token.line}. Hint: If you are performing multiple operations within a single operation, such as array indexing within if statements, break this up into separate operations and try again`
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
            if (token.value === "character") token.value = "character/element";
            throw new Error(
                `Expected ${type}, but found ${token.type} (${token.value}) at line ${token.line}. Hint: If you are performing multiple operations within a single operation, such as array indexing within if statements, break this up into separate operations and try again`
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
            return {};
        }
    }
}

export default Parser;
