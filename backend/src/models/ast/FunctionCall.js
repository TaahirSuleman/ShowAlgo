class FunctionCall {
    /**
     * Creates an instance of a FunctionCall node.
     * @param {string} name - The name of the function being called.
     * @param {Array} args - The arguments passed to the function.
     * @param {number} line - The line number in the pseudocode where the function call occurs.
     */
    constructor(name, args, line) {
        this.type = "FunctionCall";
        this.name = name;
        this.args = args;
        this.line = line;
    }
}

export default FunctionCall;
