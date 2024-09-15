/**
 * @description Represents an AST node for an array insertion operation in the pseudocode.
 * This node is responsible for inserting values into an array at a specific position.
 * @author Taahir Suleman
 */
class ArrayInsertion {
    /**
     * @constructor
     * @param {string} varName - The name of the array variable.
     * @param {Object} value - The value to be inserted into the array.
     * @param {Object} position - The position at which to insert the value.
     * @param {number} line - The line number in the pseudocode where the insertion is performed.
     */
    constructor(varName, value, position, line) {
        this.type = "ArrayInsertion";
        this.varName = varName;
        this.value = value;
        this.position = position;
        this.line = line;
    }
}

export default ArrayInsertion;
