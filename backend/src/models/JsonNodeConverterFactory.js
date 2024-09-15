/**
 * @class JsonNodeConverterFactory
 * @description JsonNodeConverterFactory is responsible for selecting the correct node conversion
 * method for transforming intermediate representation (IR) nodes into JSON action frames.
 * @author Taahir Suleman
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
            case "FunctionCall":
                return this.jsonConverter.transformFunctionCall.bind(
                    this.jsonConverter
                );
            case "PrintStatement":
                return this.jsonConverter.transformPrintStatement.bind(
                    this.jsonConverter
                );
            case "IfStatement":
                return (node) => {
                    const result =
                        this.jsonConverter.transformIfStatement(node);
                    return result;
                };
            case "OtherwiseIfStatement":
                return (node) => {
                    const result =
                        this.jsonConverter.transformOtherwiseIfStatement(node);
                    return result;
                };

            case "ForLoop":
                return this.jsonConverter.transformForEachLoop.bind(
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
            case "RemoveOperation":
                return this.jsonConverter.transformRemoveOperation.bind(
                    this.jsonConverter
                );
            case "ArraySetValue":
                return this.jsonConverter.transformArraySetValue.bind(
                    this.jsonConverter
                );
            case "SwapOperation":
                return this.jsonConverter.transformSwapOperation.bind(
                    this.jsonConverter
                );
            default:
                throw new Error(`Unknown node type: ${nodeType}`);
        }
    }
}

export default JsonNodeConverterFactory;
