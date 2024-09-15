import NodeTransformerFactory from "./NodeTransformerFactory.js";

/**
 * @class Transformer
 * @description Transforms an Abstract Syntax Tree (AST) into an intermediate representation (IR).
 * This class is responsible for traversing the AST and converting it into a more usable format
 * for further processing or code generation.
 * @author Taahir Suleman
 */
class Transformer {
    /**
     * @constructor
     * @description Initializes the Transformer with a NodeTransformerFactory instance.
     */
    constructor() {
        this.factory = new NodeTransformerFactory();
    }

    /**
     * @method transform
     * @description Transforms the root of the AST into an intermediate representation (IR).
     * @param {Object} ast - The abstract syntax tree to be transformed.
     * @returns {Object} The transformed program, containing the intermediate representation.
     */
    transform(ast) {
        return {
            program: this.transformNodes(ast.body), // Transforms the body of the program into IR
        };
    }

    /**
     * @method transformNodes
     * @description Transforms an array of AST nodes into their intermediate representations.
     * @param {Array<Object>} nodes - The array of AST nodes to be transformed.
     * @returns {Array<Object>} An array of transformed nodes.
     */
    transformNodes(nodes) {
        return nodes.map((node) => this.transformNode(node)); // Map each node to its transformed representation
    }

    /**
     * @method transformNode
     * @description Transforms a single AST node into its intermediate representation using the factory.
     * @param {Object} node - The AST node to be transformed.
     * @returns {Object} The transformed node.
     */
    transformNode(node) {
        return this.factory.createTransformedNode(node.type, this, node); // Use the factory to transform the node
    }

    /**
     * @method transformCondition
     * @description Transforms a condition node from the AST into an intermediate representation.
     * Handles various condition types including identifiers, expressions, and length expressions.
     * @param {Object} condition - The condition node from the AST.
     * @returns {Object} The transformed condition object.
     */
    transformCondition(condition) {
        // Check if the condition is a simple identifier
        if (condition.type === "Identifier") {
            return {
                type: condition.type,
                value: condition.value,
            };
        }

        let leftVal = condition.left;

        // Handle left side of the condition (e.g., expressions, length expressions)
        if (condition.left != null) {
            if (condition.left.type === "LengthExpression") {
                leftVal = this.factory.createTransformedNode(
                    condition.left.type,
                    this,
                    condition.left
                );
            } else if (condition.left.type === "Expression") {
                leftVal = this.transformExpression(condition.left);
                leftVal =
                    leftVal.type === "UnaryExpression" ||
                    leftVal.type === "Expression"
                        ? leftVal
                        : leftVal.value;
            }
        }

        // Transform the right-hand side of the condition
        const rightTransformed = this.transformExpression(condition.right);

        return {
            left: leftVal, // Transformed left expression
            operator: condition.operator, // Condition operator (e.g., "==", "!=")
            right:
                rightTransformed.type === "UnaryExpression" ||
                rightTransformed.type === "Expression"
                    ? rightTransformed
                    : rightTransformed.value, // Transformed right expression
            line: condition.line, // Line number for debugging
        };
    }

    /**
     * @method transformExpression
     * @description Transforms an expression node into its intermediate representation.
     * Handles various types of expressions including substrings, length expressions, index expressions, and literals.
     * @param {Object} expression - The expression node from the AST.
     * @returns {Object} The transformed expression object.
     */
    transformExpression(expression) {
        // Handle substring expressions
        if (expression.type === "SubstringExpression") {
            return this.transformSubstringExpression(expression);
        }

        // Handle length expressions
        if (expression.type === "LengthExpression") {
            return this.factory.createTransformedNode(
                expression.type,
                this,
                expression
            );
        }

        // Handle index expressions
        if (expression.type === "IndexExpression") {
            return this.factory.createTransformedNode(
                expression.type,
                this,
                expression
            );
        }

        // Handle complex expressions (binary and unary)
        if (expression.type === "Expression") {
            // Handle unary expression (e.g., NOT)
            if (expression.left === null && expression.operator === "not") {
                return this.transformUnaryExpression(expression);
            }

            // Handle binary expression (e.g., x + y)
            const leftExp =
                expression.left?.type === "LengthExpression"
                    ? this.factory.createTransformedNode(
                          expression.left.type,
                          this,
                          expression.left
                      )
                    : expression.left?.type === "Expression"
                    ? this.transformExpression(expression.left)
                    : expression.left?.value || expression.left || null;

            const rightExp =
                expression.right?.type === "LengthExpression"
                    ? this.factory.createTransformedNode(
                          expression.right.type,
                          this,
                          expression.right
                      )
                    : expression.right?.type === "Expression"
                    ? this.transformExpression(expression.right)
                    : expression.right?.value || expression.right || null;

            return {
                type: "Expression",
                line: expression.line,
                left: leftExp, // Transformed left-hand expression
                operator: expression.operator, // Operator (e.g., "+", "-", "and", "or")
                right: rightExp, // Transformed right-hand expression
            };
        }

        // Handle literal values
        if (expression.type === "Literal") {
            return { value: expression.value };
        }

        // Return the expression as is if no specific transformation is required
        return expression;
    }

    /**
     * Transforms a substring expression node.
     * @param {Object} expression - The substring expression node to transform.
     * @returns {Object} The transformed substring expression object.
     * @throws {Error} If the start or end indices are not numeric.
     */
    transformSubstringExpression(expression) {
        let start = this.transformExpression(expression.start);
        let end = this.transformExpression(expression.end);

        // Validate that start and end are numeric
        if (
            (start.type === "StringLiteral" &&
                typeof this.convertValue(start.value) != "number") ||
            (end.type === "StringLiteral" &&
                typeof this.convertValue(end.value) != "number")
        ) {
            throw new Error(
                `Invalid substring operation: 'start' and 'end' indices must be numeric.`
            );
        } else {
            // Use either the transformed expression or its value directly
            start = start.type === "Expression" ? start : start.value;
            end = end.type === "Expression" ? end : end.value;
        }

        // Return the transformed substring expression
        return {
            type: "SubstringExpression",
            string: expression.string.value, // Flatten the string value
            line: expression.line,
            start: start, // Processed start index
            end: end, // Processed end index
        };
    }

    /**
     * Transforms an index expression node.
     * @param {Object} expression - The index expression node.
     * @returns {Object} The transformed index expression object.
     */
    transformIndexExpression(expression) {
        return {
            type: "IndexExpression",
            line: expression.line,
            source: expression.source.value,
            index: expression.index.value,
        };
    }

    /**
     * Transforms a unary expression node.
     * @param {Object} expression - The unary expression node.
     * @returns {Object} The transformed unary expression object.
     */
    transformUnaryExpression(expression) {
        const rightExp =
            expression.right.type === "Expression"
                ? this.transformExpression(expression.right)
                : expression.right.value || expression.right;

        return {
            type: "UnaryExpression",
            line: expression.line,
            operator: expression.operator,
            argument: rightExp,
        };
    }

    /**
     * Transforms a return value node.
     * @param {Object} expression - The expression node.
     * @returns {Object} The transformed return value object.
     */
    transformReturnValue(expression) {
        if (expression.type === "Expression") {
            return {
                type: "Expression",
                line: expression.line,
                left:
                    expression.left.type === "Expression"
                        ? this.transformReturnValue(expression.left) // Recursively transform nested left expression
                        : expression.left.value, // If it's not an expression, it's a literal value and should be returned as such
                operator: expression.operator,
                right:
                    expression.right.type === "Expression"
                        ? this.transformReturnValue(expression.right) // Recursively transform nested right expression
                        : expression.right.value, // If it's not an expression, it's a literal value and should be returned as such
            };
        } else {
            return this.transformExpression(expression); // Handle other cases as usual
        }
    }

    /**
     * Transforms a LoopUntil node.
     * @param {Object} node - The LoopUntil node.
     * @returns {Object} The transformed LoopUntil node.
     */
    transformLoopUntil(node) {
        return {
            type: "LoopUntil",
            line: node.line,
            condition: this.transformCondition(node.condition),
            body: this.transformNodes(node.body),
        };
    }

    /**
     * Transforms a LoopFromTo node.
     * @param {Object} node - The LoopFromTo node.
     * @returns {Object} The transformed LoopFromTo node.
     */
    transformLoopFromTo(node) {
        return {
            type: "LoopFromTo",
            line: node.line,
            loopVariable: node.loopVariable,
            range: {
                start: this.transformExpression(node.range.start),
                end: this.transformExpression(node.range.end),
            },
            body: this.transformNodes(node.body),
        };
    }

    /**
     * Transforms a function call node.
     * @param {Object} node - The function call AST node.
     * @returns {Object} The transformed function call.
     */
    transformFunctionCall(node) {
        const functionName = node.name; // Function name
        const args = node.args.map((arg) => this.transformExpression(arg)); // Transform each argument provided, to form an array of transformed args.

        return {
            type: "FunctionCall",
            line: node.line,
            name: functionName,
            args: args,
            callLine: node.line,
        };
    }

    /**
     * Converts a value to its appropriate type.
     * If the value is a non-empty numeric string, it will be converted to a number.
     * Otherwise, the original value is returned.
     *
     * @param value - The value to be converted.
     * @returns The converted value as a number if applicable, otherwise the original value.
     */
    convertValue(value) {
        // Check if the value is a non-empty string and can be converted to a number
        if (typeof value === "string" && value.trim() !== "" && !isNaN(value)) {
            return Number(value);
        }
        // Return the original value if no conversion is applied
        return value;
    }
}

export default Transformer;
