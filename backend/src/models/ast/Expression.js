/**
 * @author Taahir Suleman
 * @class Expression
 * @description Represents an expression in the AST, which consists of a left-hand operand, an operator, and a right-hand operand.
 * @property {Object} left - The left-hand operand of the expression.
 * @property {string} operator - The operator used in the expression (e.g., '+', '-', 'and', 'or').
 * @property {Object} right - The right-hand operand of the expression.
 * @property {number} line - The line number where this expression appears.
 */
class Expression {
    /**
     * @constructor
     * @param {Object} left - The left-hand operand of the expression.
     * @param {string} operator - The operator used in the expression (e.g., '+', '-', 'and', 'or').
     * @param {Object} right - The right-hand operand of the expression.
     * @param {number} line - The line number where this expression is located.
     */
    constructor(left, operator, right, line) {
        this.type = "Expression";
        this.left = left; // The left-hand side of the expression (could be a value or another expression)
        this.operator = operator; // The operator (e.g., '+', '-', 'and')
        this.right = right; // The right-hand side of the expression
        this.line = line; // Line number in the source code
    }
}

export default Expression;
