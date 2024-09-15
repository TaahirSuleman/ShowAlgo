/**
 * @author Taahir Suleman
 * @class Identifier
 * @description Represents an identifier in the AST, typically a variable or function name.
 * @property {string} value - The value of the identifier (e.g., the variable or function name).
 * @property {number} line - The line number where the identifier is declared or used.
 */
class Identifier {
    /**
     * @constructor
     * @param {string} value - The value of the identifier (e.g., variable or function name).
     * @param {number} line - The line number where the identifier is found.
     */
    constructor(value, line) {
        this.type = "Identifier";
        this.value = value;
        this.line = line;
    }
}

export default Identifier;
