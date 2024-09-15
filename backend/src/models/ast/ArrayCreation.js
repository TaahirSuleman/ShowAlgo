/**
 * @description Represents an AST node for array creation in the pseudocode.
 * This node handles the initialization of arrays.
 * @author Taahir Suleman
 */
class ArrayCreation {
    /**
     * @constructor
     * @param {string} varName - The name of the array variable.
     * @param {string} arrType - The data type of the array elements.
     * @param {Array} values - The values to initialize the array with, if any.
     * @param {boolean} unInitialised - Indicates whether the array is uninitialized.
     * @param {number} line - The line number in the pseudocode where this array creation is defined.
     */
    constructor(varName, arrType, values, unInitialised, line) {
        this.type = "ArrayCreation";
        this.varName = varName;
        this.arrType = arrType;
        this.values = values;
        this.unInitialised = unInitialised;
        this.line = line;
    }
}

export default ArrayCreation;
