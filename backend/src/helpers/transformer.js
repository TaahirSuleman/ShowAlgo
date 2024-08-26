class Transformer {
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
        switch (node.type) {
            case "Program":
                return {
                    program: this.transformNodes(node.body),
                };
            case "FunctionDeclaration":
                return {
                    type: "FunctionDeclaration",
                    name: node.name,
                    params: node.params,
                    body: this.transformNodes(node.body),
                };
            case "VariableDeclaration":
                return {
                    type: "VariableDeclaration",
                    name: node.varName,
                    value: this.transformExpression(node.value),
                };
            case "PrintStatement":
                return {
                    type: "PrintStatement",
                    value: this.transformExpression(node.value).value,
                };
            case "IfStatement":
                return {
                    type: "IfStatement",
                    condition: this.transformCondition(node.condition),
                    consequent: this.transformNodes(node.consequent),
                    alternate: node.alternate
                        ? this.transformNodes(node.alternate)
                        : null,
                };
            case "ForLoop":
                return {
                    type: "ForLoop",
                    iterator: node.iterator,
                    collection: node.collection,
                    body: this.transformNodes(node.body),
                };
            case "WhileLoop":
                return {
                    type: "WhileLoop",
                    condition: this.transformCondition(node.condition),
                    body: this.transformNodes(node.body),
                };
            case "LoopUntil":
                return this.transformLoopUntil(node);
            case "LoopFromTo":
                return this.transformLoopFromTo(node);
            case "ReturnStatement":
                return {
                    type: "ReturnStatement",
                    value: this.transformReturnValue(node.value),
                };
            case "ArrayCreation":
                return {
                    type: "ArrayCreation",
                    varName: node.varName,
                    values: node.values,
                };
            case "ArrayInsertion":
                return {
                    type: "ArrayInsertion",
                    varName: node.varName,
                    value: this.transformExpression(node.value),
                    position: this.transformExpression(node.position).value,
                };
            case "NumberLiteral":
                return {
                    type: "Literal",
                    value: node.value,
                };
            case "StringLiteral":
                return {
                    type: "Literal",
                    value: node.value,
                };
            case "Identifier":
                return {
                    type: "Identifier",
                    value: node.value,
                };
            default:
                throw new Error(`Unknown node type: ${node.type}`);
        }
    }

    /**
     * Transforms a condition node.
     * @param {Object} condition - The condition node.
     * @returns {Object} The transformed condition.
     */
    transformCondition(condition) {
        return {
            left: condition.left,
            operator: condition.operator,
            right: this.transformExpression(condition.right).value,
        };
    }

    /**
     * Transforms an expression node.
     * @param {Object} expression - The expression node.
     * @returns {Object} The transformed expression.
     */
    transformExpression(expression) {
        if (expression.type === "Expression") {
            const leftExp =
                expression.left.type === "Expression"
                    ? this.transformExpression(expression.left)
                    : this.transformExpression(expression.left).value;
            const rightExp =
                expression.right.type === "Expression"
                    ? this.transformExpression(expression.right)
                    : this.transformExpression(expression.right).value;
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
