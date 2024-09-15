/**
 * @author Taahir Suleman
 * @class LoopFromTo
 * @description Represents a "for" loop that iterates from a start value to an end value in the AST.
 * @property {string} loopVariable - The variable used in the loop iteration.
 * @property {Object} range - The range of the loop, containing the start and end values.
 * @property {Array} body - The body of statements executed within the loop.
 * @property {number} line - The line number where the loop begins.
 */
class LoopFromTo {
    /**
     * @constructor
     * @param {string} loopVariable - The loop variable being iterated over.
     * @param {number|Expression} start - The start value of the loop.
     * @param {number|Expression} end - The end value of the loop.
     * @param {Array} body - The body of statements to be executed in each iteration.
     * @param {number} line - The line number where the loop is defined.
     */
    constructor(loopVariable, start, end, body, line) {
        this.type = "LoopFromTo";
        this.loopVariable = loopVariable;
        this.range = { start, end };
        this.body = body;
        this.line = line;
    }
}

export default LoopFromTo;
