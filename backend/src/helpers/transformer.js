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
            case "ReturnStatement":
                return {
                    type: "ReturnStatement",
                    value: this.transformReturnValue(node.value),
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
            return {
                type: "Expression",
                left: this.transformExpression(expression.left).value,
                operator: expression.operator,
                right: this.transformExpression(expression.right).value,
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
}

export default Transformer;
