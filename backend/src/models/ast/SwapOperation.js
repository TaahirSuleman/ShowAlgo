/**
 * @author Taahir Suleman
 * @class SwapOperation
 * @description Represents a swap operation in the AST, which swaps two elements in an array.
 * @property {string} varName - The name of the array in which the swap occurs.
 * @property {Object} firstPosition - The first position or index of the element to swap.
 * @property {Object} secondPosition - The second position or index of the element to swap.
 * @property {number} line - The line number where the swap operation is defined.
 */
class SwapOperation {
    /**
     * @constructor
     * @param {string} varName - The name of the array.
     * @param {Object} firstPosition - The index of the first element to be swapped.
     * @param {Object} secondPosition - The index of the second element to be swapped.
     * @param {number} line - The line number where the swap operation occurs.
     */
    constructor(varName, firstPosition, secondPosition, line) {
        this.type = "SwapOperation";
        this.varName = varName;
        this.firstPosition = firstPosition;
        this.secondPosition = secondPosition;
        this.line = line;
    }
}

export default SwapOperation;
