/**
 * @author Taahir Suleman
 * @class PrintStatement
 * @description Represents a print statement in the AST, which outputs a value to the console or output stream.
 * @property {Object} value - The value to be printed.
 * @property {number} line - The line number where the print statement is defined.
 */
class PrintStatement {
    /**
     * @constructor
     * @param {Object} value - The value to be printed.
     * @param {number} line - The line number where the print statement occurs.
     */
    constructor(value, line) {
        this.type = "PrintStatement";
        this.value = value;
        this.line = line;
    }
}

export default PrintStatement;
