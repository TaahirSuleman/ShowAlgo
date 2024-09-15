/**
 * @author Taahir Suleman
 * @class ForLoop
 * @description Represents a for-each loop structure in the AST, where the loop iterates over a collection.
 * @property {string} iterator - The iterator variable used in the loop (e.g., 'i', 'element').
 * @property {string} collection - The collection or array being iterated over.
 * @property {Array} body - The body of the loop containing statements to be executed during each iteration.
 * @property {number} line - The line number where the loop starts in the pseudocode.
 */
class ForLoop {
    /**
     * @constructor
     * @param {string} iterator - The iterator variable used in the loop.
     * @param {string} collection - The collection or array to iterate over.
     * @param {Array} body - The body of the loop with statements to execute.
     * @param {number} line - The line number in the pseudocode where the loop begins.
     */
    constructor(iterator, collection, body, line) {
        this.type = "ForLoop";
        this.iterator = iterator;
        this.collection = collection;
        this.body = body;
        this.line = line;
    }
}

export default ForLoop;
