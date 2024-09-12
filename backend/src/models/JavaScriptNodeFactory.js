import {
    VariableDeclarationStrategy,
    FunctionDeclarationStrategy,
    ReturnStatementStrategy,
    IfStatementStrategy,
    ForLoopStrategy,
    WhileLoopStrategy,
    LoopFromToStrategy,
    LoopUntilStrategy,
    PrintStatementStrategy,
    ArrayCreationStrategy,
    ArrayInsertionStrategy,
    SubstringExpressionStrategy,
    LengthExpressionStrategy,
    IndexExpressionStrategy,
} from "./JavaScriptStrategies.js";

class JavaScriptNodeFactory {
    static createNodeGenerator(node, generator) {
        switch (node.type) {
            case "VariableDeclaration":
                return new VariableDeclarationStrategy(node, generator);
            case "FunctionDeclaration":
                return new FunctionDeclarationStrategy(node, generator);
            case "ReturnStatement":
                return new ReturnStatementStrategy(node, generator);
            case "IfStatement":
                return new IfStatementStrategy(node, generator);
            case "ForLoop":
                return new ForLoopStrategy(node, generator);
            case "WhileLoop":
                return new WhileLoopStrategy(node, generator);
            case "LoopFromTo":
                return new LoopFromToStrategy(node, generator);
            case "LoopUntil":
                return new LoopUntilStrategy(node, generator);
            case "PrintStatement":
                return new PrintStatementStrategy(node, generator);
            case "ArrayCreation":
                return new ArrayCreationStrategy(node, generator);
            case "ArrayInsertion":
                return new ArrayInsertionStrategy(node, generator);
            case "SubstringExpression":
                return new SubstringExpressionStrategy(node, generator);
            case "LengthExpression":
                return new LengthExpressionStrategy(node, generator);
            case "IndexExpression":
                return new IndexExpressionStrategy(node, generator);
            default:
                throw new Error(`Unknown node type: ${node.type}`);
        }
    }
}

export default JavaScriptNodeFactory;
