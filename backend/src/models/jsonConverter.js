class JsonConverter {
    constructor() {
        this.variables = {};
    }

    transformToFinalJSON(ir) {
        return {
            actionFrames: this.transformNodes(ir.program),
        };
    }

    transformNodes(nodes) {
        return nodes.flatMap((node) => this.transformNode(node));
    }

    transformNode(node) {
        switch (node.type) {
            case "VariableDeclaration":
                return this.transformVariableDeclaration(node);
            case "FunctionDeclaration":
                return {
                    operation: "define",
                    varName: node.name,
                    params: node.params,
                    body: this.transformNodes(node.body),
                    timestamp: new Date().toISOString(),
                    description: `Defined function ${
                        node.name
                    } with parameters ${node.params.join(", ")}.`,
                };
            case "PrintStatement":
                return {
                    operation: "print",
                    isLiteral: true,
                    varName: null,
                    literal: node.value,
                    timestamp: new Date().toISOString(),
                    description: `Printed ${node.value}.`,
                };
            case "IfStatement":
                const conditionResult = this.evaluateCondition(node.condition);
                const conditionString = `${this.evaluateExpression(
                    node.condition.left
                )} ${node.condition.operator} ${this.evaluateExpression(
                    node.condition.right
                )}`;
                return [
                    {
                        operation: "if",
                        condition: conditionString,
                        result: conditionResult,
                        timestamp: new Date().toISOString(),
                        description: `Checked if ${conditionString}.`,
                    },
                    ...(conditionResult
                        ? this.transformNodes(node.consequent)
                        : this.transformNodes(node.alternate || [])),
                ];
            case "ForLoop":
                return {
                    operation: "for",
                    iterator: node.iterator,
                    collection: node.collection,
                    body: this.transformNodes(node.body),
                    timestamp: new Date().toISOString(),
                    description: `Iterating over ${node.collection} with ${node.iterator}.`,
                };
            case "WhileLoop":
                return this.transformWhileLoop(node);
            case "ReturnStatement":
                const transformedReturnValue = this.transformExpression(
                    node.value
                );
                return {
                    operation: "return",
                    value: transformedReturnValue,
                    timestamp: new Date().toISOString(),
                    description: `Returned ${JSON.stringify(
                        transformedReturnValue
                    )}.`,
                };
            default:
                throw new Error(`Unknown node type: ${node.type}`);
        }
    }

    transformVariableDeclaration(node) {
        const value = this.evaluateExpression(node.value);
        this.variables[node.name] = value;
        return {
            operation: "set",
            varName: node.name,
            value: value,
            timestamp: new Date().toISOString(),
            description: `Set variable ${node.name} to ${value}.`,
        };
    }

    transformWhileLoop(node) {
        const condition = `${this.evaluateExpression(node.condition.left)} ${
            node.condition.operator
        } ${this.evaluateExpression(node.condition.right)}`;
        const body = this.transformNodes(node.body).map((frame) => {
            if (frame.operation === "set" && frame.value.operator) {
                const description = `Set variable ${frame.varName} to ${frame.value.left} ${frame.value.operator} ${frame.value.right}.`;
                return {
                    ...frame,
                    description: description,
                    value: {
                        left: frame.value.left,
                        operator: frame.value.operator,
                        right: frame.value.right,
                    },
                };
            }
            return frame;
        });
        return {
            operation: "while",
            condition: condition,
            body: body,
            timestamp: new Date().toISOString(),
            description: `While loop with condition ${condition}.`,
        };
    }

    evaluateCondition(condition) {
        const left = isNaN(condition.left)
            ? this.variables[condition.left] || condition.left
            : parseFloat(condition.left);
        const right = isNaN(condition.right)
            ? this.variables[condition.right] || condition.right
            : parseFloat(condition.right);
        switch (condition.operator) {
            case "greater":
                return left > right;
            case "less":
                return left < right;
            case "equal":
                return left === right;
            default:
                throw new Error(`Unknown operator: ${condition.operator}`);
        }
    }

    transformExpression(expression) {
        if (expression.type === "Expression") {
            return {
                left:
                    this.transformExpression(expression.left).value ||
                    this.transformExpression(expression.left),
                operator: expression.operator,
                right:
                    this.transformExpression(expression.right).value ||
                    this.transformExpression(expression.right),
            };
        } else if (expression.type === "Identifier") {
            return {
                value: this.variables[expression.value] || expression.value,
            };
        } else {
            return { value: expression.value };
        }
    }

    evaluateExpression(expression) {
        if (expression.type === "Identifier") {
            return this.variables[expression.value] || expression.value;
        } else if (
            expression.type === "NumberLiteral" ||
            expression.type === "StringLiteral"
        ) {
            return expression.value;
        } else if (expression.type === "Expression") {
            const left = this.evaluateExpression(expression.left);
            const right = this.evaluateExpression(expression.right);
            return `${left} ${expression.operator} ${right}`;
        } else {
            return expression;
        }
    }
}

export default JsonConverter;
