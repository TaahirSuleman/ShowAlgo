import Program from "./ast/Program.js";
import VariableDeclaration from "./ast/VariableDeclaration.js";
import PrintStatement from "./ast/PrintStatement.js";
import ArrayCreation from "./ast/ArrayCreation.js";
import ArrayInsertion from "./ast/ArrayInsertion.js";
import IfStatement from "./ast/IfStatement.js";
import OtherwiseIfStatement from "./ast/OtherwiseIfStatement.js";
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
import EndIf from "./ast/EndIf.js";
import SubstringExpression from "./ast/SubstringExpression.js";
import LengthExpression from "./ast/LengthExpression.js";
import IndexExpression from "./ast/IndexExpression.js";
import RemoveOperation from "./ast/RemoveOperation.js";
import ArraySetValue from "./ast/ArraySetValue.js";
import SwapOperation from "./ast/SwapOperation.js";

/**
 * @class ASTNodeFactory
 * @description Factory class responsible for creating Abstract Syntax Tree (AST) node instances.
 * It maps various node types to their corresponding classes and dynamically creates instances
 * based on the provided node type and constructor arguments.
 *
 * @author Taahir Suleman
 */
class ASTNodeFactory {
    /**
     * @constructor
     * Initializes the node types mapping, linking node type names to their corresponding classes.
     */
    constructor() {
        this.nodeTypes = {
            Program,
            VariableDeclaration,
            PrintStatement,
            ArrayCreation,
            ArrayInsertion,
            IfStatement,
            OtherwiseIfStatement,
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
            EndIf,
            SubstringExpression,
            LengthExpression,
            IndexExpression,
            RemoveOperation,
            ArraySetValue,
            SwapOperation,
        };
    }

    /**
     * Creates an instance of an AST node based on the provided type and arguments.
     *
     * @param {string} type - The type of AST node to create, corresponding to the class name.
     * @param {...any} args - The arguments to pass to the AST node's constructor.
     *
     * @returns {ASTNode} An instance of the requested AST node.
     * @throws {Error} Throws an error if the provided node type is not recognized.
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
