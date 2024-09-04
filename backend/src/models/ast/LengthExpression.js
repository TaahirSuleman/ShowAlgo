class LengthExpression {
    /**
     * Constructs a new LengthExpression node.
     * @param {ASTNode} source - The source from which to calculate the length (string or array).
     * @param {number} line - The line number where this expression occurs in the source code.
     */
    constructor(source, line) {
        this.type = "LengthExpression";
        this.source = source; // This will be the identifier of the string or array variable.
        this.line = line;
    }
}

export default LengthExpression;
