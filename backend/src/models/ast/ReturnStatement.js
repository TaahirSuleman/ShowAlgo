/**
 * @author Taahir Suleman
 * @class ReturnStatement
 * @description Represents a return statement in the AST, used to return a value from a function.
 * @property {Object} value - The value to be returned from the function.
 * @property {number} line - The line number where the return statement is defined.
 */
class ReturnStatement {
    /**
     * @constructor
     * @param {Object} value - The value returned by the return statement.
     * @param {number} line - The line number where the return statement occurs.
     */
    constructor(value, line) {
        this.type = "ReturnStatement";
        this.value = value;
        this.line = line;
    }
}

export default ReturnStatement;
