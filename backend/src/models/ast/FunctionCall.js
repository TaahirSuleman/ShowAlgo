class FunctionCall {
    constructor(callee, args, line) {
        this.type = "FunctionCall";
        this.callee = callee;
        this.arguments = args;
        this.line = line;
    }
}

export default FunctionCall;
