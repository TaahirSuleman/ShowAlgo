/**
 * @author Taahir Suleman
 * @class LoopUntil
 * @description Represents a "loop until" construct in the AST, which loops until a condition is met.
 * @property {Object} condition - The condition that, when true, terminates the loop.
 * @property {Array} body - The body of statements executed during each iteration of the loop.
 * @property {number} line - The line number where the loop begins.
 */
class LoopUntil {
    /**
     * @constructor
     * @param {Object} condition - The condition that controls when the loop terminates.
     * @param {Array} body - The statements executed inside the loop.
     * @param {number} line - The line number where the loop is defined.
     */
    constructor(condition, body, line) {
        this.type = "LoopUntil";
        this.condition = condition;
        this.body = body;
        this.line = line;
    }
}

export default LoopUntil;
