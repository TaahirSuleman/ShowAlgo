class NodeTransformerFactory {
    /**
     * Creates a transformed node based on the type.
     * @param {string} type - The type of the node.
     * @param {Object} transformer - The transformer instance to handle node transformation.
     * @param {Object} node - The AST node to be transformed.
     * @returns {Object} The transformed node.
     * @throws {Error} If the node type is unknown.
     */
    createTransformedNode(type, transformer, node) {
        switch (type) {
            case "Program":
                return {
                    program: transformer.transformNodes(node.body),
                };
            case "FunctionDeclaration":
                return {
                    type: "FunctionDeclaration",
                    name: node.name,
                    params: node.params,
                    body: transformer.transformNodes(node.body),
                };
            case "VariableDeclaration":
                return {
                    type: "VariableDeclaration",
                    name: node.varName,
                    value: transformer.transformExpression(node.value),
                };
            case "PrintStatement":
                return {
                    type: "PrintStatement",
                    value: transformer.transformExpression(node.value).value,
                };
            case "IfStatement":
                return {
                    type: "IfStatement",
                    condition: transformer.transformCondition(node.condition),
                    consequent: transformer.transformNodes(node.consequent),
                    alternate: node.alternate
                        ? transformer.transformNodes(node.alternate)
                        : null,
                };
            case "ForLoop":
                return {
                    type: "ForLoop",
                    iterator: node.iterator,
                    collection: node.collection,
                    body: transformer.transformNodes(node.body),
                };
            case "WhileLoop":
                return {
                    type: "WhileLoop",
                    condition: transformer.transformCondition(node.condition),
                    body: transformer.transformNodes(node.body),
                };
            case "LoopUntil":
                return transformer.transformLoopUntil(node);
            case "LoopFromTo":
                return transformer.transformLoopFromTo(node);
            case "ReturnStatement":
                return {
                    type: "ReturnStatement",
                    value: transformer.transformReturnValue(node.value),
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
                    value: transformer.transformExpression(node.value),
                    position: transformer.transformExpression(node.position)
                        .value,
                };
            case "NumberLiteral":
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
            case "LengthExpression":
                return {
                    type: "LengthExpression",
                    source: node.source.value, // Extract the variable name directly
                };
            case "SubstringExpression":
                return transformer.transformSubstringExpression(node);

            default:
                throw new Error(`Unknown node type: ${type}`);
        }
    }
}

export default NodeTransformerFactory;
