/**
 * @author Taahir Suleman
 * @class FunctionCall
 * @description Represents a function call in the AST.
 * @property {string} name - The name of the function being called.
 * @property {Array} args - The arguments passed to the function.
 * @property {number} line - The line number where the function call occurs in the pseudocode.
 */
class FunctionCall {
    /**
     * @constructor
     * @param {string} name - The name of the function being called.
     * @param {Array} args - The arguments passed to the function.
     * @param {number} line - The line number in the pseudocode where the function call occurs.
     */
    constructor(name, args, line) {
        this.type = "FunctionCall";
        this.name = name;
        this.args = args;
        this.line = line;
    }
}

export default FunctionCall;
