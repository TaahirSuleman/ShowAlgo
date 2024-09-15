/**
 * @author Taahir Suleman
 * @class IfStatement
 * @description Represents an if statement in the AST, including the condition, consequent, and alternate (else) branches.
 * @property {Object} condition - The condition that is evaluated for the if statement.
 * @property {Array} consequent - The body of statements executed if the condition evaluates to true.
 * @property {Array|null} alternate - The body of statements executed if the condition evaluates to false (optional).
 * @property {number} line - The line number where the if statement starts.
 */
class IfStatement {
    /**
     * @constructor
     * @param {Object} condition - The condition for the if statement.
     * @param {Array} consequent - The statements to execute when the condition is true.
     * @param {Array|null} alternate - The statements to execute when the condition is false (optional).
     * @param {number} line - The line number where the if statement occurs.
     */
    constructor(condition, consequent, alternate, line) {
        this.type = "IfStatement";
        this.condition = condition;
        this.consequent = consequent;
        this.alternate = alternate;
        this.line = line;
    }
}

export default IfStatement;
