/**
 * @author Taahir Suleman
 * @class IndexExpression
 * @description Represents an index expression in the AST, which accesses an element at a specific index in a string or array.
 * @property {string|Identifier} source - The source being indexed (e.g., a string or array).
 * @property {number|Expression} index - The index of the element being accessed.
 * @property {number} line - The line number where the index expression occurs.
 */
class IndexExpression {
    /**
     * @constructor
     * @param {string|Identifier} source - The source being indexed (e.g., string or array).
     * @param {number|Expression} index - The index being accessed.
     * @param {number} line - The line number where the index expression is used.
     */
    constructor(source, index, line) {
        this.type = "IndexExpression";
        this.source = source;
        this.index = index;
        this.line = line;
    }
}

export default IndexExpression;
