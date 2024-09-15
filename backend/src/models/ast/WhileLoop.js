/**
 * @author Taahir Suleman
 * @class WhileLoop
 * @description Represents a while loop in the AST, which continues executing the loop body as long as the condition is true.
 * @property {Object} condition - The condition to evaluate for each iteration of the loop.
 * @property {Array} body - The array of statements representing the body of the loop.
 * @property {number} line - The line number where the while loop is defined.
 */
class WhileLoop {
    /**
     * @constructor
     * @param {Object} condition - The condition to evaluate during each iteration.
     * @param {Array} body - The body of the loop containing the statements to execute.
     * @param {number} line - The line number where the while loop occurs.
     */
    constructor(condition, body, line) {
        this.type = "WhileLoop";
        this.condition = condition;
        this.body = body;
        this.line = line;
    }
}

export default WhileLoop;
