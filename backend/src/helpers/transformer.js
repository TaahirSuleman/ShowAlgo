import NodeTransformerFactory from "./NodeTransformerFactory.js";

class Transformer {
    constructor() {
        this.factory = new NodeTransformerFactory();
    }

    /**
     * Transforms the AST to an intermediate representation.
     * @param {Object} ast - The abstract syntax tree.
     * @returns {Object} The transformed program.
     */
    transform(ast) {
        return {
            program: this.transformNodes(ast.body),
        };
    }

    /**
     * Transforms an array of nodes.
     * @param {Array} nodes - The array of AST nodes.
     * @returns {Array} The array of transformed nodes.
     */
    transformNodes(nodes) {
        return nodes.map((node) => this.transformNode(node));
    }

    /**
     * Transforms a single node.
     * @param {Object} node - The AST node.
     * @returns {Object} The transformed node.
     */
    transformNode(node) {
        return this.factory.createTransformedNode(node.type, this, node);
    }

    /**
     * Transforms a condition node.
     * @param {Object} condition - The condition node.
     * @returns {Object} The transformed condition.
     */
    transformCondition(condition) {
        // Ensure we handle both UnaryExpression and Expression types
        if (condition.type === "Identifier") {
            return {
                type: condition.type,
                value: condition.value,
            };
        }
        let leftVal = condition.left;
        if (condition.left != null) {
            if (condition.left.type === "LengthExpression")
                leftVal = this.factory.createTransformedNode(
                    condition.left.type,
                    this,
                    condition.left
                );
            else if (condition.left.type === "Expression") {
                leftVal = this.transformExpression(condition.left);
                leftVal =
                    leftVal.type === "UnaryExpression" ||
                    leftVal.type === "Expression"
                        ? leftVal
                        : leftVal.value;
            }
        }
        const rightTransformed = this.transformExpression(condition.right);

        return {
            left: leftVal,
            operator: condition.operator,
            right:
                rightTransformed.type === "UnaryExpression" ||
                rightTransformed.type === "Expression"
                    ? rightTransformed
                    : rightTransformed.value,
            line: condition.line,
        };
    }

    /**
     * Transforms an expression node.
     * @param {Object} expression - The expression node.
     * @returns {Object} The transformed expression.
     */
    transformExpression(expression) {
        const operatorPrecedence = {
            "*": 2,
            "/": 2,
            "+": 1,
            "-": 1,
        };

        const getOperatorPrecedence = (operator) => {
            return operatorPrecedence[operator] || 0;
        };

        if (expression.type === "SubstringExpression") {
            return this.transformSubstringExpression(expression);
        }
        if (expression.type === "LengthExpression")
            return this.factory.createTransformedNode(
                expression.type,
                this,
                expression
            );

        if (expression.type === "IndexExpression")
            return this.factory.createTransformedNode(
                expression.type,
                this,
                expression
            );
        if (expression.type === "Expression") {
            // Handle unary expressions by delegating to the appropriate function
            if (expression.left === null && expression.operator === "not") {
                return this.transformUnaryExpression(expression);
            }

            // Handle binary expressions
            const leftExp =
                expression.left.type === "LengthExpression"
                    ? this.factory.createTransformedNode(
                          expression.left.type,
                          this,
                          expression.left
                      )
                    : expression.left && expression.left.type === "Expression"
                    ? this.transformExpression(expression.left)
                    : expression.left
                    ? expression.left.value || expression.left
                    : null;

            const rightExp =
                expression.right.type === "LengthExpression"
                    ? this.factory.createTransformedNode(
                          expression.right.type,
                          this,
                          expression.right
                      )
                    : expression.right && expression.right.type === "Expression"
                    ? this.transformExpression(expression.right)
                    : expression.right
                    ? expression.right.value || expression.right
                    : null;

            return {
                type: "Expression",
                line: expression.line,
                left: leftExp,
                operator: expression.operator,
                right: rightExp,
            };
        } else if (expression.type === "Literal") {
            return { value: expression.value };
        } else {
            return expression;
        }
    }

    transformSubstringExpression(expression) {
        let start = this.transformExpression(expression.start);
        let end = this.transformExpression(expression.end);
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
            start = start.type === "Expression" ? start : start.value;
            end = end.type === "Expression" ? end : end.value;
        }

        return {
            type: "SubstringExpression",
            string: expression.string.value, // Flattening the string part
            line: expression.line,
            start: start, // Properly handle the start expression
            end: end, // Properly handle the end expression
        };
    }

    /**
     * Transforms an index expression node.
     * @param {Object} expression - The index expression node.
     * @returns {Object} The transformed index expression.
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
     * @returns {Object} The transformed unary expression.
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
     * @returns {Object} The transformed return value.
     */
    transformReturnValue(expression) {
        if (expression.type === "Expression") {
            return {
                type: "Expression",
                line: expression.line,
                left:
                    expression.left.type === "Expression"
                        ? this.transformReturnValue(expression.left) // Recursively transform nested left expression
                        : expression.left.value, // If it's not an expression, it's a literal value
                operator: expression.operator,
                right:
                    expression.right.type === "Expression"
                        ? this.transformReturnValue(expression.right) // Recursively transform nested right expression
                        : expression.right.value, // If it's not an expression, it's a literal value
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
        const args = node.args.map((arg) => this.transformExpression(arg)); // Transform the arguments

        return {
            type: "FunctionCall",
            line: node.line,
            name: functionName,
            args: args,
            callLine: node.line,
        };
    }

    convertValue(value) {
        if (typeof value === "string" && value.trim() !== "" && !isNaN(value)) {
            return Number(value);
        }
        return value;
    }
}

export default Transformer;
