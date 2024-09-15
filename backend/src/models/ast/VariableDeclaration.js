/**
 * @author Taahir Suleman
 * @class VariableDeclaration
 * @description Represents a variable declaration in the AST, which declares a variable with a specified type and value.
 * @property {string} varName - The name of the variable being declared.
 * @property {string|null} varType - The type of the variable (e.g., number, string, boolean) or null if not explicitly declared.
 * @property {Object} value - The initial value assigned to the variable.
 * @property {number} line - The line number where the variable declaration is defined.
 */
class VariableDeclaration {
    /**
     * @constructor
     * @param {string} varName - The name of the variable being declared.
     * @param {string|null} varType - The type of the variable, or null if not specified.
     * @param {Object} value - The initial value assigned to the variable.
     * @param {number} line - The line number where the variable declaration occurs.
     */
    constructor(varName, varType, value, line) {
        this.type = "VariableDeclaration";
        this.varName = varName;
        this.varType = varType;
        this.value = value;
        this.line = line;
    }
}

export default VariableDeclaration;
