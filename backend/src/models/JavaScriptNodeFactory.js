/**
 * @class JavaScriptNodeFactory
 * @description Factory class for generating JavaScript code from IR nodes.
 * @author Taahir Suleman
 */
class JavaScriptNodeFactory {
    /**
     * @constructor
     * @param {JavaScriptGenerator} generator - The main JavaScriptGenerator instance.
     */
    constructor(generator) {
        this.generator = generator;
    }

    /**
     * @method createNode
     * @description Generates code for a specific IR node type.
     * @param {Object} node - The IR node to generate code for.
     * @returns {string} The generated code for the node.
     */
    createNode(node) {
        switch (node.type) {
            case "VariableDeclaration":
                return this.generator.generateVariableDeclaration(node);
            case "FunctionDeclaration":
                return this.generator.generateFunctionDeclaration(node);
            case "ReturnStatement":
                return this.generator.generateReturnStatement(node);
            case "IfStatement":
                return this.generator.generateIfStatement(node);
            case "ForLoop":
                return this.generator.generateForLoop(node);
            case "WhileLoop":
                return this.generator.generateWhileLoop(node);
            case "LoopUntil":
                return this.generator.generateWhileLoop(node);
            case "LoopFromTo":
                return this.generator.generateLoopFromTo(node);
            case "PrintStatement":
                return this.generator.generatePrintStatement(node);
            case "ArrayCreation":
                return this.generator.generateArrayCreation(node);
            case "ArrayInsertion":
                return this.generator.generateArrayInsertion(node);
            case "RemoveOperation":
                return this.generator.generateRemoveOperation(node);
            case "ArraySetValue":
                return this.generator.generateArraySetValue(node);
            case "SwapOperation":
                return this.generator.generateSwapOperation(node);
            case "SubstringExpression":
                return this.generator.generateSubstringExpression(node);
            case "LengthExpression":
                return this.generator.generateLengthExpression(node);
            case "IndexExpression":
                return this.generator.generateIndexExpression(node);
            default:
                throw new Error(`Unknown node type: ${node.type}`);
        }
    }
}

export default JavaScriptNodeFactory;
