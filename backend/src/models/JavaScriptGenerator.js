import Converter from "./Converter.js";
import JavaScriptNodeFactory from "./JavaScriptNodeFactory.js";

/**
 * @class JavaScriptGenerator
 * @description Converts IR into JavaScript code using a factory for node creation.
 * @author Taahir Suleman
 */
class JavaScriptGenerator extends Converter {
    /**
     * @constructor
     * @param {Object} ir - Intermediate representation (IR).
     */
    constructor(ir) {
        super();
        this.ir = ir;
        this.jsCode = "";
        this.declaredVariables = new Set();
        this.nodeFactory = new JavaScriptNodeFactory(this); // Factory class for JavaScriptGenerator
    }

    /**
     * @method convert
     * @description Converts IR to JavaScript.
     * @param {Object} ir - Intermediate representation of the code.
     * @returns {string} JavaScript code.
     */
    convert(ir) {
        this.ir = ir;
        return this.generate();
    }

    /**
     * @method generate
     * @description Generates JavaScript from the IR.
     * @returns {string} The generated JavaScript code.
     */
    generate() {
        this.jsCode += "'use strict';\n";
        this.jsCode += this.generateNodes(this.ir.program);
        return this.jsCode;
    }

    /**
     * @method generateNodes
     * @description Generates code for an array of IR nodes.
     * @param {Array} nodes - Array of IR nodes.
     * @returns {string} The generated code.
     */
    generateNodes(nodes) {
        return nodes
            .map((node) => this.nodeFactory.createNode(node))
            .join("\n");
    }

    /**
     * @method generateVariableDeclaration
     * @description Generates code for variable declarations.
     * @param {Object} node - VariableDeclaration node.
     * @returns {string} The JavaScript code for variable declaration.
     */
    generateVariableDeclaration(node) {
        const declaration = this.declaredVariables.has(node.name)
            ? `${node.name}`
            : `let ${node.name}`;
        this.declaredVariables.add(node.name);
        return `${declaration} = ${this.generateExpression(node.value)};`;
    }

    /**
     * @method generateFunctionDeclaration
     * @description Generates the JavaScript code for a function declaration.
     * @param {Object} node - The AST node representing the function declaration.
     * @returns {string} The generated JavaScript function declaration code.
     */
    generateFunctionDeclaration(node) {
        const params = node.params.join(", ");
        // Declare function parameters as variables
        for (const param of params) {
            this.declaredVariables.add(param);
        }
        const body = this.generateNodes(node.body);
        // Remove function parameters from the declared variables after use
        for (const param of params) {
            this.declaredVariables.delete(param);
        }
        return `function ${node.name}(${params}) {\n${body}\n}`;
    }

    /**
     * @method generateReturnStatement
     * @description Generates the JavaScript code for a return statement.
     * @param {Object} node - The AST node representing the return statement.
     * @returns {string} The generated JavaScript return statement code.
     */
    generateReturnStatement(node) {
        return `return ${this.generateExpression(node.value)};`;
    }

    /**
     * @method generateIfStatement
     * @description Generates the JavaScript code for an if-else or if-else if-else statement.
     * @param {Object} node - The AST node representing the if statement.
     * @returns {string} The generated JavaScript if-else statement code.
     */
    generateIfStatement(node) {
        const condition = this.generateCondition(node.condition);
        const consequent = this.generateNodes(node.consequent);
        let alternate = "";

        // Check if the alternate is an OtherwiseIfStatement
        if (node.alternate && node.alternate.type === "OtherwiseIfStatement") {
            alternate = this.generateOtherwiseIfStatement(node.alternate);
        } else if (node.alternate) {
            alternate = `else {\n${this.generateNodes(node.alternate)}\n}`;
        }

        return `if (${condition}) {\n${consequent}\n} ${alternate}`;
    }

    /**
     * @method generateOtherwiseIfStatement
     * @description Generates the JavaScript code for an else if block.
     * @param {Object} node - The AST node representing the OtherwiseIfStatement.
     * @returns {string} The generated JavaScript else if block code.
     */
    generateOtherwiseIfStatement(node) {
        const condition = this.generateCondition(node.condition);
        const consequent = this.generateNodes(node.consequent);
        let alternate = "";

        // Handle nested else if or else block
        if (node.alternate && node.alternate.type === "OtherwiseIfStatement") {
            alternate = this.generateOtherwiseIfStatement(node.alternate);
        } else if (node.alternate) {
            alternate = `else {\n${this.generateNodes(node.alternate)}\n}`;
        }

        return `else if (${condition}) {\n${consequent}\n} ${alternate}`;
    }

    /**
     * @method generateForLoop
     * @description Generates the JavaScript code for a for-each loop.
     * @param {Object} node - The AST node representing the for loop.
     * @returns {string} The generated JavaScript for-each loop code.
     */
    generateForLoop(node) {
        const iterator = node.iterator;
        const collection = node.collection;
        // Add the iterator to the declared variables
        this.declaredVariables.add(iterator);
        const body = this.generateNodes(node.body);
        // Remove the iterator from the declared variables after use
        this.declaredVariables.delete(iterator);
        return `for (const ${iterator} of ${collection}) {\n${body}\n}`;
    }

    /**
     * @method generateWhileLoop
     * @description Generates the JavaScript code for a while loop.
     * @param {Object} node - The AST node representing the while loop.
     * @returns {string} The generated JavaScript while loop code.
     */
    generateWhileLoop(node) {
        let condition = this.generateCondition(node.condition);
        // Remove any quotes from the condition string
        condition = condition.replace(/['"]+/g, "");
        const body = this.generateNodes(node.body);
        return `while (${condition}) {\n${body}\n}`;
    }

    /**
     * @method generatePrintStatement
     * @description Generates the JavaScript code for a print statement (console.log).
     * @param {Object} node - The AST node representing the print statement.
     * @returns {string} The generated JavaScript console.log statement.
     */
    generatePrintStatement(node) {
        return `console.log(${this.generateExpression(node.value)});`;
    }

    /**
     * @method generateArrayCreation
     * @description Generates the JavaScript code for creating an array.
     * @param {Object} node - The AST node representing the array creation.
     * @returns {string} The generated JavaScript array creation code.
     */
    generateArrayCreation(node) {
        const values = node.values
            .map((value) => this.generateExpression(value))
            .join(", ");
        return `let ${node.varName} = [${values}];`;
    }

    /**
     * @method generateArrayInsertion
     * @description Generates the JavaScript code for inserting a value into an array at a specific position.
     * @param {Object} node - The AST node representing the array insertion.
     * @returns {string} The generated JavaScript array insertion code.
     */
    generateArrayInsertion(node) {
        return `${node.varName}.splice(${
            node.position
        }, 0, ${this.generateExpression(node.value)});`;
    }

    /**
     * @method generateRemoveOperation
     * @description Generates the JavaScript code for removing an element from an array.
     * @param {Object} node - The AST node representing the remove operation.
     * @returns {string} The generated JavaScript code for removing an array element.
     */
    generateRemoveOperation(node) {
        return `${node.varName}.splice(${node.positionToRemove}, 1);`;
    }

    /**
     * @method generateArraySetValue
     * @description Generates the JavaScript code for setting a value at a specific index in an array.
     * @param {Object} node - The AST node representing the array set value operation.
     * @returns {string} The generated JavaScript code for setting an array value.
     */
    generateArraySetValue(node) {
        return `${node.varName}[${
            node.index.value
        }] = ${this.generateExpression(node.setValue)};`;
    }

    /**
     * @method generateIndexExpression
     * @description Generates the JavaScript code for accessing an array at a specific index.
     * @param {Object} node - The AST node representing the index expression.
     * @returns {string} The generated JavaScript code for array index access.
     */
    generateIndexExpression(node) {
        return `${node.source.value}[${this.generateExpression(node.index)}]`;
    }

    /**
     * @method generateLengthExpression
     * @description Generates the JavaScript code to get the length of an array or string.
     * @param {Object} node - The AST node representing the length expression.
     * @returns {string} The generated JavaScript code for getting the length of an array or string.
     */
    generateLengthExpression(node) {
        return `${node.source}.length`;
    }

    /**
     * @method generateSwapOperation
     * @description Generates the JavaScript code for swapping two elements in an array.
     * @param {Object} node - The AST node representing the swap operation.
     * @returns {string} The generated JavaScript code for swapping two array elements.
     */
    generateSwapOperation(node) {
        return `let temp = ${node.varName}[${node.firstPosition.value}];
${node.varName}[${node.firstPosition.value}] = ${node.varName}[${node.secondPosition.value}];
${node.varName}[${node.secondPosition.value}] = temp;`;
    }

    /**
     * @method generateExpression
     * @description Generates the JavaScript code for a given expression node.
     * @param {Object} expression - The AST node representing the expression to generate.
     * @param {number} [parentPrecedence=0] - The precedence level of the parent expression, used to determine if parentheses are needed.
     * @returns {string} The generated JavaScript expression.
     * @throws {Error} If the expression type is unknown.
     */
    generateExpression(expression, parentPrecedence = 0) {
        // Operator precedence table
        const operatorPrecedence = {
            "*": 2,
            "/": 2,
            "+": 1,
            "-": 1,
            and: 0, // Logical AND
            or: 0, // Logical OR
            not: 3, // Logical NOT (unary, higher precedence)
        };

        // Helper function to get the precedence of an operator
        const getOperatorPrecedence = (operator) => {
            return operatorPrecedence[operator] || 0;
        };

        expression = this.ensureStructuredValue(expression); // Ensure the expression is properly structured

        switch (expression.type) {
            case "Expression": {
                const currentOperator = expression.operator;
                const currentPrecedence =
                    getOperatorPrecedence(currentOperator);

                // Generate left and right sides of the expression
                const left = this.generateExpression(
                    expression.left,
                    currentPrecedence
                );
                const right = this.generateExpression(
                    expression.right,
                    currentPrecedence
                );

                // Check if parentheses are needed for left and right sides
                const needParenthesesForLeft =
                    typeof expression.left === "object" &&
                    expression.left.type === "Expression" &&
                    getOperatorPrecedence(expression.left.operator) <
                        currentPrecedence;

                const needParenthesesForRight =
                    typeof expression.right === "object" &&
                    expression.right.type === "Expression" &&
                    getOperatorPrecedence(expression.right.operator) <=
                        currentPrecedence;

                // Wrap expressions in parentheses if required to maintain precedence
                const leftWrapped = needParenthesesForLeft ? `(${left})` : left;
                const rightWrapped = needParenthesesForRight
                    ? `(${right})`
                    : right;

                return `${leftWrapped} ${currentOperator} ${rightWrapped}`;
            }
            case "Identifier":
                return expression.value;

            case "NumberLiteral":
                return expression.value;

            case "StringLiteral":
                return `"${expression.value}"`;

            case "BooleanLiteral": // Handle boolean literals
                return expression.value;

            case "FunctionCall":
                const args = expression.arguments
                    .map((arg) => this.generateExpression(arg))
                    .join(", ");
                return `${expression.callee}(${args})`;

            case "SubstringExpression":
                const string = expression.string;
                const start = this.generateExpression(expression.start);
                const end = this.generateExpression(expression.end);
                return `${string}.substring(${start}, ${end})`;

            case "IndexExpression":
                return `${expression.source}[${this.generateExpression(
                    expression.index
                )}]`;

            case "LogicalOperator":
                return this.generateCondition(expression);

            case "LengthExpression":
                return `${expression.source}.length`;

            default:
                throw new Error(`Unknown expression type: ${expression.type}`);
        }
    }

    /**
     * @method generateCondition
     * @description Generates the JavaScript condition for control flow statements (e.g., if, while).
     * @param {Object} condition - The condition node to generate.
     * @returns {string} The JavaScript code representing the condition.
     */
    generateCondition(condition) {
        // If the condition is a primitive (non-object), treat it as a simple value
        if (typeof condition !== "object" || condition === null) {
            return this.generateExpression(condition); // Handle primitive values
        }

        // Recursively generate the left-hand side of the condition
        const left =
            condition.left.type === "Expression"
                ? this.generateCondition(condition.left) // Recursively process nested expressions
                : this.generateExpression(condition.left); // Handle simple expressions

        const operator = this.getOperator(condition.operator); // Map the operator to its JavaScript equivalent

        // Recursively generate the right-hand side of the condition
        const right =
            condition.right.type === "Expression"
                ? this.generateCondition(condition.right) // Recursively process nested expressions
                : this.generateExpression(condition.right); // Handle simple expressions

        // Return the generated condition as a JavaScript expression
        return `${left} ${operator} ${right}`;
    }

    /**
     * @method getOperator
     * @description Maps pseudocode operators to their JavaScript equivalents.
     * @param {string} operator - The operator in pseudocode.
     * @returns {string} The JavaScript equivalent of the operator.
     * @throws {Error} If the operator is unknown.
     */
    getOperator(operator) {
        switch (operator) {
            case "greater":
                return ">";
            case "less":
                return "<";
            case "equal":
                return "==";
            case "and":
                return "&&";
            case "or":
                return "||";
            case "not":
                return "!";
            case ">":
            case "<":
            case "==":
            case "!=":
            case ">=":
            case "<=":
                return operator; // Return existing JavaScript operators
            default:
                throw new Error(`Unknown operator: ${operator}`);
        }
    }

    /**
     * @method ensureStructuredValue
     * @description Ensures a value is properly structured as an AST node (e.g., converting strings and numbers to AST node types).
     * @param {string|number|Object} value - The value to ensure is structured.
     * @returns {Object} A structured AST node representing the value.
     * @throws {Error} If the value type is unsupported.
     */
    ensureStructuredValue(value) {
        if (typeof value === "object" && value !== null) return value; // Return if already structured
        if (this.declaredVariables.has(value))
            // Check for declared variables
            return { type: "Identifier", value };
        if (!isNaN(value))
            // Handle numeric literals
            return { type: "NumberLiteral", value: value.toString() };
        if (typeof value === "string")
            // Handle string literals
            return { type: "StringLiteral", value };
        throw new Error(`Unsupported value type: ${typeof value}`);
    }

    /**
     * @method needsParentheses
     * @description Determines if an expression needs parentheses based on its operator precedence.
     * @param {Object} expression - The expression to check.
     * @param {number} currentPrecedence - The precedence of the current operator.
     * @returns {boolean} True if the expression needs parentheses, false otherwise.
     */
    needsParentheses(expression, currentPrecedence) {
        return (
            typeof expression === "object" &&
            expression.type === "Expression" &&
            this.getOperatorPrecedence(expression.operator) < currentPrecedence
        );
    }

    /**
     * @method generateLoopFromTo
     * @description Generates a for-loop from a start value to an end value.
     * @param {Object} node - The AST node representing the loop.
     * @returns {string} The generated JavaScript code for the loop.
     */
    generateLoopFromTo(node) {
        const loopVariable = node.loopVariable; // The loop variable
        const startValue = this.generateExpression(node.range.start); // Start value of the loop
        const endValue = this.generateExpression(node.range.end); // End value of the loop

        this.declaredVariables.add(loopVariable); // Add the loop variable to declared variables
        const body = this.generateNodes(node.body); // Generate the body of the loop
        return `for (let ${loopVariable} = ${startValue}; ${loopVariable} <= ${endValue}; ${loopVariable}++) {\n${body}\n}`;
    }
}

export default JavaScriptGenerator;
