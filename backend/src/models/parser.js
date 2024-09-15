import ASTNodeFactory from "./ASTNodeFactory.js";

/**
 * @class Parser
 * @description Parses tokens into an Abstract Syntax Tree (AST) for further processing.
 * This class is responsible for analyzing the tokenized pseudocode and constructing a structured AST representation.
 * It works by sequentially reading through the tokens and building appropriate AST nodes using a factory pattern.
 * @author Taahir Suleman
 */
class Parser {
    /**
     * @constructor
     * @description Initializes the parser with an array of tokens.
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
     * It iterates over the tokens, parsing each statement and constructing the appropriate AST nodes.
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
                ); // descriptive error message that encourages users to abide by the SPL's first principles rule and split complex operations/expressions into its parts to enhance understanding. Additionally, this erorr catches any other incorrect syntax not already caught.
        }
    }

    /**
     * @method parseVariableDeclaration
     * @description Parses a variable declaration statement and returns the corresponding AST node.
     * This method handles both simple variable assignments and array element assignments. It checks
     * for valid variable names, ensures no reserved keywords are used as variable names, and processes
     * the assigned value, which could be a function call, index expression, or an expression.
     * @returns {VariableDeclaration} The AST node representing the variable declaration.
     * @throws {Error} If a reserved keyword is used as a variable name.
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
     * @description Parses an array creation statement and returns the corresponding AST node.
     * This method handles two types of array creation: initialization with specific values
     * or creation with a specified size. It also validates the presence of required keywords
     * such as "array", "as", and "with". If values are provided, they are parsed and added to
     * the array; otherwise, an uninitialized array of the specified size is created.
     * @returns {ArrayCreation} The AST node representing the array creation.
     * @throws {Error} If 'values' or 'size' is not found after 'with' keyword.
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
                // initialise number arrays with 0s.
                defaultValue = 0;
                break;
            case "string":
                // initialise string arrays with empty strings.
                defaultValue = "";
                break;
            case "boolean":
                // initialise boolean arrays with false.
                defaultValue = false;
                break;
            default:
                throw new Error(`Unknown array type: ${arrayType}`);
        }
        return Array(size).fill(defaultValue);
    }

    /**
     * @method parseArrayInsertion
     * @description Parses an array insertion statement, where a value is inserted into a specific position in an array.
     * The expected format of the pseudocode is:
     * `INSERT <value> TO <arrayName> AT POSITION <position>`.
     * @returns {ArrayInsertion} The AST node representing the array insertion operation.
     * @throws {Error} If the expected keywords or format is not found in the statement.
     */
    parseArrayInsertion() {
        const line = this.currentToken().line; // Capture the current line for error reporting
        this.expect("Keyword", "insert"); // Expect the keyword "insert"
        const value = this.parseExpression(); // Parse the value to be inserted
        this.expect("Keyword", "to"); // Expect the keyword "to"
        const varName = this.consume("Identifier").value; // Parse the array variable name
        this.expect("Keyword", "at"); // Expect the keyword "at"
        this.expect("Keyword", "position"); // Expect the keyword "position"
        const position = this.parseExpression(); // Parse the position where the value will be inserted
        return this.factory.createNode(
            "ArrayInsertion",
            varName,
            value,
            position,
            line
        ); // Return the node representing the array insertion operation
    }

    /**
     * @method parseArraySetValue
     * @description Parses a statement that sets a value in a specific position within an array.
     * The expected format of the pseudocode is:
     * `SET_ARRAY ELEMENT <position> OF <arrayName> TO <newValue>`.
     * @returns {ArraySetValue} The AST node representing the array set value operation.
     * @throws {Error} If the expected keywords or format is not found in the statement.
     */
    parseArraySetValue() {
        const line = this.currentToken().line; // Capture the current line for error reporting
        this.expect("Identifier", "set_array"); // Expect the identifier "set_array"
        this.expect("Keyword", "element"); // Expect the keyword "element"
        const position = this.parseExpression(); // Parse the position in the array
        this.expect("Keyword", "of"); // Expect the keyword "of"
        const varName = this.consume("Identifier").value; // Parse the array variable name
        this.expect("Keyword", "to"); // Expect the keyword "to"
        const newValue = this.parseExpression(); // Parse the new value to set at the specified position
        return this.factory.createNode(
            "ArraySetValue",
            varName,
            position,
            newValue,
            line
        ); // Return the node representing the array set value operation
    }

    /**
     * @method parseSwapOperation
     * @description Parses a swap operation for swapping two elements in an array or collection.
     * The expected format of the pseudocode is:
     * `SWAP POSITION <firstPosition> WITH POSITION <secondPosition> IN <arrayName>`.
     * @returns {SwapOperation} The AST node representing the swap operation.
     * @throws {Error} If the expected keywords or format is not found in the statement.
     */
    parseSwapOperation() {
        const line = this.currentToken().line; // Capture the current line for error reporting

        this.expect("Keyword", "swap"); // Expect the keyword "swap"
        this.expect("Keyword", "position"); // Expect the keyword "position"

        const firstPosition = this.parseExpression(); // Parse the first position to swap
        this.expect("Keyword", "with"); // Expect the keyword "with"
        this.expect("Keyword", "position"); // Expect the keyword "position"

        const secondPosition = this.parseExpression(); // Parse the second position to swap
        this.expect("Keyword", "in"); // Expect the keyword "in"

        const varName = this.consume("Identifier").value; // Parse the array or collection name

        // Create and return the AST node representing the swap operation
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
     * @description Parses a remove operation, where an element is removed from an array or collection.
     * The expected format of the pseudocode is:
     * `REMOVE ELEMENT <position> FROM <arrayName>`.
     * @returns {RemoveOperation} The AST node representing the remove operation.
     * @throws {Error} If the expected keywords or format is not found in the statement.
     */
    parseRemoveOperation() {
        const line = this.currentToken().line; // Capture the current line for error reporting
        this.expect("Keyword", "remove"); // Expect the keyword "remove"
        this.expect("Keyword", "element"); // Expect the keyword "element"

        const positionToRemove = this.parseExpression(); // Parse the position or index to remove
        this.expect("Keyword", "from"); // Expect the keyword "from"
        const varName = this.consume("Identifier").value; // Parse the array or collection name

        // Create and return the AST node representing the remove operation
        return this.factory.createNode(
            "RemoveOperation",
            varName,
            positionToRemove,
            line
        );
    }

    /**
     * @method parseIfStatement
     * @description Parses an if statement, optionally followed by an "otherwise" (else) or "otherwiseif" (else if) clause.
     * The expected format of the pseudocode is:
     * `IF <condition> THEN <consequent> OTHERWISE <alternate> END IF`.
     * Supports multiple `otherwiseif` clauses as well.
     * @returns {IfStatement} The AST node representing the if statement.
     * @throws {Error} If the expected keywords or format are not found in the statement.
     */
    parseIfStatement() {
        const line = this.currentToken().line; // Capture the current line for error reporting
        this.expect("Keyword", "if"); // Expect the "if" keyword

        // Parse the condition. If the next token is "then", it's a boolean condition, otherwise parse it as a normal condition.
        const condition =
            this.peekNextToken().value === "then"
                ? this.parseBool(line)
                : this.parseCondition();

        // Ensure we reach the "then" keyword before parsing the consequent
        while (this.currentToken().value != "then") this.parseCondition();
        this.expect("Keyword", "then"); // Expect the "then" keyword

        const consequent = []; // Initialize an array for the consequent statements

        // Parse the statements in the consequent until "otherwise", "otherwiseif", or "end if" is found
        while (
            this.currentToken().value.toLowerCase() !== "otherwise" &&
            this.currentToken().value.toLowerCase() !== "otherwiseif" &&
            !(
                this.currentToken().value.toLowerCase() === "end" &&
                this.peekNextToken().value.toLowerCase() === "if"
            )
        ) {
            consequent.push(this.parseStatement()); // Parse each statement in the consequent
        }

        let alternate = null; // Initialize the alternate clause (for "otherwise" or "otherwiseif")

        // If an "otherwiseif" clause is found, parse the "otherwiseif" chain
        if (this.currentToken().value.toLowerCase() === "otherwiseif") {
            this.expect("Keyword", "otherwiseif");
            alternate = [];
            alternate.push(this.parseOtherwiseIfChain());
        }

        // If an "otherwise" clause is found, parse the alternate block
        if (this.currentToken().value.toLowerCase() === "otherwise") {
            this.expect("Keyword", "otherwise");
            alternate = [];
            while (
                !(
                    this.currentToken().value.toLowerCase() === "end" &&
                    this.peekNextToken().value.toLowerCase() === "if"
                )
            ) {
                alternate.push(this.parseStatement()); // Parse each statement in the alternate block
            }
        }

        // Expect "end if" to close the if statement
        this.expect("Keyword", "end");
        this.expect("Keyword", "if");

        // Create and return the AST node for the if statement
        return this.factory.createNode(
            "IfStatement",
            condition,
            consequent,
            alternate,
            line
        );
    }

    /**
     * @method parseOtherwiseIfChain
     * @description Parses an "otherwise if" chain, which is similar to "else if" in conventional programming languages.
     * This chain allows for multiple conditional branches to be parsed in sequence.
     * @returns {OtherwiseIfStatement} The AST node representing the "otherwise if" statement.
     */
    parseOtherwiseIfChain() {
        const condition = this.parseCondition(); // Parse the condition for the "otherwise if" statement
        this.expect("Keyword", "then"); // Expect the "then" keyword after the condition

        const consequent = []; // Initialize an array to hold the consequent statements

        // Parse the consequent statements until "otherwise", "otherwiseif", or "end if" is found
        while (
            this.currentToken().value.toLowerCase() !== "otherwise" &&
            this.currentToken().value.toLowerCase() !== "otherwiseif" &&
            !(
                this.currentToken().value.toLowerCase() === "end" &&
                this.peekNextToken().value.toLowerCase() === "if"
            )
        ) {
            consequent.push(this.parseStatement()); // Parse each statement in the consequent
        }

        let alternate = null; // Initialize the alternate block (for further "otherwiseif" or "otherwise" blocks)

        // If another "otherwiseif" is found, recursively parse the next "otherwiseif" chain
        if (this.currentToken().value.toLowerCase() === "otherwiseif") {
            this.expect("Keyword", "otherwiseif");
            alternate = [];
            alternate.push(this.parseOtherwiseIfChain());
        }
        // If an "otherwise" clause is found, parse the alternate block
        else if (this.currentToken().value.toLowerCase() === "otherwise") {
            this.expect("Keyword", "otherwise");
            alternate = [];
            while (
                !(
                    this.currentToken().value.toLowerCase() === "end" &&
                    this.peekNextToken().value.toLowerCase() === "if"
                )
            ) {
                alternate.push(this.parseStatement()); // Parse each statement in the alternate block
            }
        }

        // Create and return the AST node for the "otherwise if" statement
        return this.factory.createNode(
            "OtherwiseIfStatement",
            condition,
            consequent,
            alternate,
            this.currentToken().line // Capture the current line for error reporting
        );
    }

    /**
     * @method parseBool
     * @description Parses a boolean variable or identifier.
     * Used when an "if" condition is immediately followed by a "then" keyword.
     * @param {number} line - The line number where the boolean identifier is located.
     * @returns {Identifier} The AST node representing the boolean identifier.
     */
    parseBool(line) {
        return this.factory.createNode(
            "Identifier",
            this.consume("Identifier").value, // Consume and retrieve the boolean identifier
            line // Include the line number for error tracking
        );
    }

    /**
     * @method parseFunctionDeclaration
     * @description Parses a function declaration statement, extracting the function name, parameters, and body.
     * @returns {FunctionDeclaration} The AST node representing the function declaration.
     */
    parseFunctionDeclaration() {
        const line = this.currentToken().line; // Capture the line number for error reporting
        this.expect("Keyword", "define"); // Expect the "define" keyword indicating the start of the function declaration
        const name = this.consume("Identifier").value; // Consume the function name
        this.expect("Keyword", "with");
        this.expect("Keyword", "parameters"); // Expect "with parameters" to declare the function parameters
        this.expect("Delimiter", "(");
        const params = this.parseParameterList(); // Parse the list of parameters
        this.expect("Delimiter", ")");

        const body = []; // Initialize the function body
        // Parse each statement in the function body until the "end function" keyword is found
        while (
            !(
                this.currentToken().value.toLowerCase() === "end" &&
                this.peekNextToken().value.toLowerCase() === "function"
            )
        ) {
            body.push(this.parseStatement()); // Parse each statement in the function body
        }
        this.expect("Keyword", "end");
        this.expect("Keyword", "function"); // Expect the closing "end function"

        // Return the FunctionDeclaration AST node
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
     * @description Parses a function call statement, extracting the function name and arguments.
     * @returns {FunctionCall} The AST node representing the function call.
     */
    parseFunctionCall() {
        const line = this.currentToken().line; // Capture the line number for error reporting
        this.expect("Keyword", "call"); // Expect the "call" keyword
        const name = this.consume("Identifier").value; // Consume the function name
        this.expect("Keyword", "with");
        this.expect("Delimiter", "(");
        const args = this.parseArgumentList(); // Parse the list of arguments
        this.expect("Delimiter", ")");

        // Return the FunctionCall AST node
        return this.factory.createNode("FunctionCall", name, args, line);
    }

    /**
     * @method parseForOrLoop
     * @description Parses a "for" loop, either a for-each loop or a generic loop.
     * @returns {ForLoop|Loop} The AST node representing the parsed loop.
     * @throws {Error} If an unexpected token is found after "for".
     */
    parseForOrLoop() {
        const line = this.currentToken().line; // Capture the line number for error reporting
        this.expect("Keyword", "for"); // Expect the "for" keyword

        // Check if the loop is a for-each loop or a generic loop
        if (this.currentToken().value.toLowerCase() === "each") {
            return this.parseForEachLoop(line); // Parse a for-each loop
        } else if (this.currentToken().value.toLowerCase() === "loop") {
            return this.parseGenericLoop(line); // Parse a generic loop
        }

        // Throw an error if an unexpected token is found after "for"
        throw new Error(
            `Unexpected token after 'for': ${
                this.currentToken().value
            } at line ${this.currentToken().line}`
        );
    }

    /**
     * @method parseForEachLoop
     * @description Parses a for-each loop, extracting the iterator and collection.
     * @param {number} line - The line number where the loop begins.
     * @returns {ForLoop} The AST node representing the for-each loop.
     */
    parseForEachLoop(line) {
        this.expect("Keyword", "each"); // Expect the "each" keyword
        const iterator = this.consume("Identifier").value; // Consume the iterator variable name
        this.expect("Keyword", "in");
        const collection = this.consume("Identifier").value; // Consume the collection name

        const body = []; // Initialize the body of the for-each loop
        // Parse each statement in the loop body until the "end for" keyword is found
        while (
            !(
                this.currentToken().value.toLowerCase() === "end" &&
                this.peekNextToken().value.toLowerCase() === "for"
            )
        ) {
            body.push(this.parseStatement()); // Parse each statement in the loop body
        }
        this.expect("Keyword", "end");
        this.expect("Keyword", "for"); // Expect the closing "end for"

        // Return the ForLoop AST node
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
     * @description Parses a generic loop, which could either be a loop-until or a loop-from-to statement.
     * This method determines the type of loop based on the tokens that follow "loop".
     * @param {number} line - The line number of the loop.
     * @returns {LoopUntil|LoopFromTo} The AST node representing the parsed loop.
     * @throws {Error} If an unexpected token is found after "loop".
     */
    parseGenericLoop(line = this.currentToken().line) {
        this.expect("Keyword", "loop");

        // If the current token is an identifier, it's a loop-from-to statement
        if (this.currentToken().type === "Identifier") {
            return this.parseLoopFromTo(line);
        }

        // If the current token is "until", it's a loop-until statement
        if (this.currentToken().value.toLowerCase() === "until") {
            return this.parseLoopUntil(line);
        }

        // If neither, throw an error indicating an unexpected token
        throw new Error(
            `Unexpected token after 'loop': ${
                this.currentToken().value
            } at line ${this.currentToken().line}`
        );
    }

    /**
     * @method parseLoopUntil
     * @description Parses a loop-until statement, which executes the loop body until the condition becomes true.
     * @param {number} line - The line number of the loop.
     * @returns {LoopUntil} The AST node representing the loop.
     */
    parseLoopUntil(line) {
        this.expect("Keyword", "until");

        // Parse the loop condition
        const condition = this.parseCondition(true);
        const body = [];

        // Parse statements within the loop body until "end loop" is encountered
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

        // Return the LoopUntil AST node
        return this.factory.createNode("LoopUntil", condition, body, line);
    }

    /**
     * @method parseLoopFromTo
     * @description Parses a loop-from-to statement, which iterates from a start value to an end value.
     * This method also handles "up to" syntax.
     * @param {number} line - The line number of the loop.
     * @returns {VariableDeclaration|LoopFromTo} The AST node representing the loop and variable declaration.
     */
    parseLoopFromTo(line) {
        const loopVariable = this.consume("Identifier").value; // Consume the loop variable
        this.expect("Keyword", "from");
        const start = this.parseExpression(); // Parse the starting value

        // Handle "up to" syntax, or just "to"
        if (this.currentToken().value.toLowerCase() === "up") {
            this.expect("Identifier", "up");
            this.expect("Keyword", "to");
        } else {
            this.expect("Keyword", "to");
        }

        const end = this.parseExpression(); // Parse the ending value
        const body = [];

        // Create a variable declaration node for the loop variable
        const variableDeclarationNode = this.factory.createNode(
            "VariableDeclaration",
            loopVariable,
            "number",
            start,
            line
        );

        // Parse statements within the loop body until "end loop" is encountered
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

        // Create a LoopFromTo AST node
        const loopNode = this.factory.createNode(
            "LoopFromTo",
            loopVariable,
            start,
            end,
            body,
            line
        );

        // Return both the variable declaration and loop node
        return variableDeclarationNode, loopNode;
    }

    /**
     * @method parseWhileLoop
     * @description Parses a while loop statement, which executes the loop body while the condition is true.
     * @returns {WhileLoop} The AST node representing the while loop.
     */
    parseWhileLoop() {
        const line = this.currentToken().line; // Capture the line number for error reporting
        this.expect("Keyword", "while");

        // Parse the loop condition
        const condition = this.parseCondition(false, true);
        const body = [];

        // Parse statements within the loop body until "end while" is encountered
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

        // Return the WhileLoop AST node
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
    parseCondition(isLoopUntil = false, isWhile = false) {
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
                !isLoopUntil &&
                !isWhile
                    ? this.parseValue()
                    : this.parseCondition(isLoopUntil, isWhile);
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
                const nextCondition = this.parseCondition(isLoopUntil, isWhile); // Parse the next condition (right-hand side)
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
            left = this.parseCondition(isLoopUntil, isWhile);
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
        } else if (this.currentToken().type != "Identifier") {
            this.expect("Keyword", "then");
        } else {
            left = this.consume("Identifier").value;
        }

        if (this.currentToken().type === "ComparisonOperator") {
            // Initially create an expression node with the parsed comparison
            let operator = this.consume("ComparisonOperator").value;
            const right = this.parseExpression();
            if (isLoopUntil) {
                operator = this.flipComparisonOperator(operator);
            }
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
                const nextCondition = this.parseCondition(isLoopUntil, isWhile); // Parse the next condition recursively
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
                right = this.parseCondition(isLoopUntil, isWhile); // Recursively parse the inner condition
                this.expect("Delimiter", ")");
            } else if (this.currentToken().type === "LogicalOperator") {
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
            !isLoopUntil &&
            !isWhile
        ) {
            // handle if statements that just use boolean variables as conditions
            left = this.consume(this.currentToken()).value;
            return this.factory.createNode("Identifier", left, line);
        } else if (this.peekNextToken().value.toLowerCase() === "then") return;
        else {
            // Skip "then" if it's a LoopUntil condition
            if (!isLoopUntil && !isWhile) {
                this.expect("Keyword", "is"); // Consume "is"
            } else if (this.currentToken().value !== "is") {
                return this.factory.createNode(
                    "Expression",
                    this.factory.createNode("Identifier", left, line),
                    "and",
                    this.factory.createNode("Identifier", left, line),
                    line
                );
            } else {
                this.expect("Keyword", "is"); // Ensure "is" is properly consumed
            }

            // Consume and process the comparison keyword (greater, less, equal, or not equal)
            let operator;

            // Check if "not" is the next token, indicating "not equal to"
            // in the upcoming code block, operator is either assigned to the actual operator in the pseudocode, or its inverse operator if it is a loop until loop.
            if (
                this.currentToken().type === "LogicalOperator" &&
                this.currentToken().value.toLowerCase() === "not"
            ) {
                this.consume("LogicalOperator"); // Consume the "not"
                this.expect("Keyword", "equal"); // Expect and consume the keyword "equal"
                this.expect("Keyword", "to"); // Expect and consume the keyword "to"
                operator = isLoopUntil ? "==" : "!="; // Translate to the not equal operator
            }
            // Handle "equal to", "greater than", "less than", "greater than or equal to", "less than or equal to"
            else if (
                this.currentToken().type === "Keyword" &&
                this.currentToken().value.toLowerCase() === "equal"
            ) {
                this.expect("Keyword", "equal"); // Expect and consume the keyword "equal"
                this.expect("Keyword", "to"); // Ensure "equal to" is properly consumed
                operator = isLoopUntil ? "!=" : "=="; // Translate to actual comparison operator
            } else if (
                this.currentToken().type === "Keyword" &&
                this.currentToken().value.toLowerCase() === "greater"
            ) {
                this.consume("Keyword"); // Consume "greater"
                this.expect("Keyword", "than"); // Ensure "greater than" is properly consumed
                // Check if "or equal to" follows to handle "greater than or equal to"
                if (
                    this.currentToken().type === "LogicalOperator" &&
                    this.currentToken().value.toLowerCase() === "or"
                ) {
                    this.consume("LogicalOperator"); // Consume "or"
                    this.expect("Keyword", "equal"); // Expect and consume "equal"
                    this.expect("Keyword", "to"); // Expect and consume "to"
                    operator = isLoopUntil ? "<" : ">="; // Translate to "greater than or equal to"
                } else {
                    operator = isLoopUntil ? "<=" : ">"; // Translate to greater than operator
                }
            } else if (
                this.currentToken().type === "Keyword" &&
                this.currentToken().value.toLowerCase() === "less"
            ) {
                this.consume("Keyword"); // Consume "less"
                this.expect("Keyword", "than"); // Ensure "less than" is properly consumed
                // Check if "or equal to" follows to handle "less than or equal to"
                if (
                    this.currentToken().type === "LogicalOperator" &&
                    this.currentToken().value.toLowerCase() === "or"
                ) {
                    this.consume("LogicalOperator"); // Consume "or"
                    this.expect("Keyword", "equal"); // Expect and consume "equal"
                    this.expect("Keyword", "to"); // Expect and consume "to"
                    operator = isLoopUntil ? ">" : "<="; // Translate to "less than or equal to"
                } else {
                    operator = isLoopUntil ? ">=" : "<"; // Translate to less than operator
                }
            } else {
                throw new Error(
                    `Expected 'greater', 'less', or 'equal', but found '${
                        this.currentToken().value
                    }' at line ${this.currentToken().line}`
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
                const nextCondition = this.parseCondition(isLoopUntil, isWhile); // Recursively parse the next condition

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
     * @description Parses an expression, potentially including operators, parentheses, and precedence handling.
     * Supports arithmetic, comparison, and logical operators, and allows for nested expressions within parentheses.
     * @param {number} [precedence=0] - The current precedence level used to enforce operator precedence rules.
     * @returns {Expression|ASTNode} The AST node representing the parsed expression.
     */
    parseExpression(precedence = 0) {
        let left;

        // Handle expressions starting with parentheses, e.g., (x + y)
        if (
            this.currentToken().type === "Delimiter" &&
            this.currentToken().value === "("
        ) {
            this.consume("Delimiter"); // Consume the opening parenthesis
            left = this.parseExpression(); // Parse the expression inside parentheses
            this.expect("Delimiter", ")"); // Ensure the closing parenthesis
        }
        // Handle substring expressions, e.g., substring(x, 2, 5)
        else if (
            this.currentToken().type === "Keyword" &&
            this.currentToken().value.toLowerCase() === "substring"
        ) {
            left = this.parseSubstringExpression(); // Parse substring expression
        }
        // Handle length expressions, e.g., length of array
        else if (
            this.currentToken().type === "Keyword" &&
            this.currentToken().value.toLowerCase() === "length"
        ) {
            left = this.parseLengthExpression(); // Parse length expression
        }
        // Handle index-based expressions, e.g., element at or character at
        else if (
            this.currentToken().type === "Keyword" &&
            (this.currentToken().value.toLowerCase() === "character" ||
                this.currentToken().value.toLowerCase() === "element")
        ) {
            left = this.parseIndexExpression(); // Parse element/character indexing
        }
        // Handle basic values such as numbers, strings, booleans, etc.
        else {
            left = this.parseValue(); // Parse basic value
        }

        // Operator precedence table for arithmetic operators
        const operatorPrecedence = {
            "*": 2, // Multiplication and division have higher precedence
            "/": 2,
            "%": 2,
            "+": 1, // Addition and subtraction have lower precedence
            "-": 1,
        };

        // Process any operators that follow the current expression
        while (
            this.currentToken().type === "Operator" ||
            this.currentToken().type === "ComparisonOperator" ||
            this.currentToken().type === "LogicalOperator"
        ) {
            const currentOperator = this.currentToken().value;
            const currentPrecedence = operatorPrecedence[currentOperator] || 0;

            // If the current operator's precedence is lower or equal to the parent expression's precedence, stop parsing
            if (currentPrecedence <= precedence) {
                break;
            }

            // Consume the operator token (e.g., +, *, >, and)
            const operator = this.consume(this.currentToken().type).value;

            let right;
            // Handle nested expressions within parentheses
            if (
                this.currentToken().type === "Delimiter" &&
                this.currentToken().value === "("
            ) {
                this.consume("Delimiter"); // Consume the opening parenthesis
                right = this.parseExpression(0); // Parse the expression inside parentheses with the lowest precedence
                this.expect("Delimiter", ")"); // Ensure the closing parenthesis is found
            } else {
                // Parse the right-hand side expression, considering operator precedence
                right = this.parseExpression(currentPrecedence);
            }

            // Wrap the left and right expressions with the operator to respect precedence rules
            left = this.factory.createNode(
                "Expression",
                left, // Left-hand side of the expression
                operator, // The operator (e.g., +, *, >, etc.)
                right, // Right-hand side of the expression
                this.currentToken().line // Line number for error tracking
            );
        }

        // Return the fully parsed expression
        return left;
    }

    /**
     * @method flipComparisonOperator
     * @description Flips the provided comparison operator to its inverse counterpart.
     * For example, '>' becomes '<=' and '==' becomes '!='.
     * @param {string} operator - The comparison operator to flip.
     * @returns {string} The flipped comparison operator or the original if it cannot be flipped.
     */
    flipComparisonOperator(operator) {
        const flipMap = {
            ">": "<=",
            "<": ">=",
            ">=": "<",
            "<=": ">",
            "==": "!=",
            "!=": "==",
        };

        // Return the flipped operator from the map, or the original if it's not found in the map
        return flipMap[operator] || operator;
    }

    /**
     * @method parseSubstringExpression
     * @description Parses a substring operation from the pseudocode.
     * Substring operations are of the form 'SUBSTRING OF string FROM startIndex TO endIndex'.
     * @returns {SubstringExpression} The AST node representing the substring operation.
     */
    parseSubstringExpression() {
        const line = this.currentToken().line;

        this.expect("Keyword", "substring"); // Expect and consume the 'substring' keyword
        this.expect("Keyword", "of"); // Expect and consume the 'of' keyword

        // Parse the string identifier (e.g., 'myString')
        const stringIdentifier = this.factory.createNode(
            "Identifier",
            this.consume("Identifier").value,
            line
        );
        this.expect("Keyword", "from"); // Expect and consume the 'from' keyword

        // Parse the start index of the substring (e.g., 0 or some expression)
        const startIndex = this.parseExpression();
        this.expect("Keyword", "to"); // Expect and consume the 'to' keyword

        // Parse the end index of the substring (e.g., 5 or some expression)
        const endIndex = this.parseExpression();

        // Return the created SubstringExpression node with the parsed string identifier, start and end indices
        return this.factory.createNode(
            "SubstringExpression",
            stringIdentifier,
            startIndex,
            endIndex,
            line
        );
    }

    /**
     * @method parseLengthExpression
     * @description Parses a LENGTH OF operation, which returns the length of a string or array.
     * The syntax is 'LENGTH OF identifier'.
     * @returns {LengthExpression} The AST node representing the length operation.
     */
    parseLengthExpression() {
        const line = this.currentToken().line;
        this.expect("Keyword", "length"); // Expect and consume the 'length' keyword
        this.expect("Keyword", "of"); // Expect and consume the 'of' keyword
        const source = this.consume("Identifier"); // Consume and store the identifier (e.g., the string or array)

        // Return the LengthExpression AST node with the identifier
        return this.factory.createNode(
            "LengthExpression",
            this.factory.createNode("Identifier", source.value, line),
            line
        );
    }

    /**
     * @method parseIndexExpression
     * @description Parses an index expression, which accesses a character or element at a specified index in a string or array.
     * Supports both high-level syntax (e.g., CHARACTER AT index OF string) and traditional syntax (e.g., string[index]).
     * @returns {IndexExpression} The AST node representing the index operation.
     */
    parseIndexExpression() {
        const line = this.currentToken().line;

        let source; // The source string or array
        let index; // The index expression

        // Handle high-level syntax for accessing characters or elements
        if (
            this.currentToken().type === "Keyword" &&
            this.currentToken().value.toLowerCase() === "character"
        ) {
            // High-level syntax: 'CHARACTER AT index OF stringVariable'
            this.expect("Keyword", "character"); // Expect and consume the 'character' keyword
            this.expect("Keyword", "at"); // Expect and consume the 'at' keyword
            index = this.parseExpression(); // Parse the index expression
            this.expect("Keyword", "of"); // Expect and consume the 'of' keyword
            source = this.consume("Identifier").value; // Consume the string variable identifier
        } else if (
            this.currentToken().type === "Keyword" &&
            this.currentToken().value.toLowerCase() === "element"
        ) {
            // High-level syntax: 'ELEMENT AT index OF arrayVariable'
            this.expect("Keyword", "element"); // Expect and consume the 'element' keyword
            this.expect("Keyword", "at"); // Expect and consume the 'at' keyword
            index = this.parseExpression(); // Parse the index expression
            this.expect("Keyword", "of"); // Expect and consume the 'of' keyword
            source = this.consume("Identifier").value; // Consume the array variable identifier
        } else {
            // Traditional syntax: 'variable[index]'
            source = this.consume("Identifier").value; // Consume the string or array variable identifier
            this.expect("Delimiter", "["); // Expect and consume the opening bracket '['
            index = this.parseExpression(); // Parse the index expression
            this.expect("Delimiter", "]"); // Expect and consume the closing bracket ']'
        }

        // Return the IndexExpression AST node with the parsed source and index
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
            if (value === "then")
                throw new Error(
                    "Please ensure all if/otherwise if statements end with then before the body"
                );
            else
                throw new Error(
                    `Expected ${type} '${value}', but found ${token.type} '${token.value}' at line ${token.line}. Hint: If you are performing multiple operations within a single operation, such as array indexing within if statements, break this up into separate operations and try again.`
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
