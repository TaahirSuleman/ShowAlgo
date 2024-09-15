class SubstringExpression {
    /**
     * @constructor
     * @param {ASTNode} string - The AST node representing the string from which to extract the substring.
     * @param {ASTNode} start - The AST node representing the start index of the substring.
     * @param {ASTNode} end - The AST node representing the end index of the substring.
     * @param {number} line - The line number where this expression appears.
     * @author Taahir Suleman
     */
    constructor(string, start, end, line) {
        this.type = "SubstringExpression";
        this.string = string;
        this.start = start;
        this.end = end;
        this.line = line;
    }
}
export default SubstringExpression;
