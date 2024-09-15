/**
 * @description Represents an AST node for setting a value at a specific index in an array.
 * This node handles the operation of assigning a new value to an element in an array.
 * @author Taahir Suleman
 */
class ArraySetValue {
    /**
     * @constructor
     * @param {string} varName - The name of the array variable.
     * @param {Object} position - The position/index in the array where the value is to be set.
     * @param {Object} newValue - The new value to be assigned at the specified index.
     * @param {number} line - The line number in the pseudocode where the value assignment occurs.
     */
    constructor(varName, position, newValue, line) {
        this.type = "ArraySetValue";
        this.varName = varName;
        this.position = position;
        this.newValue = newValue;
        this.line = line;
    }
}

export default ArraySetValue;
