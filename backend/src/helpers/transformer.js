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
        const rightTransformed = this.transformExpression(condition.right);

        return {
            left: condition.left,
            operator: condition.operator,
            right:
                rightTransformed.type === "UnaryExpression" ||
                rightTransformed.type === "Expression"
                    ? rightTransformed
                    : rightTransformed.value,
        };
    }

    /**
     * Transforms an expression node.
     * @param {Object} expression - The expression node.
     * @returns {Object} The transformed expression.
     */
    transformExpression(expression) {
        if (expression.type === "Expression") {
            // Handle unary expressions by delegating to the appropriate function
            if (expression.left === null && expression.operator === "not") {
                return this.transformUnaryExpression(expression);
            }

            // Handle binary expressions
            const leftExp =
                expression.left && expression.left.type === "Expression"
                    ? this.transformExpression(expression.left)
                    : expression.left
                    ? expression.left.value || expression.left
                    : null;

            const rightExp =
                expression.right && expression.right.type === "Expression"
                    ? this.transformExpression(expression.right)
                    : expression.right
                    ? expression.right.value || expression.right
                    : null;

            return {
                type: "Expression",
                left: leftExp,
                operator: expression.operator,
                right: rightExp,
            };
        } else if (
            expression.type === "Identifier" ||
            expression.type === "Literal"
        ) {
            return { value: expression.value };
        } else {
            return expression;
        }
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
                left: expression.left.value,
                operator: expression.operator,
                right: expression.right.value,
            };
        } else {
            return this.transformExpression(expression);
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
            loopVariable: node.loopVariable,
            range: {
                start: this.transformExpression(node.range.start).value,
                end: this.transformExpression(node.range.end).value,
            },
            body: this.transformNodes(node.body),
        };
    }
}

export default Transformer;
