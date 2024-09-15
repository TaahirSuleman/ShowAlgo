/**
 * @author Taahir Suleman
 * @class OtherwiseIfStatement
 * @description Represents an "otherwise if" (else-if) statement in the AST, used to handle conditional branching.
 * @property {Object} condition - The condition evaluated for this "else-if" statement.
 * @property {Array} consequent - The statements executed if the condition is true.
 * @property {Array|null} alternate - The alternative block of statements, executed if this condition is false and there are more conditions or an "else" block.
 * @property {number} line - The line number where the "otherwise if" statement is defined.
 */
class OtherwiseIfStatement {
    /**
     * @constructor
     * @param {Object} condition - The condition for the "otherwise if" statement.
     * @param {Array} consequent - The statements executed when the condition is true.
     * @param {Array|null} alternate - The alternative statements to execute if this condition is false.
     * @param {number} line - The line number where the statement is located.
     */
    constructor(condition, consequent, alternate, line) {
        this.type = "OtherwiseIfStatement";
        this.condition = condition;
        this.consequent = consequent;
        this.alternate = alternate;
        this.line = line;
    }
}

export default OtherwiseIfStatement;
