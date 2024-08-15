class Transformer {
    transform(ast) {
        return {
            program: this.transformNodes(ast.body),
        };
    }

    transformNodes(nodes) {
        return nodes.map((node) => this.transformNode(node));
    }

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
            default:
                throw new Error(`Unknown node type: ${node.type}`);
        }
    }

    transformCondition(condition) {
        return {
            left: condition.left,
            operator: condition.operator,
            right: this.transformExpression(condition.right).value,
        };
    }

    transformExpression(expression) {
        if (expression.type === "Expression") {
            let leftExp =
                expression.left.type === "Expression"
                    ? this.transformExpression(expression.left)
                    : this.transformExpression(expression.left).value;
            let rightExp =
                expression.right.type === "Expression"
                    ? this.transformExpression(expression.right)
                    : this.transformExpression(expression.right).value;
            const result = {
                type: "Expression",
                left: leftExp,
                operator: expression.operator,
                right: rightExp,
            };
            return result;
        } else if (
            expression.type === "Identifier" ||
            expression.type === "Literal"
        ) {
            const result = { value: expression.value };
            return result;
        } else {
            return expression;
        }
    }

    transformReturnValue(expression) {
        if (expression.type === "Expression") {
            return {
                type: "Expression",
                left: { value: expression.left.value },
                operator: expression.operator,
                right: { value: expression.right.value },
            };
        } else {
            return this.transformExpression(expression);
        }
    }

    transformLoopUntil(node) {
        return {
            type: "LoopUntil",
            condition: this.transformCondition(node.condition),
            body: this.transformNodes(node.body),
        };
    }

    transformLoopFromTo(node) {
        return {
            type: "LoopFromTo",
            range: {
                start: this.transformExpression(node.range.start).value,
                end: this.transformExpression(node.range.end).value,
            },
            body: this.transformNodes(node.body),
        };
    }
}

export default Transformer;
