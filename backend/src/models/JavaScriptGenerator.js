import Converter from "./Converter.js";
import JavaScriptNodeFactory from "./JavaScriptNodeFactory.js";

/**
 * @class JavaScriptGenerator
 * @description Converts IR into JavaScript code using a factory for node creation.
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
        this.nodeFactory = new JavaScriptNodeFactory(this); // Factory pattern
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

    // Continue adding similar methods for function declarations, loops, etc.
    generateFunctionDeclaration(node) {
        const params = node.params.join(", ");
        for (const param of params) {
            this.declaredVariables.add(param);
        }
        const body = this.generateNodes(node.body);
        for (const param of params) {
            this.declaredVariables.delete(param);
        }
        return `function ${node.name}(${params}) {\n${body}\n}`;
    }

    generateReturnStatement(node) {
        return `return ${this.generateExpression(node.value)};`;
    }

    generateIfStatement(node) {
        const condition = this.generateCondition(node.condition);
        const consequent = this.generateNodes(node.consequent);
        const alternate = node.alternate
            ? `else {\n${this.generateNodes(node.alternate)}\n}`
            : "";
        return `if (${condition}) {\n${consequent}\n} ${alternate}`;
    }

    generateForLoop(node) {
        const iterator = node.iterator;
        const collection = node.collection;
        this.declaredVariables.add(iterator);
        const body = this.generateNodes(node.body);
        this.declaredVariables.delete(iterator);
        return `for (const ${iterator} of ${collection}) {\n${body}\n}`;
    }

    generateWhileLoop(node) {
        let condition = this.generateCondition(node.condition);
        condition = condition.replace(/['"]+/g, "");
        const body = this.generateNodes(node.body);
        return `while (${condition}) {\n${body}\n}`;
    }

    generateLoopUntil(node) {
        let flippedCondition = this.flipCondition(
            this.generateCondition(node.condition)
        );
        return this.generateWhileLoop({ ...node, condition: flippedCondition });
    }

    generatePrintStatement(node) {
        return `console.log(${this.generateExpression(node.value)});`;
    }

    generateArrayCreation(node) {
        const values = node.values
            .map((value) => this.generateExpression(value))
            .join(", ");
        return `let ${node.varName} = [${values}];`;
    }

    generateArrayInsertion(node) {
        return `${node.varName}.splice(${
            node.position
        }, 0, ${this.generateExpression(node.value)});`;
    }

    generateRemoveOperation(node) {
        return `${node.varName}.splice(${node.positionToRemove}, 1);`;
    }

    generateArraySetValue(node) {
        return `${node.varName}[${
            node.index.value
        }] = ${this.generateExpression(node.setValue)};`;
    }

    generateIndexExpression(node) {
        return `${node.source.value}[${this.generateExpression(node.index)}]`;
    }

    generateLengthExpression(node) {
        return `${node.source}.length`;
    }

    generateSwapOperation(node) {
        return `let temp = ${node.varName}[${node.firstPosition.value}];
${node.varName}[${node.firstPosition.value}] = ${node.varName}[${node.secondPosition.value}];
${node.varName}[${node.secondPosition.value}] = temp;`;
    }

    generateExpression(expression, parentPrecedence = 0) {
        const operatorPrecedence = {
            "*": 2,
            "/": 2,
            "+": 1,
            "-": 1,
            and: 0, // Logical AND
            or: 0, // Logical OR
            not: 3, // Logical NOT (unary, higher precedence)
        };

        const getOperatorPrecedence = (operator) => {
            return operatorPrecedence[operator] || 0;
        };

        expression = this.ensureStructuredValue(expression); // Ensure it's structured

        switch (expression.type) {
            case "Expression": {
                const currentOperator = expression.operator;
                const currentPrecedence =
                    getOperatorPrecedence(currentOperator);

                // Generate left and right expressions
                const left = this.generateExpression(
                    expression.left,
                    currentPrecedence
                );
                const right = this.generateExpression(
                    expression.right,
                    currentPrecedence
                );

                // Only add parentheses if the current precedence is lower than the parent
                const needParenthesesForLeft =
                    typeof expression.left === "object" &&
                    expression.left.type === "Expression" &&
                    getOperatorPrecedence(expression.left.operator) <
                        currentPrecedence;

                // Add parentheses for right when it's necessary to maintain precedence
                const needParenthesesForRight =
                    typeof expression.right === "object" &&
                    expression.right.type === "Expression" &&
                    getOperatorPrecedence(expression.right.operator) <=
                        currentPrecedence;

                // Adjust parentheses placement for nested expressions
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
            case "BooleanLiteral": // Add this case
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

    generateCondition(condition) {
        // If the condition is not an object and not null, treat it as a primitive value
        if (typeof condition !== "object" || condition === null) {
            return this.generateExpression(condition); // Handle as a simple value
        }

        // Recursively process the left side of the condition if it's an expression
        const left =
            condition.left.type === "Expression"
                ? this.generateCondition(condition.left) // Recurse for nested expressions
                : this.generateExpression(condition.left); // Generate for simple expressions

        const operator = this.getOperator(condition.operator); // Map operator (e.g., 'greater' to '>')

        // Recursively process the right side of the condition if it's an expression
        const right =
            condition.right.type === "Expression"
                ? this.generateCondition(condition.right) // Recurse for nested expressions
                : this.generateExpression(condition.right); // Generate for simple expressions

        // Return the condition as a proper JavaScript expression without quotes
        return `${left} ${operator} ${right}`;
    }

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
                return operator;
            default:
                throw new Error(`Unknown operator: ${operator}`);
        }
    }

    flipCondition(condition) {
        if (condition.includes(">=")) return condition.replace(">=", "<");
        if (condition.includes(">")) return condition.replace(">", "<=");
        if (condition.includes("<=")) return condition.replace("<=", ">");
        if (condition.includes("<")) return condition.replace("<", ">=");
        if (condition.includes("==")) return condition.replace("==", "!=");
        if (condition.includes("!=")) return condition.replace("!=", "==");
        throw new Error("Unsupported condition operator for flipping");
    }

    ensureStructuredValue(value) {
        if (typeof value === "object" && value !== null) return value;
        if (this.declaredVariables.has(value))
            return { type: "Identifier", value };
        if (!isNaN(value))
            return { type: "NumberLiteral", value: value.toString() };
        if (typeof value === "string") return { type: "StringLiteral", value };
        throw new Error(`Unsupported value type: ${typeof value}`);
    }

    needsParentheses(expression, currentPrecedence) {
        return (
            typeof expression === "object" &&
            expression.type === "Expression" &&
            this.getOperatorPrecedence(expression.operator) < currentPrecedence
        );
    }

    generateLoopFromTo(node) {
        const loopVariable = node.loopVariable;
        const startValue = this.generateExpression(node.range.start);
        const endValue = this.generateExpression(node.range.end);

        this.declaredVariables.add(loopVariable);
        const body = this.generateNodes(node.body);
        return `for (let ${loopVariable} = ${startValue}; ${loopVariable} <= ${endValue}; ${loopVariable}++) {\n${body}\n}`;
    }
}

export default JavaScriptGenerator;
