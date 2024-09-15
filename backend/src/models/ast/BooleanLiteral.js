/**
 * @author Taahir Suleman
 * @class BooleanLiteral
 * @description Represents a boolean literal in the AST.
 * @property {boolean} value - The boolean value represented by this literal.
 * @property {number} line - The line number where this literal appears in the source code.
 */
class BooleanLiteral {
    /**
     * @constructor
     * @param {boolean} value - The boolean value or a string representation of it.
     * @param {number} line - The line number where this literal is located.
     * @throws {TypeError} Throws an error if the provided value is not a valid boolean.
     */
    constructor(value, line) {
        this.type = "BooleanLiteral";

        // Convert string values to boolean (case-insensitive)
        if (typeof value === "string") {
            value = value.toLowerCase() === "true";
        }

        // Ensure the value is a boolean
        if (typeof value !== "boolean") {
            throw new TypeError(
                `BooleanLiteral value must be a boolean. Received: ${typeof value}`
            );
        }

        this.value = value; // The boolean value (true or false)
        this.line = line; // Line number in the source code
    }
}

export default BooleanLiteral;
