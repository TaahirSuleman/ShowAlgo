import Program from "./ast/Program.js";
import VariableDeclaration from "./ast/VariableDeclaration.js";
import PrintStatement from "./ast/PrintStatement.js";
import ArrayCreation from "./ast/ArrayCreation.js";
import ArrayInsertion from "./ast/ArrayInsertion.js";
import IfStatement from "./ast/IfStatement.js";
import FunctionDeclaration from "./ast/FunctionDeclaration.js";
import FunctionCall from "./ast/FunctionCall.js";
import ForLoop from "./ast/ForLoop.js";
import WhileLoop from "./ast/WhileLoop.js";
import ReturnStatement from "./ast/ReturnStatement.js";
import Expression from "./ast/Expression.js";
import NumberLiteral from "./ast/NumberLiteral.js";
import StringLiteral from "./ast/StringLiteral.js";
import Identifier from "./ast/Identifier.js";
import LoopUntil from "./ast/LoopUntil.js";
import LoopFromTo from "./ast/LoopFromTo.js";
import BooleanLiteral from "./ast/BooleanLiteral.js";

/**
 * ASTNodeFactory class responsible for creating instances of AST nodes.
 */
class ASTNodeFactory {
    constructor() {
        this.nodeTypes = {
            Program, // Add Program node here
            VariableDeclaration,
            PrintStatement,
            ArrayCreation,
            ArrayInsertion,
            IfStatement,
            FunctionDeclaration,
            FunctionCall,
            ForLoop,
            WhileLoop,
            ReturnStatement,
            Expression,
            NumberLiteral,
            StringLiteral,
            Identifier,
            LoopUntil,
            LoopFromTo,
            BooleanLiteral,
        };
    }

    /**
     * Creates an instance of an AST node based on the provided type and arguments.
     * @param {string} type - The type of AST node to create.
     * @param  {...any} args - The arguments to pass to the AST node constructor.
     * @returns {ASTNode} An instance of the requested AST node.
     * @throws {Error} If the node type is unknown.
     */
    createNode(type, ...args) {
        const NodeClass = this.nodeTypes[type];
        if (!NodeClass) {
            throw new Error(`Unknown node type: ${type}`);
        }
        return new NodeClass(...args);
    }
}

export default ASTNodeFactory;
