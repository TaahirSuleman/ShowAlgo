/**
 * @author Taahir Suleman
 * @class StringLiteral
 * @description Represents a string literal in the AST, holding a string value.
 * @property {string} value - The string value of the literal.
 * @property {number} line - The line number where the string literal is located.
 */
class StringLiteral {
    /**
     * @constructor
     * @param {string} value - The string value.
     * @param {number} line - The line number where the string literal occurs.
     */
    constructor(value, line) {
        this.type = "StringLiteral";
        this.value = value;
        this.line = line;
    }
}

export default StringLiteral;
