class OtherwiseIfStatement {
    constructor(condition, consequent, alternate, line) {
        this.type = "OtherwiseIfStatement";
        this.condition = condition;
        this.consequent = consequent;
        this.alternate = alternate;
        this.line = line;
    }
}

export default OtherwiseIfStatement;
