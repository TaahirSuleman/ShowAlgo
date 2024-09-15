/**
 * @author Taahir Suleman
 * @class FunctionDeclaration
 * @description Represents a function declaration in the AST, defining the function name, parameters, and body.
 * @property {string} name - The name of the function being declared.
 * @property {Array} params - The parameters for the function.
 * @property {Array} body - The body of the function containing statements to be executed.
 * @property {number} line - The line number where the function declaration occurs.
 */
class FunctionDeclaration {
    /**
     * @constructor
     * @param {string} name - The name of the function being declared.
     * @param {Array} params - The parameters of the function.
     * @param {Array} body - The body of the function with statements to execute.
     * @param {number} line - The line number in the pseudocode where the function is declared.
     */
    constructor(name, params, body, line) {
        this.type = "FunctionDeclaration";
        this.name = name;
        this.params = params;
        this.body = body;
        this.line = line;
    }
}

export default FunctionDeclaration;
