class BooleanLiteral {
    /**
     * @param {boolean|string} value - The boolean value or a string representation of it.
     * @param {number} line - The line number where this literal is located.
     */
    constructor(value, line) {
        this.type = "BooleanLiteral";

        // Convert string values to boolean
        if (typeof value === "string") {
            // Convert 'true' to true and 'false' to false, case-insensitive
            value = value.toLowerCase() === "true";
        }

        // Ensure the value is now a boolean
        if (typeof value !== "boolean") {
            throw new TypeError(
                `BooleanLiteral value must be a boolean. Received: ${typeof value}`
            );
        }

        this.value = value;
        this.line = line;
    }
}

export default BooleanLiteral;
