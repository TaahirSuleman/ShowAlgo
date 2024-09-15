/**
 * @author Taahir Suleman
 * @class NumberLiteral
 * @description Represents a number literal in the AST.
 * @property {number} value - The numeric value of the literal.
 * @property {number} line - The line number where the number literal is located.
 */
class NumberLiteral {
    /**
     * @constructor
     * @param {number} value - The numeric value of the literal.
     * @param {number} line - The line number where the literal occurs.
     */
    constructor(value, line) {
        this.type = "NumberLiteral";
        this.value = value;
        this.line = line;
    }
}

export default NumberLiteral;
