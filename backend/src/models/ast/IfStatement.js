class IfStatement {
    constructor(condition, consequent, alternate, line) {
        this.type = "IfStatement";
        this.condition = condition;
        this.consequent = consequent;
        this.alternate = alternate;
        this.line = line;
    }
}

export default IfStatement;
