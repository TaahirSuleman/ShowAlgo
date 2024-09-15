/**
 * @author Taahir Suleman
 * @class RemoveOperation
 * @description Represents a remove operation in the AST, which removes an element from an array or collection.
 * @property {string} varName - The name of the variable (array or collection) from which an element is removed.
 * @property {number} positionToRemove - The position or index of the element to remove.
 * @property {number} line - The line number where the remove operation is defined.
 */
class RemoveOperation {
    /**
     * @constructor
     * @param {string} varName - The name of the array or collection.
     * @param {number} positionToRemove - The index of the element to remove.
     * @param {number} line - The line number where the operation occurs.
     */
    constructor(varName, positionToRemove, line) {
        this.type = "RemoveOperation";
        this.varName = varName;
        this.positionToRemove = positionToRemove;
        this.line = line;
    }
}

export default RemoveOperation;
