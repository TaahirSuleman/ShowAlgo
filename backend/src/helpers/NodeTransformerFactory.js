/**
 * @class NodeTransformerFactory
 * @description A factory class responsible for transforming Abstract Syntax Tree (AST) nodes into an intermediate representation (IR).
 * This class processes various node types and ensures that the transformation is done using the appropriate logic for each node.
 * @author Taahir Suleman
 *
 */
class NodeTransformerFactory {
    /**
     * Transforms a node based on its type.
     * @param {string} type - The type of the AST node.
     * @param {Object} transformer - The transformer instance responsible for transforming nodes.
     * @param {Object} node - The AST node to be transformed.
     * @returns {Object} The transformed node in the intermediate representation (IR).
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
                    line: node.line,
                    body: transformer.transformNodes(node.body),
                };
            case "FunctionCall":
                return transformer.transformFunctionCall(node);
            case "VariableDeclaration":
                let value = transformer.transformExpression(node.value);
                let index = node.value.type.indexOf("Literal");
                let typeVar = node.value.type.substring(0, index);

                // Validating variable types against their expected types.
                if (
                    node.varType === "boolean" &&
                    node.value.type !== "BooleanLiteral"
                ) {
                    throw new Error(
                        "Booleans can only be either true or false."
                    );
                } else if (
                    node.varType === "string" &&
                    node.value.type !== "StringLiteral" &&
                    !node.value.type.includes("Expression")
                ) {
                    throw new Error(
                        "Strings cannot be declared as a boolean or number."
                    );
                } else if (
                    node.varType === "number" &&
                    node.value.type !== "NumberLiteral" &&
                    !node.value.type.includes("Expression")
                ) {
                    throw new Error(
                        "Numbers cannot be declared as a string or boolean."
                    );
                }
                return {
                    type: "VariableDeclaration",
                    line: node.line,
                    name:
                        node.type === "IndexExpression"
                            ? transformer.transformExpression(node.value)
                            : node.varName,
                    value: transformer.transformExpression(node.value),
                };
            case "PrintStatement":
                return {
                    type: "PrintStatement",
                    value: node.value.type.includes("Expression")
                        ? transformer.transformExpression(node.value)
                        : transformer.transformExpression(node.value).value,
                    line: node.line,
                };
            case "IfStatement":
                return {
                    type: "IfStatement",
                    line: node.condition.line,
                    endLine: node.line,
                    condition: transformer.transformCondition(node.condition),
                    consequent: transformer.transformNodes(node.consequent),
                    alternate: node.alternate
                        ? transformer.transformNodes(node.alternate)
                        : null,
                };
            case "OtherwiseIfStatement":
                return {
                    type: "OtherwiseIfStatement",
                    line: node.condition.line,
                    endLine: node.line,
                    otherwiseLine: node.alternate
                        ? node.alternate[0].line
                        : null,
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
                    line: node.line,
                    endLine: node.body[node.body.length - 1].line,
                    body: transformer.transformNodes(node.body),
                };
            case "WhileLoop":
                return {
                    type: "WhileLoop",
                    condition: transformer.transformCondition(node.condition),
                    line: node.line,
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
                    line: node.line,
                };
            case "ArrayCreation":
                return {
                    type: "ArrayCreation",
                    varName: node.varName,
                    dsType: node.arrType,
                    values: node.values,
                    line: node.line,
                    unInitialised: node.unInitialised,
                };
            case "ArrayInsertion":
                return {
                    type: "ArrayInsertion",
                    line: node.line,
                    varName: node.varName,
                    value: transformer.transformExpression(node.value),
                    position:
                        node.position.type === "Expression"
                            ? transformer.transformExpression(node.position)
                            : transformer.transformExpression(node.position)
                                  .value,
                };
            case "ArraySetValue":
                return {
                    type: "ArraySetValue",
                    line: node.line,
                    varName: node.varName,
                    index: transformer.transformExpression(node.position),
                    setValue:
                        node.newValue.type === "IndexExpression"
                            ? transformer.transformExpression(node.newValue)
                            : transformer.transformExpression(node.newValue)
                                  .value,
                };
            case "SwapOperation":
                return {
                    type: "SwapOperation",
                    line: node.line,
                    varName: node.varName,
                    firstPosition: transformer.transformExpression(
                        node.firstPosition
                    ),
                    secondPosition: transformer.transformExpression(
                        node.secondPosition
                    ),
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
            case "RemoveOperation":
                return {
                    type: "RemoveOperation",
                    line: node.line,
                    varName: node.varName,
                    positionToRemove:
                        node.positionToRemove.type === "Expression"
                            ? transformer.transformExpression(
                                  node.positionToRemove
                              )
                            : transformer.transformExpression(
                                  node.positionToRemove
                              ).value,
                };
            case "LengthExpression":
                return {
                    type: "LengthExpression",
                    line: node.line,
                    source: node.source.value,
                };
            case "SubstringExpression":
                return transformer.transformSubstringExpression(node);
            case "IndexExpression":
                const transformedIndex = transformer.transformExpression(
                    node.index
                );
                return {
                    type: "IndexExpression",
                    line: node.line,
                    source: node.source.value,
                    index:
                        transformedIndex.type === "Expression"
                            ? transformedIndex
                            : transformedIndex.value,
                };
            default:
                throw new Error(`Unknown node type: ${type}`);
        }
    }
}

export default NodeTransformerFactory;
