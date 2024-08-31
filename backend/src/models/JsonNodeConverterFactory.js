/**
 * JsonNodeConverterFactory is responsible for selecting the correct node conversion
 * method for transforming intermediate representation (IR) nodes into JSON action frames.
 */
class JsonNodeConverterFactory {
    /**
     * Constructor for JsonNodeConverterFactory.
     * @param {JsonConverter} jsonConverter - The instance of JsonConverter that contains
     * the transformation methods.
     */
    constructor(jsonConverter) {
        this.jsonConverter = jsonConverter;
    }

    /**
     * Returns the appropriate node conversion method based on the node type.
     * @param {string} nodeType - The type of the node to transform.
     * @returns {function} The transformation function corresponding to the node type.
     * @throws {Error} Throws an error if the node type is unknown.
     */
    getConverter(nodeType) {
        switch (nodeType) {
            case "VariableDeclaration":
                return this.jsonConverter.transformVariableDeclaration.bind(
                    this.jsonConverter
                );
            case "FunctionDeclaration":
                return this.jsonConverter.transformFunctionDeclaration.bind(
                    this.jsonConverter
                );
            case "PrintStatement":
                return this.jsonConverter.transformPrintStatement.bind(
                    this.jsonConverter
                );
            case "IfStatement":
                return (node) => {
                    this.jsonConverter.ifDepth++;
                    const result =
                        this.jsonConverter.transformIfStatement(node);
                    if (this.jsonConverter.ifDepth === 1) {
                        this.jsonConverter.nestedEndIf = 0;
                    }
                    this.jsonConverter.ifDepth--;
                    return result;
                };
            case "OtherwiseIfStatement":
                return (node) => {
                    this.jsonConverter.ifDepth++; // Increment the IF depth
                    const result =
                        this.jsonConverter.transformOtherwiseIfStatement(node);
                    if (this.jsonConverter.ifDepth === 1) {
                        this.jsonConverter.nestedEndIf = 0; // Reset nestedEndIf if at top level
                    }
                    this.jsonConverter.ifDepth--; // Decrement the IF depth
                    return result;
                };

            case "ForLoop":
                return this.jsonConverter.transformForLoop.bind(
                    this.jsonConverter
                );
            case "WhileLoop":
                return (node) =>
                    this.jsonConverter.transformWhileOrLoopUntil(node, "while");
            case "LoopUntil":
                return (node) =>
                    this.jsonConverter.transformWhileOrLoopUntil(
                        node,
                        "loop_until"
                    );
            case "LoopFromTo":
                return this.jsonConverter.transformLoopFromTo.bind(
                    this.jsonConverter
                );
            case "ReturnStatement":
                return this.jsonConverter.transformReturnStatement.bind(
                    this.jsonConverter
                );
            case "ArrayCreation":
                return this.jsonConverter.transformArrayCreation.bind(
                    this.jsonConverter
                );
            case "ArrayInsertion":
                return this.jsonConverter.transformArrayInsertion.bind(
                    this.jsonConverter
                );
            default:
                throw new Error(`Unknown node type: ${nodeType}`);
        }
    }
}

export default JsonNodeConverterFactory;
