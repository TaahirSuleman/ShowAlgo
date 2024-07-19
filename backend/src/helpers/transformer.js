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
                    value: this.transformExpression(node.value),
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
                    value: this.transformExpression(node.value),
                };
            default:
                throw new Error(`Unknown node type: ${node.type}`);
        }
    }

    transformCondition(condition) {
        return {
            left: condition.left,
            operator: condition.operator,
            right: this.transformExpression(condition.right),
        };
    }

    transformExpression(expression) {
        if (expression.type === "Expression") {
            return {
                left: expression.left.value,
                operator: expression.operator,
                right: expression.right.value,
            };
        } else {
            return expression.value;
        }
    }
}

export default Transformer;
