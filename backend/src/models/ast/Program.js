/**
 * @author Taahir Suleman
 * @class Program
 * @description Represents the root of the AST, containing the entire body of the program.
 * @property {Array} body - The list of all statements and declarations in the program.
 */
class Program {
    /**
     * @constructor
     * @param {Array} body - The statements and declarations that form the body of the program.
     */
    constructor(body) {
        this.type = "Program";
        this.body = body;
    }
}

export default Program;
