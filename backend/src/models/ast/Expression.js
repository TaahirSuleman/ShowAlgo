class Expression {
    constructor(left, operator, right, line) {
        this.type = "Expression";
        this.left = left;
        this.operator = operator;
        this.right = right;
        this.line = line;
    }
}

export default Expression;
